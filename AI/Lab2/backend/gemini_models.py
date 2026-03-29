from __future__ import annotations

import json
import struct
import wave
import io
import base64
from typing import Any, AsyncIterator

import httpx

from config import settings


_GEMINI_TTS_VOICE_MAP: dict[str, str] = {
    "alloy": "Kore",
    "echo": "Charon",
    "fable": "Aoede",
    "onyx": "Orus",
    "nova": "Leda",
    "shimmer": "Zephyr",
}

_DEFAULT_GEMINI_VOICE = "Kore"


def _extract_inline_image(candidate: dict[str, Any]) -> str | None:
    content = candidate.get("content") or {}
    parts = content.get("parts") or []
    if not isinstance(parts, list):
        return None

    for part in parts:
        if not isinstance(part, dict):
            continue

        inline_data = part.get("inlineData") or part.get("inline_data") or {}
        if not isinstance(inline_data, dict):
            continue

        data = inline_data.get("data")
        if isinstance(data, str) and data.strip():
            return data.strip()

    return None


async def generate_image_with_gemini(model_id: str, prompt: str) -> dict[str, Any]:
    if not settings.gemini_api_key:
        raise RuntimeError("Missing GEMINI_API_KEY in .env")

    url = f"{settings.gemini_base_url}/models/{model_id}:generateContent"
    params = {"key": settings.gemini_api_key}

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }

    timeout = httpx.Timeout(timeout=settings.request_timeout_seconds, connect=20.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, params=params, json=payload)
        response.raise_for_status()
        data = response.json()

    candidates = data.get("candidates") or []
    image_base64 = None
    if isinstance(candidates, list):
        for candidate in candidates:
            if isinstance(candidate, dict):
                image_base64 = _extract_inline_image(candidate)
                if image_base64:
                    break

    if not image_base64:
        raise RuntimeError("Gemini did not return an image payload.")

    return {
        "model": f"gemini:{model_id}",
        "image_base64": image_base64,
        "image_url": None,
        "revised_prompt": None,
    }


def _message_to_gemini_content(message: dict[str, Any]) -> dict[str, Any]:
    role = "model" if message.get("role") == "assistant" else "user"
    raw_content = message.get("content")

    if isinstance(raw_content, str):
        return {
            "role": role,
            "parts": [{"text": raw_content.strip()}],
        }

    if isinstance(raw_content, list):
        parts: list[dict[str, Any]] = []
        for item in raw_content:
            if not isinstance(item, dict):
                continue
            item_type = item.get("type")
            if item_type == "text":
                text = str(item.get("text") or "").strip()
                if text:
                    parts.append({"text": text})
            elif item_type == "image_url":
                image_url = item.get("image_url") or {}
                if isinstance(image_url, dict):
                    url = str(image_url.get("url") or "")
                    if url.startswith("data:") and ";base64," in url:
                        prefix, data = url.split(";base64,", 1)
                        mime_type = prefix[5:] or "image/png"
                        parts.append({
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": data,
                            }
                        })
        return {
            "role": role,
            "parts": parts or [{"text": ""}],
        }

    return {
        "role": role,
        "parts": [{"text": ""}],
    }


def _extract_text_response(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    if not isinstance(candidates, list):
        return ""

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue

        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        if not isinstance(parts, list):
            continue

        collected: list[str] = []
        for part in parts:
            if not isinstance(part, dict):
                continue
            text = part.get("text")
            if isinstance(text, str) and text:
                collected.append(text)

        joined = "".join(collected).strip()
        if joined:
            return joined

    return ""


async def stream_gemini_response(
    model_id: str,
    messages: list[dict[str, Any]],
) -> AsyncIterator[str]:
    if not settings.gemini_api_key:
        raise RuntimeError("Missing GEMINI_API_KEY in .env")

    url = f"{settings.gemini_base_url}/models/{model_id}:streamGenerateContent"
    params = {
        "alt": "sse",
        "key": settings.gemini_api_key,
    }
    def _has_content(message: dict[str, Any]) -> bool:
        raw = message.get("content")
        if isinstance(raw, str):
            return bool(raw.strip())
        if isinstance(raw, list):
            return bool(raw)
        return bool(raw)

    payload = {
        "contents": [
            _message_to_gemini_content(message)
            for message in messages
            if _has_content(message)
        ],
    }

    timeout = httpx.Timeout(timeout=settings.request_timeout_seconds, connect=20.0)
    full_text = ""

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, params=params, json=payload) as response:
            response.raise_for_status()

            async for line in response.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue

                raw = line[5:].strip()
                if not raw:
                    continue

                try:
                    event = json.loads(raw)
                except json.JSONDecodeError:
                    continue

                chunk = _extract_text_response(event)
                if not chunk:
                    continue

                if chunk.startswith(full_text):
                    delta = chunk[len(full_text):]
                    full_text = chunk
                    if delta:
                        yield delta
                    continue

                full_text += chunk
                yield chunk


