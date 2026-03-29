from __future__ import annotations

import asyncio
from time import monotonic
from typing import Any

import httpx

from config import settings


FRIENDLY_MODEL_NAMES: dict[str, str] = {
    "gpt-5": "GPT-5",
    "gpt-5-mini": "GPT-5 Mini",
    "gpt-5-nano": "GPT-5 Nano",
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
    "gpt-4.1": "GPT-4.1",
    "gpt-4.1-mini": "GPT-4.1 Mini",
    "gpt-4.1-nano": "GPT-4.1 Nano",
    "gpt-4-turbo": "GPT-4 Turbo",
    "gpt-4": "GPT-4",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "o1": "o1",
    "o1-mini": "o1 Mini",
    "o1-preview": "o1 Preview",
    "o3": "o3",
    "o3-mini": "o3 Mini",
    "o4-mini": "o4 Mini",
    "claude-3-haiku": "Claude 3 Haiku",
    "claude-3.5-haiku": "Claude 3.5 Haiku",
    "claude-3.5-sonnet": "Claude 3.5 Sonnet",
    "claude-3.7-sonnet": "Claude 3.7 Sonnet",
    "claude-3-opus": "Claude 3 Opus",
    "claude-sonnet-4": "Claude Sonnet 4",
    "meta-llama-3-8b-instruct": "Llama 3 8B Instruct",
    "meta-llama-3-70b-instruct": "Llama 3 70B Instruct",
    "meta-llama-3.1-8b-instruct": "Llama 3.1 8B Instruct",
    "meta-llama-3.1-70b-instruct": "Llama 3.1 70B Instruct",
    "meta-llama-3.1-405b-instruct": "Llama 3.1 405B Instruct",
    "meta-llama-3.2-3b-instruct": "Llama 3.2 3B Instruct",
    "meta-llama-3.2-11b-vision-instruct": "Llama 3.2 11B Vision Instruct",
    "meta-llama-3.2-90b-vision-instruct": "Llama 3.2 90B Vision Instruct",
    "meta-llama-3.3-70b-instruct": "Llama 3.3 70B Instruct",
    "mistral-large": "Mistral Large",
    "mistral-large-2407": "Mistral Large 2407",
    "mistral-small": "Mistral Small",
    "mistral-nemo": "Mistral NeMo",
    "codestral-latest": "Codestral Latest",
    "codestral-2501": "Codestral 2501",
    "ministral-8b": "Ministral 8B",
    "ministral-3b": "Ministral 3B",
    "command-r": "Command R",
    "command-r-plus": "Command R+",
    "command-a": "Command A",
    "jamba-1.5-mini": "Jamba 1.5 Mini",
    "jamba-1.5-large": "Jamba 1.5 Large",
    "phi-3-medium-4k-instruct": "Phi-3 Medium 4K Instruct",
    "phi-3-medium-128k-instruct": "Phi-3 Medium 128K Instruct",
    "phi-3.5-mini-instruct": "Phi-3.5 Mini Instruct",
    "phi-3.5-vision-instruct": "Phi-3.5 Vision Instruct",
    "phi-4": "Phi-4",
    "deepseek-r1": "DeepSeek R1",
    "deepseek-v3": "DeepSeek V3",
    "grok-2": "Grok 2",
    "grok-3": "Grok 3",
    "grok-3-mini": "Grok 3 Mini",
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-2.5-flash-image": "Gemini 2.5 Flash Image \ud83c\udf4c",
    "gemini-2.5-flash-preview-tts": "Gemini 2.5 Flash TTS",
    "gemini-2.5-pro-preview-tts": "Gemini 2.5 Pro TTS",
}

_NON_CHAT_HINTS = (
    "embed",
    "embedding",
    "moderation",
    "omni-moderation",
    "tts",
    "whisper",
    "transcribe",
    "dall-e",
    "image",
    "realtime",
)

_CACHE_LOCK = asyncio.Lock()
_CACHED_MODEL_IDS: list[str] = []
_CACHE_EXPIRES_AT = 0.0
_CACHED_MODEL_CAPABILITIES: dict[str, dict[str, bool]] = {}
_CACHED_IMAGE_MODEL_IDS: list[str] = []
_CACHED_REGISTRY_MODEL_IDS: list[str] = []


