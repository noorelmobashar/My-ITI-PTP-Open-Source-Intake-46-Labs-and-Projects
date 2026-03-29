from __future__ import annotations

import json
from typing import Any, AsyncIterator

import httpx

from config import settings


def _extract_chunk(payload: dict) -> str:
    choices = payload.get("choices") or []
    if not choices:
        return ""

    first_choice = choices[0] or {}
    delta = first_choice.get("delta") or {}

    chunk = delta.get("content")
    if isinstance(chunk, str) and chunk:
        return chunk

    text = first_choice.get("text")
    if isinstance(text, str) and text:
        return text

    message = first_choice.get("message") or {}
    message_content = message.get("content")
    if isinstance(message_content, str) and message_content:
        return message_content

    return ""


async def stream_model_response(
    model_id: str,
    messages: list[dict[str, Any]],
) -> AsyncIterator[str]:
    if not settings.api_key:
        raise RuntimeError(
            "Missing API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env"
        )

    url = f"{settings.github_models_base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model_id,
        "messages": messages,
        "stream": True,
    }

    timeout = httpx.Timeout(
        timeout=settings.request_timeout_seconds,
        connect=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, headers=headers, json=payload) as response:
            response.raise_for_status()

            async for line in response.aiter_lines():
                if not line:
                    continue
                if not line.startswith("data:"):
                    continue

                raw_data = line[5:].strip()
                if not raw_data:
                    continue
                if raw_data == "[DONE]":
                    break

                try:
                    event = json.loads(raw_data)
                except json.JSONDecodeError:
                    continue

                if "error" in event:
                    message = event.get("error", {}).get("message") or "Upstream model error"
                    raise RuntimeError(message)

                chunk = _extract_chunk(event)
                if chunk:
                    yield chunk


def _extract_message_text(content: Any) -> str:
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if not isinstance(item, dict):
                continue
            text = item.get("text")
            if isinstance(text, str) and text.strip():
                parts.append(text.strip())
        return "\n".join(parts).strip()

    return ""


async def generate_audio_chat_completion(
    model_id: str,
    messages: list[dict[str, Any]],
    *,
    voice: str = "alloy",
    audio_format: str = "wav",
) -> dict[str, Any]:
    if not settings.api_key:
        raise RuntimeError(
            "Missing API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env"
        )

    url = f"{settings.github_models_base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model_id,
        "messages": messages,
        "stream": False,
        "modalities": ["text", "audio"],
        "audio": {
            "voice": voice,
            "format": audio_format,
        },
    }

    timeout = httpx.Timeout(
        timeout=settings.request_timeout_seconds,
        connect=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    choices = data.get("choices") or []
    first_choice = choices[0] if choices else {}
    message = first_choice.get("message") or {}
    audio = message.get("audio") or {}

    transcript = audio.get("transcript")
    if not isinstance(transcript, str):
        transcript = None

    text = _extract_message_text(message.get("content"))
    if not text and transcript:
        text = transcript

    return {
        "model": model_id,
        "text": text.strip(),
        "audio_base64": audio.get("data"),
        "audio_format": audio.get("format") or audio_format,
        "audio_transcript": transcript,
        "audio_voice": voice,
    }


async def generate_image(
    model_id: str,
    prompt: str,
    size: str,
) -> dict[str, Any]:
    if not settings.api_key:
        raise RuntimeError(
            "Missing API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env"
        )

    url = f"{settings.github_models_base_url}/images/generations"
    headers = {
        "Authorization": f"Bearer {settings.api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model_id,
        "prompt": prompt,
        "size": size,
    }

    timeout = httpx.Timeout(
        timeout=settings.request_timeout_seconds,
        connect=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    image_data = data.get("data") or []
    first = image_data[0] if image_data else {}

    return {
        "model": model_id,
        "image_base64": first.get("b64_json"),
        "image_url": first.get("url"),
        "revised_prompt": first.get("revised_prompt") or data.get("revised_prompt"),
    }
