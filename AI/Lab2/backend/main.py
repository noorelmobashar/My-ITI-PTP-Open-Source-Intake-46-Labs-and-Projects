from __future__ import annotations

import json
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from crud import (
    append_message,
    build_chat_context,
    create_chat,
    delete_last_user_prompt,
    delete_chat,
    edit_last_user_prompt,
    get_chat,
    get_messages,
    list_chats,
    truncate_messages_after_last_user,
    update_chat_model,
    update_chat_title_if_default,
)
from database import init_db
from gemini_models import generate_audio_with_gemini, generate_image_with_gemini, stream_gemini_response
from github_models import generate_audio_chat_completion, generate_image, stream_model_response
from huggingface_models import generate_image_with_huggingface
from model_catalog import (
    get_available_models,
    get_default_image_model,
    get_default_model,
    get_image_model_infos,
    get_model_infos,
    model_id_is_gemini_image_model,
    model_id_is_huggingface_image_model,
    model_id_supports_images,
)
from schemas import (
    AudioMessageRequest,
    AudioMessageResponse,
    ChatMessage,
    ChatCreateRequest,
    ChatDeleteResponse,
    ChatDetailResponse,
    ChatListResponse,
    ChatRecord,
    HealthResponse,
    ImageGenerateRequest,
    ImageGenerateResponse,
    ImageModelInfo,
    ImageModelsResponse,
    LastPromptActionResponse,
    LastPromptEditRequest,
    ModelInfo,
    ModelsResponse,
    RegenerateRequest,
    StreamMessageRequest,
)


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=True)}\n\n"


async def _require_model(model_id: str) -> str:
    selected_model = (model_id or "").strip()
    available_models = await get_available_models()
    if selected_model not in available_models:
        preview = ", ".join(available_models[:20])
        suffix = " ..." if len(available_models) > 20 else ""
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported model '{selected_model}'. Available models: {preview}{suffix}",
        )
    return selected_model


def _http_error_detail(exc: httpx.HTTPStatusError, fallback: str) -> str:
    detail = fallback
    if exc.response is not None:
        try:
            payload = exc.response.json()
            if isinstance(payload, dict):
                direct_detail = payload.get("detail")
                if isinstance(direct_detail, str) and direct_detail.strip():
                    return direct_detail.strip()[:400]

                error_value = payload.get("error")
                if isinstance(error_value, str) and error_value.strip():
                    return error_value.strip()[:400]

                if isinstance(error_value, dict):
                    message = error_value.get("message") or error_value.get("detail")
                    if isinstance(message, str) and message.strip():
                        return message.strip()[:400]
        except Exception:
            pass

        try:
            body_text = exc.response.text.strip()
            if body_text:
                detail = body_text[:400]
        except Exception:
            pass
    return detail


def _build_audio_user_message(
    prompt: str | None,
    audio_base64: str | None,
    audio_format: str | None,
) -> dict[str, object]:
    text_prompt = (prompt or "").strip()

    if not audio_base64:
        return {
            "role": "user",
            "content": text_prompt,
        }

    content: list[dict[str, object]] = []
    content.append(
        {
            "type": "text",
            "text": text_prompt or "Please respond to this voice message.",
        }
    )
    content.append(
        {
            "type": "input_audio",
            "input_audio": {
                "data": audio_base64,
                "format": (audio_format or "wav").strip().lower(),
            },
        }
    )

    return {
        "role": "user",
        "content": content,
    }


def _chat_message_summary(message: str | None, has_image: bool) -> str:
    text = (message or "").strip()
    if text:
        return text
    if has_image:
        return "Sent an image"
    return "New message"


def _build_user_chat_message(
    message: str | None,
    image_base64: str | None,
    image_mime_type: str | None,
) -> dict[str, object]:
    text = (message or "").strip()

    if not image_base64:
        return {
            "role": "user",
            "content": text,
        }

    content: list[dict[str, object]] = []
    if text:
        content.append({
            "type": "text",
            "text": text,
        })
    else:
        content.append({
            "type": "text",
            "text": "Please analyze this image.",
        })
    content.append({
        "type": "image_url",
        "image_url": {
            "url": f"data:{(image_mime_type or 'image/png').strip().lower()};base64,{image_base64}",
        },
    })
    return {
        "role": "user",
        "content": content,
    }


def _last_user_prompt_from_context(messages: list[dict[str, object]]) -> str:
    for item in reversed(messages):
        if item.get("role") != "user":
            continue

        content = item.get("content")
        if isinstance(content, str):
            text = content.strip()
            if text:
                return text

        if isinstance(content, list):
            text_parts: list[str] = []
            for part in content:
                if not isinstance(part, dict):
                    continue
                text = part.get("text")
                if isinstance(text, str) and text.strip():
                    text_parts.append(text.strip())
            joined = "\n".join(text_parts).strip()
            if joined:
                return joined

    return "Generate an image"