def _extract_readable_model_segment(model_id: str) -> str:
    if "/models/" in model_id and "/versions/" in model_id:
        after_models = model_id.split("/models/", 1)[1]
        return after_models.split("/versions/", 1)[0]

    if "/" in model_id:
        return model_id.split("/")[-1]

    return model_id


def _friendly_fallback(model_id: str) -> str:
    raw = _extract_readable_model_segment(model_id).replace(":", " ")
    spaced = raw.replace("-", " ").replace("_", " ")
    name = " ".join(chunk for chunk in spaced.split() if chunk)
    if not name:
        return model_id

    title = name.title()
    replacements = {
        "Gpt": "GPT",
        "Llm": "LLM",
        "Ai": "AI",
        "R1": "R1",
        "V3": "V3",
        "O1": "o1",
        "O3": "o3",
        "O4": "o4",
        "Nemo": "NeMo",
    }

    for old, new in replacements.items():
        title = title.replace(old, new)

    return title


def friendly_name_for_model(model_id: str) -> str:
    readable_id = _extract_readable_model_segment(model_id)
    lowered = readable_id.lower()

    if readable_id in FRIENDLY_MODEL_NAMES:
        return FRIENDLY_MODEL_NAMES[readable_id]
    if lowered in FRIENDLY_MODEL_NAMES:
        return FRIENDLY_MODEL_NAMES[lowered]

    return _friendly_fallback(readable_id)


def _looks_chat_capable(model_id: str) -> bool:
    lowered = model_id.lower()
    return not any(hint in lowered for hint in _NON_CHAT_HINTS)


def _looks_image_generation_capable(model_id: str) -> bool:
    lowered = model_id.lower()
    hints = (
        "gpt-image",
        "dall-e",
        "stable-diffusion",
        "sdxl",
        "flux",
        "recraft",
        "image-gen",
    )
    return any(hint in lowered for hint in hints)


def _extract_payload_models(payload: Any) -> list[Any]:
    if isinstance(payload, list):
        return payload

    if isinstance(payload, dict):
        data = payload.get("data")
        if isinstance(data, list):
            return data

        models = payload.get("models")
        if isinstance(models, list):
            return models

    return []


def _extract_model_id(item: Any) -> str:
    if isinstance(item, str):
        return item.strip()

    if isinstance(item, dict):
        candidates = [
            item.get("id"),
            item.get("model"),
            item.get("name"),
        ]
        for candidate in candidates:
            if isinstance(candidate, str) and candidate.strip():
                return candidate.strip()

    return ""


def _inferred_capabilities(model_id: str) -> dict[str, bool]:
    readable = _extract_readable_model_segment(model_id).lower()
    lowered_id = model_id.lower()

    accepts_image = (
        "vision" in readable
        or "4o" in readable
        or readable.startswith("gpt-5")
        or readable.startswith("gemini-2")
        or readable.startswith("gemini-3")
        or (lowered_id.startswith("hf:") and "image" in readable)
    )

    accepts_audio = (
        "audio" in readable
        or "realtime" in readable
        or "tts" in readable
    )

    return {
        "accepts_text": True,
        "accepts_image": accepts_image,
        "accepts_audio": accepts_audio,
    }


def _extract_modalities(item: dict[str, Any]) -> set[str]:
    modalities: set[str] = set()

    candidates = [
        item.get("modalities"),
        item.get("input_modalities"),
        item.get("inputModalities"),
        item.get("supported_input_modalities"),
    ]

    for candidate in candidates:
        if isinstance(candidate, list):
            for entry in candidate:
                if isinstance(entry, str) and entry.strip():
                    modalities.add(entry.strip().lower())

    capabilities = item.get("capabilities")
    if isinstance(capabilities, dict):
        for key, value in capabilities.items():
            if isinstance(value, bool) and value:
                modalities.add(str(key).strip().lower())

    return modalities


