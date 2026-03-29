from __future__ import annotations

import asyncio
import base64
from time import monotonic
from typing import Any
from urllib.parse import quote

import httpx

from config import settings


def _parse_size(size: str) -> tuple[int | None, int | None]:
    raw = (size or "").strip().lower()
    if "x" not in raw:
        return None, None

    left, _, right = raw.partition("x")
    try:
        width = int(left.strip())
        height = int(right.strip())
    except ValueError:
        return None, None

    if width <= 0 or height <= 0:
        return None, None

    return width, height


def _extract_image_base64_from_json(payload: Any) -> str | None:
    if isinstance(payload, dict):
        for key in ("b64_json", "image_base64", "image"):
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                cleaned = value.strip()
                if cleaned.startswith("data:") and "," in cleaned:
                    cleaned = cleaned.split(",", 1)[1]
                return cleaned

        data = payload.get("data")
        if isinstance(data, list) and data:
            return _extract_image_base64_from_json(data[0])

    if isinstance(payload, list) and payload:
        first = payload[0]
        if isinstance(first, str) and first.strip():
            return first.strip()
        return _extract_image_base64_from_json(first)

    return None


def _extract_image_url_from_json(payload: Any) -> str | None:
    if isinstance(payload, dict):
        for key in ("url", "image_url"):
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

        output = payload.get("output")
        if isinstance(output, str) and output.strip():
            return output.strip()
        if isinstance(output, list) and output:
            first = output[0]
            if isinstance(first, str) and first.strip():
                return first.strip()

        data = payload.get("data")
        if isinstance(data, list) and data:
            return _extract_image_url_from_json(data[0])

    if isinstance(payload, list) and payload:
        first = payload[0]
        if isinstance(first, str) and first.strip():
            return first.strip()
        return _extract_image_url_from_json(first)

    return None


def _build_image_response(model_id: str, image_base64: str | None, image_url: str | None) -> dict[str, Any]:
    return {
        "model": f"hf:{model_id}",
        "image_base64": image_base64,
        "image_url": image_url,
        "revised_prompt": None,
    }


async def _generate_image_via_legacy_or_configured_endpoint(
    model_id: str,
    prompt: str,
    size: str,
) -> dict[str, Any]:
    encoded_model = quote(model_id.strip(), safe="/-_.")
    url = f"{settings.hugging_face_base_url}/{encoded_model}"
    headers = {
        "Authorization": f"Bearer {settings.hugging_face_api_key}",
        "Accept": "image/png",
        "Content-Type": "application/json",
    }

    width, height = _parse_size(size)

    payload: dict[str, Any] = {
        "inputs": prompt,
        "options": {
            "wait_for_model": True,
        },
    }

    if width and height:
        payload["parameters"] = {
            "width": width,
            "height": height,
        }

    timeout = httpx.Timeout(timeout=settings.request_timeout_seconds, connect=20.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()

    content_type = (response.headers.get("content-type") or "").strip().lower()

    if content_type.startswith("image/"):
        image_base64 = base64.b64encode(response.content).decode("ascii")
        return _build_image_response(model_id, image_base64, None)

    json_payload = response.json()
    image_base64 = _extract_image_base64_from_json(json_payload)
    if image_base64:
        return _build_image_response(model_id, image_base64, None)

    image_url = _extract_image_url_from_json(json_payload)
    if image_url:
        return _build_image_response(model_id, None, image_url)

    raise RuntimeError("Hugging Face did not return an image payload.")


async def _generate_image_via_router_replicate(
    model_id: str,
    prompt: str,
    size: str,
) -> dict[str, Any]:
    encoded_model = quote(model_id.strip(), safe="/-_.")
    create_url = f"https://router.huggingface.co/replicate/v1/models/{encoded_model}/predictions"
    headers = {
        "Authorization": f"Bearer {settings.hugging_face_api_key}",
        "Content-Type": "application/json",
    }

    width, height = _parse_size(size)
    input_payload: dict[str, Any] = {
        "prompt": prompt,
    }

    # Replicate models often support width/height on the top-level input object.
    if width and height:
        input_payload["width"] = width
        input_payload["height"] = height

    payload = {
        "input": input_payload,
    }

    timeout = httpx.Timeout(timeout=max(settings.request_timeout_seconds, 30), connect=20.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        create_response = await client.post(create_url, headers=headers, json=payload)
        create_response.raise_for_status()
        prediction = create_response.json()

        initial_url = _extract_image_url_from_json(prediction)
        initial_base64 = _extract_image_base64_from_json(prediction)
        if initial_url or initial_base64:
            return _build_image_response(model_id, initial_base64, initial_url)

        prediction_id = str(prediction.get("id") or "").strip()
        if not prediction_id:
            raise RuntimeError("Replicate did not return a prediction id.")

        status_url = f"https://router.huggingface.co/replicate/v1/predictions/{prediction_id}"
        deadline = monotonic() + max(settings.request_timeout_seconds, 30)

        while monotonic() < deadline:
            status_response = await client.get(status_url, headers={"Authorization": headers["Authorization"]})
            status_response.raise_for_status()
            status_payload = status_response.json()

            image_url = _extract_image_url_from_json(status_payload)
            image_base64 = _extract_image_base64_from_json(status_payload)
            if image_url or image_base64:
                return _build_image_response(model_id, image_base64, image_url)

            status = str(status_payload.get("status") or "").strip().lower()
            if status in {"failed", "canceled", "cancelled"}:
                detail = status_payload.get("error") or f"Prediction status: {status}"
                raise RuntimeError(f"Hugging Face Replicate inference failed: {detail}")

            await asyncio.sleep(1.5)

    raise RuntimeError("Timed out while waiting for Hugging Face Replicate image output.")


async def generate_image_with_huggingface(
    model_id: str,
    prompt: str,
    size: str,
) -> dict[str, Any]:
    if not settings.hugging_face_api_key:
        raise RuntimeError("Missing HUGGING_FACE_API_KEY in .env")

    try:
        return await _generate_image_via_legacy_or_configured_endpoint(model_id, prompt, size)
    except httpx.HTTPStatusError as exc:
        status_code = exc.response.status_code if exc.response is not None else None
        # api-inference.huggingface.co is deprecated (410) and some models are unavailable there (404).
        if status_code in {404, 410}:
            return await _generate_image_via_router_replicate(model_id, prompt, size)
        raise
