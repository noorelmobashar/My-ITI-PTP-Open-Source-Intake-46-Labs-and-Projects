from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = (
    os.getenv("GITHUB_MODELS_API_KEY")
    or os.getenv("GITHUB_TOKEN")
    or os.getenv("API_KEY")
    or os.getenv("API-KEY")
    or ""
).strip()
BASE_URL = os.getenv("GITHUB_MODELS_BASE_URL", "https://models.inference.ai.azure.com").rstrip("/")

REPORT_PATH = ROOT / "known_models_test_report.json"
PASSED_PATH = ROOT / "passed_models.json"

# Broad known model IDs across major families. Some may be unavailable for a given account/region.
CANDIDATE_MODELS = [
    # OpenAI
    "gpt-5",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "o1",
    "o1-mini",
    "o3",
    "o3-mini",
    "o4-mini",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    # Claude
    "claude-3-haiku",
    "claude-3.5-haiku",
    "claude-3.5-sonnet",
    "claude-3.7-sonnet",
    "claude-3-opus",
    "claude-sonnet-4",
    # Llama / Meta
    "meta-llama-3-8b-instruct",
    "meta-llama-3-70b-instruct",
    "meta-llama-3.1-8b-instruct",
    "meta-llama-3.1-70b-instruct",
    "meta-llama-3.1-405b-instruct",
    "meta-llama-3.2-3b-instruct",
    "meta-llama-3.2-11b-vision-instruct",
    "meta-llama-3.2-90b-vision-instruct",
    "meta-llama-3.3-70b-instruct",
    # Mistral
    "mistral-large",
    "mistral-large-2407",
    "mistral-small",
    "mistral-nemo",
    "codestral-latest",
    "codestral-2501",
    "ministral-8b",
    "ministral-3b",
    # Phi
    "phi-3-medium-4k-instruct",
    "phi-3-medium-128k-instruct",
    "phi-3.5-mini-instruct",
    "phi-3.5-vision-instruct",
    "phi-4",
    # Cohere / AI21 / others often seen on hubs
    "command-r",
    "command-r-plus",
    "command-a",
    "jamba-1.5-mini",
    "jamba-1.5-large",
    # DeepSeek / xAI style IDs
    "deepseek-r1",
    "deepseek-v3",
    "grok-2",
    "grok-3",
    "grok-3-mini",
]

PROMPT_MESSAGES = [
    {"role": "system", "content": "You are a concise assistant."},
    {"role": "user", "content": "Reply with exactly OK."},
]


def test_model(client: httpx.Client, model_id: str) -> dict[str, Any]:
    url = f"{BASE_URL}/chat/completions"
    payload = {
        "model": model_id,
        "messages": PROMPT_MESSAGES,
        "stream": False,
        "max_tokens": 8,
        "temperature": 0,
    }

    started = time.perf_counter()
    try:
        response = client.post(url, json=payload)
        elapsed = round(time.perf_counter() - started, 3)

        if response.status_code >= 400:
            reason = response.text.strip().replace("\n", " ")
            return {
                "model_id": model_id,
                "status": "fail",
                "http_status": response.status_code,
                "reason": reason[:260],
                "elapsed_seconds": elapsed,
            }

        data = response.json()
        choices = data.get("choices") or []
        text = ""
        if choices:
            first = choices[0] or {}
            message = first.get("message") or {}
            content = message.get("content")
            if isinstance(content, str):
                text = content

        return {
            "model_id": model_id,
            "status": "pass",
            "http_status": response.status_code,
            "reason": "ok",
            "elapsed_seconds": elapsed,
            "preview": text[:120],
        }

    except Exception as exc:  # noqa: BLE001
        elapsed = round(time.perf_counter() - started, 3)
        return {
            "model_id": model_id,
            "status": "fail",
            "http_status": 0,
            "reason": str(exc)[:260],
            "elapsed_seconds": elapsed,
        }


def main() -> int:
    if not API_KEY:
        print(json.dumps({"error": "Missing GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env"}, indent=2))
        return 1

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    # Deduplicate while preserving order.
    seen: set[str] = set()
    candidates = []
    for model in CANDIDATE_MODELS:
        if model not in seen:
            candidates.append(model)
            seen.add(model)

    results: list[dict[str, Any]] = []
    passed: list[str] = []

    timeout = httpx.Timeout(timeout=35.0, connect=10.0)
    with httpx.Client(headers=headers, timeout=timeout) as client:
        total = len(candidates)
        for idx, model_id in enumerate(candidates, start=1):
            print(f"[{idx}/{total}] {model_id}")
            result = test_model(client, model_id)
            results.append(result)
            if result["status"] == "pass":
                passed.append(model_id)
                print(f"  -> PASS ({result['elapsed_seconds']}s)")
            else:
                print(f"  -> FAIL ({result['elapsed_seconds']}s): {result['http_status']} {result['reason']}")

    summary = {
        "generated_at_epoch": int(time.time()),
        "base_url": BASE_URL,
        "total": len(results),
        "passed": len(passed),
        "failed": len(results) - len(passed),
        "pass_rate_percent": round((len(passed) / len(results) * 100), 2) if results else 0.0,
        "passed_models": passed,
        "results": results,
    }

    REPORT_PATH.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    PASSED_PATH.write_text(json.dumps({"passed_models": passed}, indent=2), encoding="utf-8")

    print("\n=== SUMMARY ===")
    print(
        json.dumps(
            {
                "total": summary["total"],
                "passed": summary["passed"],
                "failed": summary["failed"],
                "pass_rate_percent": summary["pass_rate_percent"],
                "report": str(REPORT_PATH),
                "passed_models_file": str(PASSED_PATH),
            },
            indent=2,
        )
    )

    if passed:
        print("\nPASSED MODELS:")
        for model_id in passed:
            print(f"- {model_id}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