def _capabilities_from_item(item: Any, model_id: str) -> dict[str, bool]:
    capability = _inferred_capabilities(model_id)

    if not isinstance(item, dict):
        return capability

    modalities = _extract_modalities(item)
    if not modalities:
        return capability

    mapping = {
        "text": "accepts_text",
        "input_text": "accepts_text",
        "image": "accepts_image",
        "input_image": "accepts_image",
        "vision": "accepts_image",
        "audio": "accepts_audio",
        "input_audio": "accepts_audio",
    }

    for modality in modalities:
        mapped = mapping.get(modality)
        if mapped:
            capability[mapped] = True

    return capability


def _capabilities_for_model(model_id: str) -> dict[str, bool]:
    direct = _CACHED_MODEL_CAPABILITIES.get(model_id)
    if direct:
        return direct

    readable = _extract_readable_model_segment(model_id).lower()
    for known_id, capability in _CACHED_MODEL_CAPABILITIES.items():
        if _extract_readable_model_segment(known_id).lower() == readable:
            return capability

    return _inferred_capabilities(model_id)


async def _discover_remote_models() -> tuple[list[str], dict[str, dict[str, bool]]]:
    if not settings.api_key:
        return [], {}

    url = f"{settings.github_models_base_url}/models"
    headers = {
        "Authorization": f"Bearer {settings.api_key}",
    }

    timeout = httpx.Timeout(timeout=min(settings.request_timeout_seconds, 30), connect=10)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        payload = response.json()

    discovered: list[str] = []
    capabilities: dict[str, dict[str, bool]] = {}
    for item in _extract_payload_models(payload):
        model_id = _extract_model_id(item)
        if not model_id:
            continue
        capabilities[model_id] = _capabilities_from_item(item, model_id)
        if not _looks_chat_capable(model_id):
            continue
        discovered.append(model_id)

    unique_sorted = sorted(set(discovered), key=str.lower)
    return unique_sorted, capabilities


def _merge_with_fallback_models(discovered: list[str]) -> list[str]:
    gemini_models = [
        f"gemini:{model_id.strip()}"
        for model_id in settings.gemini_chat_models
        if settings.gemini_api_key and model_id.strip()
    ]

    gemini_tts_models = [
        f"gemini:{model_id.strip()}"
        for model_id in settings.gemini_tts_models
        if settings.gemini_api_key and model_id.strip()
    ]

    gemini_img_models = [
        f"gemini:{model_id.strip()}"
        for model_id in settings.gemini_image_models
        if settings.gemini_api_key and model_id.strip()
    ]

    hf_img_models = [
        f"hf:{model_id.strip()}"
        for model_id in settings.hugging_face_image_models
        if settings.hugging_face_api_key and model_id.strip()
    ]

    if settings.model_strict_allowlist:
        strict: list[str] = []
        seen: set[str] = set()

        for model_id in (
            settings.allowed_models
            + gemini_models
            + gemini_tts_models
            + gemini_img_models
            + hf_img_models
        ):
            normalized = (model_id or "").strip()
            if not normalized or normalized in seen:
                continue
            strict.append(normalized)
            seen.add(normalized)

        return strict

    merged: list[str] = []
    seen: set[str] = set()

    for model_id in (
        discovered
        + settings.allowed_models
        + gemini_models
        + gemini_tts_models
        + gemini_img_models
        + hf_img_models
    ):
        normalized = (model_id or "").strip()
        if not normalized or normalized in seen:
            continue
        merged.append(normalized)
        seen.add(normalized)

    return merged


