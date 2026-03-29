from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class ChatCreateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=120)
    model: str | None = Field(default=None, max_length=120)
    system_prompt: str = Field(default="", max_length=6000)

    @field_validator("title")
    @classmethod
    def sanitize_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = " ".join(value.split())
        return compact or None


class StreamMessageRequest(BaseModel):
    message: str | None = Field(default=None, max_length=12000)
    model: str | None = Field(default=None, max_length=120)
    image_base64: str | None = Field(default=None, max_length=20_000_000)
    image_mime_type: str | None = Field(default=None, max_length=120)

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = value.strip()
        return compact or None

    @field_validator("image_mime_type")
    @classmethod
    def sanitize_mime_type(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = value.strip().lower()
        return compact or None

    @model_validator(mode="after")
    def validate_payload(self) -> "StreamMessageRequest":
        if not self.message and not self.image_base64:
            raise ValueError("Provide a text message or image input")
        return self


class RegenerateRequest(BaseModel):
    model: str | None = Field(default=None, max_length=120)


class LastPromptEditRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, value: str) -> str:
        compact = value.strip()
        if not compact:
            raise ValueError("Message cannot be empty")
        return compact


class AudioMessageRequest(BaseModel):
    message: str | None = Field(default=None, max_length=12000)
    model: str | None = Field(default=None, max_length=120)
    audio_base64: str | None = Field(default=None, max_length=20_000_000)
    audio_format: str | None = Field(default="wav", max_length=20)
    voice: str | None = Field(default="alloy", max_length=40)
    response_format: str | None = Field(default="wav", max_length=20)

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = value.strip()
        return compact or None

    @field_validator("audio_format", "response_format")
    @classmethod
    def sanitize_format(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = value.strip().lower()
        return compact or None

    @field_validator("voice")
    @classmethod
    def sanitize_voice(cls, value: str | None) -> str | None:
        if value is None:
            return None
        compact = value.strip()
        return compact or None

    @model_validator(mode="after")
    def validate_payload(self) -> "AudioMessageRequest":
        if not self.message and not self.audio_base64:
            raise ValueError("Provide a text message or audio input")
        return self


class ChatMessage(BaseModel):
    id: str
    chat_id: str
    role: Literal["system", "user", "assistant"]
    content: str
    model: str | None = None
    token_estimate: int
    has_audio: bool = False
    audio_base64: str | None = None
    audio_format: str | None = None
    audio_transcript: str | None = None
    audio_voice: str | None = None
    has_image: bool = False
    image_base64: str | None = None
    image_mime_type: str | None = None
    created_at: str


class ChatRecord(BaseModel):
    id: str
    title: str
    model: str
    created_at: str
    updated_at: str


class ChatSummary(ChatRecord):
    message_count: int
    snippet: str = ""


class ChatListResponse(BaseModel):
    chats: list[ChatSummary]


class ChatDetailResponse(BaseModel):
    chat: ChatRecord
    messages: list[ChatMessage]


class ModelInfo(BaseModel):
    id: str
    label: str
    context_window: int
    accepts_text: bool
    accepts_image: bool
    accepts_audio: bool


class ModelsResponse(BaseModel):
    models: list[ModelInfo]


class ImageModelInfo(BaseModel):
    id: str
    label: str


class ImageModelsResponse(BaseModel):
    models: list[ImageModelInfo]


class ImageGenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    model: str | None = Field(default=None, max_length=200)
    size: str | None = Field(default=None, max_length=40)

    @field_validator("prompt")
    @classmethod
    def sanitize_prompt(cls, value: str) -> str:
        compact = value.strip()
        if not compact:
            raise ValueError("Prompt cannot be empty")
        return compact


class ImageGenerateResponse(BaseModel):
    model: str
    image_base64: str | None = None
    image_url: str | None = None
    revised_prompt: str | None = None


class AudioMessageResponse(BaseModel):
    id: str
    model: str
    text: str
    audio_base64: str | None = None
    audio_format: str | None = None
    audio_transcript: str | None = None
    audio_voice: str | None = None


class ChatDeleteResponse(BaseModel):
    status: str
    id: str


class LastPromptActionResponse(BaseModel):
    status: str
    message_id: str
    deleted_count: int


class HealthResponse(BaseModel):
    status: str