app = FastAPI(title="Modern Copilot Chat", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    init_db()
    await get_available_models(force_refresh=True)


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/api/models", response_model=ModelsResponse)
async def models() -> ModelsResponse:
    model_infos = await get_model_infos()
    return ModelsResponse(models=[ModelInfo(**model_info) for model_info in model_infos])


@app.get("/api/images/models", response_model=ImageModelsResponse)
async def image_models() -> ImageModelsResponse:
    infos = await get_image_model_infos()
    return ImageModelsResponse(models=[ImageModelInfo(**item) for item in infos])


@app.post("/api/images/generate", response_model=ImageGenerateResponse)
async def image_generate(body: ImageGenerateRequest) -> ImageGenerateResponse:
    image_model_infos = await get_image_model_infos()
    available = {item["id"] for item in image_model_infos}

    try:
        default_image_model = await get_default_image_model()
    except RuntimeError as exc:
        raise HTTPException(
            status_code=400,
            detail="No image generation model is available for this API key.",
        ) from exc

    selected_model = (body.model or default_image_model).strip()

    if selected_model not in available:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image model '{selected_model}'.",
        )

    selected_size = (body.size or settings.default_image_size).strip() or settings.default_image_size

    try:
        if model_id_is_gemini_image_model(selected_model):
            gemini_model = selected_model.split(":", 1)[1].strip()
            payload = await generate_image_with_gemini(gemini_model, body.prompt)
        elif model_id_is_huggingface_image_model(selected_model):
            hf_model = selected_model.split(":", 1)[1].strip()
            payload = await generate_image_with_huggingface(hf_model, body.prompt, selected_size)
        else:
            payload = await generate_image(selected_model, body.prompt, selected_size)
        return ImageGenerateResponse(**payload)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=_http_error_detail(exc, "Image generation request failed."),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc


@app.post("/api/chats", response_model=ChatRecord, status_code=201)
async def create_chat_endpoint(body: ChatCreateRequest) -> ChatRecord:
    default_model = await get_default_model()
    selected_model = await _require_model(body.model or default_model)
    chat = create_chat(body.title, selected_model, body.system_prompt)
    return ChatRecord(**chat)


@app.get("/api/chats", response_model=ChatListResponse)
def list_chats_endpoint() -> ChatListResponse:
    chats = list_chats()
    return ChatListResponse(chats=chats)


@app.get("/api/chats/{chat_id}", response_model=ChatDetailResponse)
def get_chat_endpoint(chat_id: str) -> ChatDetailResponse:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = get_messages(chat_id)
    return ChatDetailResponse(chat=chat, messages=messages)


@app.patch("/api/chats/{chat_id}/last-prompt", response_model=ChatMessage)
def edit_last_prompt_endpoint(chat_id: str, body: LastPromptEditRequest) -> ChatMessage:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    updated = edit_last_user_prompt(chat_id, body.message)
    if not updated:
        raise HTTPException(status_code=400, detail="No user prompt available to edit")

    return ChatMessage(**updated)


@app.delete("/api/chats/{chat_id}/last-prompt", response_model=LastPromptActionResponse)
def delete_last_prompt_endpoint(chat_id: str) -> LastPromptActionResponse:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    deleted = delete_last_user_prompt(chat_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="No user prompt available to delete")

    return LastPromptActionResponse(
        status="deleted",
        message_id=deleted["message_id"],
        deleted_count=deleted["deleted_count"],
    )