async def get_available_models(force_refresh: bool = False) -> list[str]:
    global _CACHE_EXPIRES_AT
    global _CACHED_MODEL_IDS
    global _CACHED_MODEL_CAPABILITIES
    global _CACHED_IMAGE_MODEL_IDS
    global _CACHED_REGISTRY_MODEL_IDS

    now = monotonic()
    if not force_refresh and _CACHED_MODEL_IDS and now < _CACHE_EXPIRES_AT:
        return list(_CACHED_MODEL_IDS)

    async with _CACHE_LOCK:
        now = monotonic()
        if not force_refresh and _CACHED_MODEL_IDS and now < _CACHE_EXPIRES_AT:
            return list(_CACHED_MODEL_IDS)

        try:
            discovered, capabilities = await _discover_remote_models()
        except Exception:
            discovered = []
            capabilities = {}

        registry_model_ids = list(dict.fromkeys(list(capabilities.keys()) + discovered))
        _CACHED_REGISTRY_MODEL_IDS = registry_model_ids

        merged_models = _merge_with_fallback_models(discovered)
        _CACHED_MODEL_IDS = merged_models
        _CACHED_MODEL_CAPABILITIES = capabilities

        discovered_images = [
            model_id for model_id in registry_model_ids if _looks_image_generation_capable(model_id)
        ]

        if settings.model_strict_allowlist:
            allowed = []
            registry_set = set(registry_model_ids)
            for model_id in settings.image_allowed_models:
                normalized = (model_id or "").strip()
                if not normalized:
                    continue
                if registry_model_ids and normalized not in registry_set:
                    continue
                allowed.append(normalized)
            _CACHED_IMAGE_MODEL_IDS = list(dict.fromkeys(allowed))
        else:
            merged_image_ids: list[str] = []
            seen_image: set[str] = set()
            registry_set = set(registry_model_ids)
            for model_id in discovered_images + settings.image_allowed_models:
                normalized = (model_id or "").strip()
                if not normalized or normalized in seen_image:
                    continue
                if registry_model_ids and normalized not in registry_set:
                    continue
                merged_image_ids.append(normalized)
                seen_image.add(normalized)
            _CACHED_IMAGE_MODEL_IDS = merged_image_ids

        refresh_after = max(30, settings.model_discovery_refresh_seconds)
        _CACHE_EXPIRES_AT = monotonic() + refresh_after

        return list(_CACHED_MODEL_IDS)


async def get_model_infos() -> list[dict[str, Any]]:
    model_ids = await get_available_models()
    return [
        {
            "id": model_id,
            "label": friendly_name_for_model(model_id),
            "context_window": settings.context_window_for(model_id),
            **_capabilities_for_model(model_id),
        }
        for model_id in model_ids
    ]


def model_id_supports_images(model_id: str) -> bool:
    return bool(_capabilities_for_model(model_id).get("accepts_image"))


def model_id_is_gemini_image_model(model_id: str) -> bool:
    """Return True if the model is a Gemini image generation model."""
    if not model_id.startswith("gemini:"):
        return False
    bare = model_id.split(":", 1)[1].strip()
    return bare in {m.strip() for m in settings.gemini_image_models}


def model_id_is_huggingface_image_model(model_id: str) -> bool:
    """Return True if the model is a configured Hugging Face image model."""
    if not model_id.startswith("hf:"):
        return False
    bare = model_id.split(":", 1)[1].strip()
    return bare in {m.strip() for m in settings.hugging_face_image_models}


async def get_default_model() -> str:
    model_ids = await get_available_models()
    if not model_ids:
        raise RuntimeError("No models available")

    if settings.default_model in model_ids:
        return settings.default_model

    return model_ids[0]


async def get_image_model_infos() -> list[dict[str, str]]:
    await get_available_models()

    if _CACHED_IMAGE_MODEL_IDS:
        image_model_ids = _CACHED_IMAGE_MODEL_IDS
    elif _CACHED_REGISTRY_MODEL_IDS:
        image_model_ids = []
    else:
        image_model_ids = list(dict.fromkeys(settings.image_allowed_models))

    infos = [
        {
            "id": model_id,
            "label": friendly_name_for_model(model_id),
        }
        for model_id in image_model_ids
    ]

    if settings.gemini_api_key:
        for gemini_model in settings.gemini_image_models:
            normalized = (gemini_model or "").strip()
            if not normalized:
                continue
            infos.append(
                {
                    "id": f"gemini:{normalized}",
                    "label": f"Gemini {friendly_name_for_model(normalized)}",
                }
            )

    if settings.hugging_face_api_key:
        for hf_model in settings.hugging_face_image_models:
            normalized = (hf_model or "").strip()
            if not normalized:
                continue
            infos.append(
                {
                    "id": f"hf:{normalized}",
                    "label": f"Hugging Face {friendly_name_for_model(normalized)}",
                }
            )

    unique: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in infos:
        model_id = item["id"]
        if model_id in seen:
            continue
        unique.append(item)
        seen.add(model_id)

    return unique


async def get_default_image_model() -> str:
    infos = await get_image_model_infos()
    if not infos:
        raise RuntimeError("No image generation models available")
    return infos[0]["id"]
