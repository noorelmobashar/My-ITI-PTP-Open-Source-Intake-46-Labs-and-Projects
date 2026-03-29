from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

BASE_URL = "http://127.0.0.1:8000"
PROMPT = "Reply with exactly OK."
REPORT_PATH = Path("model_test_report.json")


@dataclass
class ModelResult:
    model_id: str
    label: str
    status: str
    reason: str
    token_count: int
    preview: str
    elapsed_seconds: float


def request_json(method: str, path: str, body: dict[str, Any] | None = None, timeout: float = 60.0) -> dict[str, Any]:
    data = None
    headers: dict[str, str] = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(
        BASE_URL + path,
        data=data,
        method=method,
        headers=headers,
    )

    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read().decode("utf-8")
    return json.loads(raw) if raw else {}


def delete_chat(chat_id: str) -> None:
    request = urllib.request.Request(BASE_URL + f"/api/chats/{chat_id}", method="DELETE")
    try:
        urllib.request.urlopen(request, timeout=20)
    except Exception:
        pass


def stream_model(chat_id: str, model_id: str, prompt: str) -> tuple[int, str, str | None, bool]:
    payload = json.dumps({"message": prompt, "model": model_id}).encode("utf-8")
    request = urllib.request.Request(
        BASE_URL + f"/api/chats/{chat_id}/stream",
        data=payload,
        method="POST",
        headers={"Content-Type": "application/json"},
    )

    token_chunks: list[str] = []
    error_message: str | None = None
    done = False
    event_name = "message"

    with urllib.request.urlopen(request, timeout=120) as response:
        for raw_line in response:
            line = raw_line.decode("utf-8").strip()
            if not line:
                continue

            if line.startswith("event:"):
                event_name = line.split(":", 1)[1].strip()
                continue

            if not line.startswith("data:"):
                continue

            payload_text = line.split(":", 1)[1].strip()
            try:
                payload_json = json.loads(payload_text)
            except json.JSONDecodeError:
                payload_json = {"raw": payload_text}

            if event_name == "token":
                token = payload_json.get("token")
                if isinstance(token, str) and token:
                    token_chunks.append(token)
            elif event_name == "error":
                message = payload_json.get("message")
                error_message = message if isinstance(message, str) else str(payload_json)
            elif event_name == "done":
                done = True

    preview = "".join(token_chunks).strip()[:160]
    return len(token_chunks), preview, error_message, done


def test_one_model(model_id: str, label: str) -> ModelResult:
    started = time.perf_counter()
    chat_id: str | None = None

    try:
        created = request_json("POST", "/api/chats", {"model": model_id})
        chat_id = str(created.get("id", ""))
        if not chat_id:
            return ModelResult(
                model_id=model_id,
                label=label,
                status="fail",
                reason="create chat did not return chat id",
                token_count=0,
                preview="",
                elapsed_seconds=round(time.perf_counter() - started, 3),
            )

        token_count, preview, stream_error, done = stream_model(chat_id, model_id, PROMPT)

        if stream_error:
            return ModelResult(
                model_id=model_id,
                label=label,
                status="fail",
                reason=stream_error,
                token_count=token_count,
                preview=preview,
                elapsed_seconds=round(time.perf_counter() - started, 3),
            )

        if not done:
            return ModelResult(
                model_id=model_id,
                label=label,
                status="fail",
                reason="stream finished without done event",
                token_count=token_count,
                preview=preview,
                elapsed_seconds=round(time.perf_counter() - started, 3),
            )

        if token_count == 0:
            return ModelResult(
                model_id=model_id,
                label=label,
                status="fail",
                reason="no token events received",
                token_count=0,
                preview=preview,
                elapsed_seconds=round(time.perf_counter() - started, 3),
            )

        return ModelResult(
            model_id=model_id,
            label=label,
            status="pass",
            reason="ok",
            token_count=token_count,
            preview=preview,
            elapsed_seconds=round(time.perf_counter() - started, 3),
        )

    except urllib.error.HTTPError as exc:
        body = ""
        try:
            body = exc.read().decode("utf-8")
        except Exception:
            body = ""
        return ModelResult(
            model_id=model_id,
            label=label,
            status="fail",
            reason=f"HTTP {exc.code}: {body[:220]}",
            token_count=0,
            preview="",
            elapsed_seconds=round(time.perf_counter() - started, 3),
        )
    except Exception as exc:  # noqa: BLE001
        return ModelResult(
            model_id=model_id,
            label=label,
            status="fail",
            reason=str(exc),
            token_count=0,
            preview="",
            elapsed_seconds=round(time.perf_counter() - started, 3),
        )
    finally:
        if chat_id:
            delete_chat(chat_id)


def main() -> int:
    try:
        health = request_json("GET", "/api/health")
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"error": f"Server unreachable: {exc}"}, indent=2))
        return 1

    if health.get("status") != "ok":
        print(json.dumps({"error": "Server health endpoint did not return ok"}, indent=2))
        return 1

    models_payload = request_json("GET", "/api/models")
    models = models_payload.get("models", [])

    if not isinstance(models, list) or not models:
        print(json.dumps({"error": "No models returned by /api/models"}, indent=2))
        return 1

    results: list[ModelResult] = []
    total = len(models)

    for index, model in enumerate(models, start=1):
        model_id = str(model.get("id", "")).strip()
        label = str(model.get("label", model_id))
        if not model_id:
            continue

        print(f"[{index}/{total}] Testing: {label} ({model_id})")
        result = test_one_model(model_id, label)
        results.append(result)
        print(f"  -> {result.status.upper()} ({result.elapsed_seconds}s): {result.reason}")

    passed = [r for r in results if r.status == "pass"]
    failed = [r for r in results if r.status == "fail"]

    summary = {
        "generated_at_epoch": int(time.time()),
        "base_url": BASE_URL,
        "prompt": PROMPT,
        "total": len(results),
        "passed": len(passed),
        "failed": len(failed),
        "pass_rate_percent": round((len(passed) / len(results) * 100), 2) if results else 0.0,
        "results": [
            {
                "model_id": r.model_id,
                "label": r.label,
                "status": r.status,
                "reason": r.reason,
                "token_count": r.token_count,
                "preview": r.preview,
                "elapsed_seconds": r.elapsed_seconds,
            }
            for r in results
        ],
    }

    REPORT_PATH.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("\n=== SUMMARY ===")
    print(json.dumps({
        "total": summary["total"],
        "passed": summary["passed"],
        "failed": summary["failed"],
        "pass_rate_percent": summary["pass_rate_percent"],
        "report": str(REPORT_PATH.resolve()),
    }, indent=2))

    if failed:
        print("\n=== FAILURES ===")
        for item in failed:
            print(f"- {item.label} ({item.model_id}) -> {item.reason}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