@app.post("/api/chats/{chat_id}/regenerate", response_model=ChatMessage)
async def regenerate_last_prompt_endpoint(chat_id: str, body: RegenerateRequest) -> ChatMessage:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    selected_model = await _require_model(body.model or chat["model"] or await get_default_model())

    if selected_model.startswith("gemini:"):
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Missing GEMINI_API_KEY in .env",
            )
    elif model_id_is_huggingface_image_model(selected_model):
        if not settings.hugging_face_api_key:
            raise HTTPException(
                status_code=500,
                detail="Missing HUGGING_FACE_API_KEY in .env",
            )
    elif not settings.api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing server API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env",
        )

    truncated = truncate_messages_after_last_user(chat_id)
    if not truncated:
        raise HTTPException(status_code=400, detail="No user prompt available to regenerate")

    if selected_model != chat["model"]:
        update_chat_model(chat_id, selected_model)

    context_messages = build_chat_context(chat_id, selected_model)
    if not context_messages:
        raise HTTPException(status_code=400, detail="No context available to regenerate")

    try:
        if model_id_is_gemini_image_model(selected_model) or model_id_is_huggingface_image_model(selected_model):
            prompt = _last_user_prompt_from_context(context_messages)

            if model_id_is_gemini_image_model(selected_model):
                gemini_model = selected_model.split(":", 1)[1].strip()
                payload = await generate_image_with_gemini(gemini_model, prompt)
            else:
                hf_model = selected_model.split(":", 1)[1].strip()
                payload = await generate_image_with_huggingface(
                    hf_model,
                    prompt,
                    settings.default_image_size,
                )

            image_b64 = payload.get("image_base64")
            image_url = payload.get("image_url")
            if image_b64:
                assistant_text = f"![Generated image](data:image/png;base64,{image_b64})"
            elif image_url:
                assistant_text = f"![Generated image]({image_url})"
            else:
                assistant_text = "The model was unable to generate an image for this prompt."

            saved = append_message(
                chat_id,
                "assistant",
                assistant_text,
                selected_model,
                has_image=bool(image_b64),
                image_base64=image_b64,
                image_mime_type="image/png" if image_b64 else None,
            )
            return ChatMessage(**saved)

        if selected_model.startswith("gemini:"):
            gemini_model = selected_model.split(":", 1)[1].strip()
            chunk_stream = stream_gemini_response(gemini_model, context_messages)
        else:
            chunk_stream = stream_model_response(selected_model, context_messages)

        chunks: list[str] = []
        async for chunk in chunk_stream:
            chunks.append(chunk)

        assistant_text = "".join(chunks).strip()
        if not assistant_text:
            assistant_text = "I was not able to generate a response this time."

        saved = append_message(chat_id, "assistant", assistant_text, selected_model)
        return ChatMessage(**saved)

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=_http_error_detail(exc, "Regenerate request failed."),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc


@app.delete("/api/chats/{chat_id}", response_model=ChatDeleteResponse)
def delete_chat_endpoint(chat_id: str) -> ChatDeleteResponse:
    deleted = delete_chat(chat_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chat not found")

    return ChatDeleteResponse(status="deleted", id=chat_id)


@app.post("/api/chats/{chat_id}/stream")
async def stream_chat_endpoint(chat_id: str, body: StreamMessageRequest) -> StreamingResponse:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    selected_model = await _require_model(body.model or chat["model"] or await get_default_model())

    if selected_model.startswith("gemini:"):
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Missing GEMINI_API_KEY in .env",
            )
    elif model_id_is_huggingface_image_model(selected_model):
        if not settings.hugging_face_api_key:
            raise HTTPException(
                status_code=500,
                detail="Missing HUGGING_FACE_API_KEY in .env",
            )
    elif body.image_base64 and not model_id_supports_images(selected_model):
        raise HTTPException(
            status_code=400,
            detail="Selected model does not accept images.",
        )
    elif not settings.api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing server API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env",
        )

    user_summary = _chat_message_summary(body.message, bool(body.image_base64))
    append_message(
        chat_id,
        "user",
        user_summary,
        has_image=bool(body.image_base64),
        image_base64=body.image_base64,
        image_mime_type=body.image_mime_type,
    )
    update_chat_title_if_default(chat_id, user_summary)
    if selected_model != chat["model"]:
        update_chat_model(chat_id, selected_model)

    async def event_stream():
        response_chunks: list[str] = []

        try:
            context_messages = build_chat_context(chat_id, selected_model)

            # Special handling for image generation models
            if model_id_is_gemini_image_model(selected_model) or model_id_is_huggingface_image_model(selected_model):
                prompt = (body.message or "").strip() or "Generate an image"
                yield _sse("token", {"token": "Generating image..."})

                try:
                    if model_id_is_gemini_image_model(selected_model):
                        gemini_model = selected_model.split(":", 1)[1].strip()
                        payload = await generate_image_with_gemini(gemini_model, prompt)
                    else:
                        hf_model = selected_model.split(":", 1)[1].strip()
                        payload = await generate_image_with_huggingface(
                            hf_model,
                            prompt,
                            settings.default_image_size,
                        )
                except httpx.HTTPStatusError as img_http_exc:
                    if img_http_exc.response is not None and img_http_exc.response.status_code == 429:
                        yield _sse("error", {"message": "Rate limit reached — please wait a moment and try again."})
                    else:
                        detail = _http_error_detail(img_http_exc, "Image generation request failed.")
                        yield _sse("error", {"message": detail})
                    return
                except Exception as img_exc:
                    yield _sse("error", {"message": f"Image generation failed: {img_exc}"})
                    return

                image_b64 = payload.get("image_base64")
                image_url = payload.get("image_url")
                if image_b64:
                    assistant_text = f"![Generated image](data:image/png;base64,{image_b64})"
                elif image_url:
                    assistant_text = f"![Generated image]({image_url})"
                else:
                    assistant_text = "The model was unable to generate an image for this prompt."

                saved = append_message(
                    chat_id,
                    "assistant",
                    prompt,
                    selected_model,
                    has_image=bool(image_b64),
                    image_base64=image_b64,
                    image_mime_type="image/png" if image_b64 else None,
                )
                yield _sse("token", {"token": assistant_text})
                yield _sse("done", {"message_id": saved["id"]})
                return

            if selected_model.startswith("gemini:"):
                gemini_model = selected_model.split(":", 1)[1].strip()
                chunk_stream = stream_gemini_response(gemini_model, context_messages)
            else:
                chunk_stream = stream_model_response(selected_model, context_messages)

            async for chunk in chunk_stream:
                response_chunks.append(chunk)
                yield _sse("token", {"token": chunk})

            assistant_text = "".join(response_chunks).strip()
            if not assistant_text:
                assistant_text = "I was not able to generate a response this time."

            saved = append_message(chat_id, "assistant", assistant_text, selected_model)
            yield _sse("done", {"message_id": saved["id"]})

        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code if exc.response is not None else "unknown"
            yield _sse("error", {"message": f"Model request failed with status {status_code}."})
        except Exception as exc:  # noqa: BLE001
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/chats/{chat_id}/audio", response_model=AudioMessageResponse)
async def audio_chat_endpoint(chat_id: str, body: AudioMessageRequest) -> AudioMessageResponse:
    chat = get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    selected_model = await _require_model(body.model or chat["model"] or await get_default_model())

    if selected_model.startswith("gemini:"):
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Missing GEMINI_API_KEY in .env",
            )
    elif not settings.api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing server API key. Set GITHUB_MODELS_API_KEY (or GITHUB_TOKEN) in .env",
        )
    user_text = (body.message or "").strip()
    user_summary = user_text or "Voice message"

    context_messages = build_chat_context(chat_id, selected_model)

    append_message(
        chat_id,
        "user",
        user_summary,
        has_audio=bool(body.audio_base64),
        audio_format=(body.audio_format or "wav") if body.audio_base64 else None,
    )
    update_chat_title_if_default(chat_id, user_summary)
    if selected_model != chat["model"]:
        update_chat_model(chat_id, selected_model)

    try:
        if selected_model.startswith("gemini:"):
            gemini_model = selected_model.split(":", 1)[1].strip()
            tts_text = user_text or "Hello"

            # Determine the TTS model and chat model
            # If the selected model IS a TTS model, use a chat model to get the answer first
            is_tts_model = any(
                gemini_model == m.strip()
                for m in settings.gemini_tts_models
            )

            if is_tts_model:
                # Two-step: chat model answers → TTS model speaks the answer
                chat_model = settings.gemini_chat_models[0] if settings.gemini_chat_models else "gemini-2.5-flash"
                # Build user message for context
                user_msg = {"role": "user", "content": tts_text}
                request_messages = context_messages + [user_msg]
                payload = await generate_audio_with_gemini(
                    gemini_model,
                    tts_text,
                    voice=(body.voice or "alloy").strip(),
                    chat_model=chat_model,
                    messages=request_messages,
                )
            else:
                # The selected model is a regular Gemini chat model with voice reply on
                # Use the default TTS model to speak the chat response
                tts_model = settings.gemini_tts_models[0] if settings.gemini_tts_models else "gemini-2.5-flash-preview-tts"
                user_msg = {"role": "user", "content": tts_text}
                request_messages = context_messages + [user_msg]
                payload = await generate_audio_with_gemini(
                    tts_model,
                    tts_text,
                    voice=(body.voice or "alloy").strip(),
                    chat_model=gemini_model,
                    messages=request_messages,
                )
        else:
            request_messages = context_messages + [
                _build_audio_user_message(user_text, body.audio_base64, body.audio_format)
            ]
            payload = await generate_audio_chat_completion(
                selected_model,
                request_messages,
                voice=(body.voice or "alloy").strip(),
                audio_format=(body.response_format or "wav").strip().lower(),
            )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=_http_error_detail(exc, "Audio response request failed."),
        ) from exc

    assistant_text = (payload.get("text") or payload.get("audio_transcript") or "").strip()
    if not assistant_text:
        assistant_text = "I was not able to generate a response this time."

    saved = append_message(
        chat_id,
        "assistant",
        assistant_text,
        selected_model,
        has_audio=bool(payload.get("audio_base64")),
        audio_base64=payload.get("audio_base64"),
        audio_format=payload.get("audio_format"),
        audio_transcript=payload.get("audio_transcript"),
        audio_voice=payload.get("audio_voice"),
    )

    return AudioMessageResponse(
        id=saved["id"],
        model=selected_model,
        text=assistant_text,
        audio_base64=saved.get("audio_base64"),
        audio_format=saved.get("audio_format"),
        audio_transcript=saved.get("audio_transcript"),
        audio_voice=saved.get("audio_voice"),
    )


frontend_dir = (Path(__file__).resolve().parent.parent / "frontend").resolve()
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
