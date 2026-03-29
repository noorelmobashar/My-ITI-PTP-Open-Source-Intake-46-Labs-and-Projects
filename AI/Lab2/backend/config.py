from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

from dotenv import dotenv_values, load_dotenv


ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT_DIR / ".env"
load_dotenv(ENV_FILE)


def _split_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _parse_model_context_windows(raw_value: str | None) -> Dict[str, int]:
    result: Dict[str, int] = {}
    if not raw_value:
        return result

    for chunk in raw_value.split(","):
        piece = chunk.strip()
        if not piece or ":" not in piece:
            continue

        model, _, value = piece.partition(":")
        model_id = model.strip()
        try:
            window = int(value.strip())
        except ValueError:
            continue

        if model_id and window > 0:
            result[model_id] = window

    return result


def _read_server_key() -> str:
    env_values = dotenv_values(ENV_FILE) if ENV_FILE.exists() else {}
    key_candidates = [
        os.getenv("GITHUB_MODELS_API_KEY"),
        os.getenv("GITHUB_TOKEN"),
        os.getenv("API_KEY"),
        os.getenv("API-KEY"),
        env_values.get("API_KEY"),
        env_values.get("API-KEY"),
    ]

    for candidate in key_candidates:
        if candidate and candidate.strip():
            return candidate.strip()

    return ""


@dataclass(frozen=True)
class Settings:
    api_key: str
    github_models_base_url: str
    hugging_face_api_key: str
    hugging_face_base_url: str
    hugging_face_image_models: List[str]
    gemini_api_key: str
    gemini_base_url: str
    gemini_chat_models: List[str]
    gemini_image_models: List[str]
    gemini_tts_models: List[str]
    allowed_models: List[str]
    model_context_windows: Dict[str, int]
    model_discovery_refresh_seconds: int
    model_strict_allowlist: bool
    image_allowed_models: List[str]
    default_image_size: str
    database_path: str
    app_host: str
    app_port: int
    request_timeout_seconds: float
    cors_origins: List[str]
    default_context_window: int
    response_reserved_tokens: int

    @property
    def default_model(self) -> str:
        return self.allowed_models[0]

    def context_window_for(self, model_id: str) -> int:
        return self.model_context_windows.get(model_id, self.default_context_window)


def load_settings() -> Settings:
    allowed_models = _split_csv(
        os.getenv("ALLOWED_MODELS")
    ) or [
        "gpt-4o-mini",
        "gpt-4.1-mini",
        "claude-3.7-sonnet",
    ]

    model_context_windows = _parse_model_context_windows(
        os.getenv("MODEL_CONTEXT_WINDOWS")
    )

    cors_origins = _split_csv(os.getenv("CORS_ORIGINS")) or [
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ]

    base_url = os.getenv("GITHUB_MODELS_BASE_URL", "https://models.inference.ai.azure.com")

    try:
        app_port = int(os.getenv("APP_PORT", "8000"))
    except ValueError:
        app_port = 8000

    try:
        request_timeout_seconds = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "90"))
    except ValueError:
        request_timeout_seconds = 90.0

    try:
        default_context_window = int(os.getenv("DEFAULT_CONTEXT_WINDOW", "120000"))
    except ValueError:
        default_context_window = 120000

    try:
        response_reserved_tokens = int(os.getenv("RESPONSE_RESERVED_TOKENS", "3000"))
    except ValueError:
        response_reserved_tokens = 3000

    try:
        model_discovery_refresh_seconds = int(
            os.getenv("MODEL_DISCOVERY_REFRESH_SECONDS", "300")
        )
    except ValueError:
        model_discovery_refresh_seconds = 300

    model_strict_allowlist = (
        os.getenv("MODEL_STRICT_ALLOWLIST", "false").strip().lower()
        in {"1", "true", "yes", "on"}
    )

    image_allowed_models = _split_csv(os.getenv("IMAGE_ALLOWED_MODELS")) or [
        "gpt-image-1",
    ]

    hugging_face_image_models = _split_csv(os.getenv("HUGGING_FACE_IMAGE_MODELS")) or [
        "Qwen/Qwen-Image",
    ]

    gemini_chat_models = _split_csv(os.getenv("GEMINI_CHAT_MODELS")) or [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
    ]

    gemini_image_models = _split_csv(os.getenv("GEMINI_IMAGE_MODELS")) or [
        "gemini-2.5-flash-image",
    ]

    gemini_tts_models = _split_csv(os.getenv("GEMINI_TTS_MODELS")) or [
        "gemini-2.5-flash-preview-tts",
    ]

    default_image_size = os.getenv("DEFAULT_IMAGE_SIZE", "1024x1024").strip() or "1024x1024"

    return Settings(
        api_key=_read_server_key(),
        github_models_base_url=base_url.rstrip("/"),
        hugging_face_api_key=(
            os.getenv("HUGGING_FACE_API_KEY")
            or os.getenv("HUGGINGFACEHUB_API_TOKEN")
            or os.getenv("HF_TOKEN")
            or ""
        ).strip(),
        hugging_face_base_url=(
            os.getenv("HUGGING_FACE_BASE_URL", "https://router.huggingface.co/hf-inference/models")
            .strip()
            .rstrip("/")
        ),
        hugging_face_image_models=hugging_face_image_models,
        gemini_api_key=os.getenv("GEMINI_API_KEY", "").strip(),
        gemini_base_url=os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta").rstrip("/"),
        gemini_chat_models=gemini_chat_models,
        gemini_image_models=gemini_image_models,
        gemini_tts_models=gemini_tts_models,
        allowed_models=allowed_models,
        model_context_windows=model_context_windows,
        model_discovery_refresh_seconds=model_discovery_refresh_seconds,
        model_strict_allowlist=model_strict_allowlist,
        image_allowed_models=image_allowed_models,
        default_image_size=default_image_size,
        database_path=os.getenv("DATABASE_PATH", "chatbot.db"),
        app_host=os.getenv("APP_HOST", "127.0.0.1"),
        app_port=app_port,
        request_timeout_seconds=request_timeout_seconds,
        cors_origins=cors_origins,
        default_context_window=default_context_window,
        response_reserved_tokens=response_reserved_tokens,
    )


settings = load_settings()