def _pcm_to_wav_base64(
    pcm_base64: str,
    sample_rate: int = 24000,
    channels: int = 1,
    sample_width: int = 2,
) -> str:
    """Wrap raw PCM base64 data in a WAV container and return as base64."""
    pcm_bytes = base64.b64decode(pcm_base64)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def _resolve_gemini_voice(voice: str) -> str:
    """Map OpenAI-style voice names to Gemini prebuilt voices."""
    lowered = (voice or "").strip().lower()
    mapped = _GEMINI_TTS_VOICE_MAP.get(lowered)
    if mapped:
        return mapped
    # If the user already passed a Gemini voice name, use it directly
    if lowered:
        return voice.strip()
    return _DEFAULT_GEMINI_VOICE


async def get_gemini_chat_response(
    chat_model: str,
    messages: list[dict[str, Any]],
) -> str:
    """Get a plain text response from a Gemini chat model.

    Used as step 1 of the two-step TTS flow: chat → text → TTS → audio.
    """
    if not settings.gemini_api_key:
        raise RuntimeError("Missing GEMINI_API_KEY in .env")

    url = f"{settings.gemini_base_url}/models/{chat_model}:generateContent"
    params = {"key": settings.gemini_api_key}

    def _has_content(message: dict[str, Any]) -> bool:
        raw = message.get("content")
        if isinstance(raw, str):
            return bool(raw.strip())
        if isinstance(raw, list):
            return bool(raw)
        return bool(raw)

    payload = {
        "contents": [
            _message_to_gemini_content(message)
            for message in messages
            if _has_content(message)
        ],
    }

    timeout = httpx.Timeout(timeout=settings.request_timeout_seconds, connect=20.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, params=params, json=payload)
        response.raise_for_status()
        data = response.json()

    return _extract_text_response(data)


async def generate_audio_with_gemini(
    tts_model: str,
    text: str,
    *,
    voice: str = "alloy",
    chat_model: str | None = None,
    messages: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Generate TTS audio via the Gemini TTS API.

    If ``messages`` and ``chat_model`` are provided, a two-step flow is used:
    1.  Get a text response from the chat model.
    2.  Convert that text response to speech with the TTS model.

    If only ``text`` is provided, it is spoken directly.

    Returns a dict compatible with the AudioMessageResponse schema.
    """
    if not settings.gemini_api_key:
        raise RuntimeError("Missing GEMINI_API_KEY in .env")

    # Step 1 — obtain the text to speak
    if messages and chat_model:
        # Two-step: ask a chat model first, then speak the answer
        assistant_text = await get_gemini_chat_response(chat_model, messages)
        if not assistant_text:
            assistant_text = "I was not able to generate a response this time."
        spoken_text = assistant_text
    else:
        spoken_text = text
        assistant_text = text

    # Step 2 — convert text to audio via TTS
    gemini_voice = _resolve_gemini_voice(voice)
    url = f"{settings.gemini_base_url}/models/{tts_model}:generateContent"
    params = {"key": settings.gemini_api_key}

    # Format as a clear TTS instruction so the model doesn't try to generate text
    tts_prompt = f"Read the following text aloud:\n\n{spoken_text}"

    payload = {
        "contents": [
            {
                "parts": [{"text": tts_prompt}],
            }
        ],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": gemini_voice,
                    }
                }
            },
        },
    }

    timeout = httpx.Timeout(timeout=settings.request_timeout_seconds, connect=20.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, params=params, json=payload)
        response.raise_for_status()
        data = response.json()

    # Extract audio from response
    candidates = data.get("candidates") or []
    audio_base64_pcm = None
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        for part in parts:
            if not isinstance(part, dict):
                continue
            inline_data = part.get("inlineData") or part.get("inline_data") or {}
            if isinstance(inline_data, dict):
                part_data = inline_data.get("data")
                if isinstance(part_data, str) and part_data.strip():
                    audio_base64_pcm = part_data.strip()
                    break
        if audio_base64_pcm:
            break

    if not audio_base64_pcm:
        raise RuntimeError("Gemini TTS did not return audio data.")

    # Convert raw PCM to WAV so browsers can play it
    wav_base64 = _pcm_to_wav_base64(audio_base64_pcm)

    return {
        "model": f"gemini:{tts_model}",
        "text": assistant_text,
        "audio_base64": wav_base64,
        "audio_format": "wav",
        "audio_transcript": assistant_text,
        "audio_voice": gemini_voice,
    }
