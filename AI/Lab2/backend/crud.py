from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from config import settings
from database import execute, fetch_all, fetch_one, get_connection


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def estimate_tokens(text: str) -> int:
    normalized = text.strip()
    if not normalized:
        return 0
    return max(1, len(normalized) // 4)


def _row_to_dict(row: Any) -> dict[str, Any]:
    return dict(row) if row is not None else {}


def _chat_title_from_prompt(content: str) -> str:
    one_line = " ".join(content.strip().split())
    if not one_line:
        return "New chat"
    if len(one_line) <= 48:
        return one_line
    return one_line[:45] + "..."


def create_chat(title: str | None, model: str, system_prompt: str = "") -> dict[str, Any]:
    chat_id = uuid4().hex
    now = _now_iso()

    safe_title = (title or "").strip() or "New chat"
    safe_system_prompt = (system_prompt or "").strip()

    execute(
        """
        INSERT INTO chats (id, title, model, system_prompt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        [chat_id, safe_title, model, safe_system_prompt, now, now],
    )
    return get_chat(chat_id)


def list_chats() -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        SELECT
            c.id,
            c.title,
            c.model,
            c.created_at,
            c.updated_at,
            (
                SELECT m.content
                FROM messages m
                WHERE m.chat_id = c.id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) AS last_message,
            (
                SELECT COUNT(*)
                FROM messages m2
                WHERE m2.chat_id = c.id
            ) AS message_count
        FROM chats c
        ORDER BY c.updated_at DESC
        """
    )

    result: list[dict[str, Any]] = []
    for row in rows:
        item = dict(row)
        last_message = (item.pop("last_message") or "").strip()
        snippet = " ".join(last_message.split())
        if len(snippet) > 80:
            snippet = snippet[:77] + "..."
        item["snippet"] = snippet
        result.append(item)

    return result


def get_chat(chat_id: str) -> dict[str, Any] | None:
    row = fetch_one(
        """
        SELECT id, title, model, system_prompt, created_at, updated_at
        FROM chats
        WHERE id = ?
        """,
        [chat_id],
    )
    if row is None:
        return None
    return dict(row)


def get_messages(chat_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        SELECT
            id,
            chat_id,
            role,
            content,
            model,
            token_estimate,
            has_audio,
            audio_base64,
            audio_format,
            audio_transcript,
            audio_voice,
            has_image,
            image_base64,
            image_mime_type,
            created_at
        FROM messages
        WHERE chat_id = ?
        ORDER BY created_at ASC
        """,
        [chat_id],
    )
    return [dict(row) for row in rows]


def append_message(
    chat_id: str,
    role: str,
    content: str,
    model: str | None = None,
    *,
    has_audio: bool = False,
    audio_base64: str | None = None,
    audio_format: str | None = None,
    audio_transcript: str | None = None,
    audio_voice: str | None = None,
    has_image: bool = False,
    image_base64: str | None = None,
    image_mime_type: str | None = None,
) -> dict[str, Any]:
    message_id = uuid4().hex
    now = _now_iso()
    token_estimate = estimate_tokens(content)

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO messages (
                id,
                chat_id,
                role,
                content,
                model,
                token_estimate,
                has_audio,
                audio_base64,
                audio_format,
                audio_transcript,
                audio_voice,
                has_image,
                image_base64,
                image_mime_type,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                message_id,
                chat_id,
                role,
                content,
                model,
                token_estimate,
                int(has_audio),
                audio_base64,
                audio_format,
                audio_transcript,
                audio_voice,
                int(has_image),
                image_base64,
                image_mime_type,
                now,
            ],
        )
        connection.execute(
            """
            UPDATE chats
            SET updated_at = ?
            WHERE id = ?
            """,
            [now, chat_id],
        )
        connection.commit()

    return {
        "id": message_id,
        "chat_id": chat_id,
        "role": role,
        "content": content,
        "model": model,
        "token_estimate": token_estimate,
        "has_audio": has_audio,
        "audio_base64": audio_base64,
        "audio_format": audio_format,
        "audio_transcript": audio_transcript,
        "audio_voice": audio_voice,
        "has_image": has_image,
        "image_base64": image_base64,
        "image_mime_type": image_mime_type,
        "created_at": now,
    }


def update_chat_model(chat_id: str, model: str) -> None:
    execute(
        """
        UPDATE chats
        SET model = ?, updated_at = ?
        WHERE id = ?
        """,
        [model, _now_iso(), chat_id],
    )


def update_chat_title_if_default(chat_id: str, fallback_prompt: str) -> None:
    chat = get_chat(chat_id)
    if not chat:
        return

    current_title = (chat["title"] or "").strip().lower()
    if current_title not in {"new chat", "untitled chat"}:
        return

    auto_title = _chat_title_from_prompt(fallback_prompt)
    execute(
        """
        UPDATE chats
        SET title = ?, updated_at = ?
        WHERE id = ?
        """,
        [auto_title, _now_iso(), chat_id],
    )


def delete_chat(chat_id: str) -> bool:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM chats WHERE id = ?", [chat_id])
        connection.commit()
        return cursor.rowcount > 0


def _touch_chat_updated_at(connection: Any, chat_id: str) -> None:
    connection.execute(
        """
        UPDATE chats
        SET updated_at = ?
        WHERE id = ?
        """,
        [_now_iso(), chat_id],
    )


def _last_user_message_row(connection: Any, chat_id: str) -> Any:
    return connection.execute(
        """
        SELECT
            rowid AS message_rowid,
            id,
            chat_id,
            role,
            content,
            model,
            token_estimate,
            has_audio,
            audio_base64,
            audio_format,
            audio_transcript,
            audio_voice,
            has_image,
            image_base64,
            image_mime_type,
            created_at
        FROM messages
        WHERE chat_id = ? AND role = 'user'
        ORDER BY rowid DESC
        LIMIT 1
        """,
        [chat_id],
    ).fetchone()


def truncate_messages_after_last_user(chat_id: str) -> dict[str, Any] | None:
    with get_connection() as connection:
        row = _last_user_message_row(connection, chat_id)
        if row is None:
            return None

        cursor = connection.execute(
            """
            DELETE FROM messages
            WHERE chat_id = ? AND rowid > ?
            """,
            [chat_id, row["message_rowid"]],
        )

        _touch_chat_updated_at(connection, chat_id)
        connection.commit()

        return {
            "message_id": str(row["id"]),
            "deleted_count": int(cursor.rowcount),
        }


def edit_last_user_prompt(chat_id: str, message: str) -> dict[str, Any] | None:
    normalized = (message or "").strip()
    if not normalized:
        return None

    with get_connection() as connection:
        row = _last_user_message_row(connection, chat_id)
        if row is None:
            return None

        connection.execute(
            """
            UPDATE messages
            SET
                content = ?,
                token_estimate = ?,
                has_audio = 0,
                audio_base64 = NULL,
                audio_format = NULL,
                audio_transcript = NULL,
                audio_voice = NULL
            WHERE id = ?
            """,
            [normalized, estimate_tokens(normalized), row["id"]],
        )

        connection.execute(
            """
            DELETE FROM messages
            WHERE chat_id = ? AND rowid > ?
            """,
            [chat_id, row["message_rowid"]],
        )

        _touch_chat_updated_at(connection, chat_id)

        updated_row = connection.execute(
            """
            SELECT
                id,
                chat_id,
                role,
                content,
                model,
                token_estimate,
                has_audio,
                audio_base64,
                audio_format,
                audio_transcript,
                audio_voice,
                has_image,
                image_base64,
                image_mime_type,
                created_at
            FROM messages
            WHERE id = ?
            """,
            [row["id"]],
        ).fetchone()

        connection.commit()

    return dict(updated_row) if updated_row is not None else None


def delete_last_user_prompt(chat_id: str) -> dict[str, Any] | None:
    with get_connection() as connection:
        row = _last_user_message_row(connection, chat_id)
        if row is None:
            return None

        cursor = connection.execute(
            """
            DELETE FROM messages
            WHERE chat_id = ? AND rowid >= ?
            """,
            [chat_id, row["message_rowid"]],
        )

        _touch_chat_updated_at(connection, chat_id)
        connection.commit()

        return {
            "message_id": str(row["id"]),
            "deleted_count": int(cursor.rowcount),
        }


def build_chat_context(chat_id: str, model_id: str) -> list[dict[str, Any]]:
    chat = get_chat(chat_id)
    if not chat:
        return []

    messages = get_messages(chat_id)
    context_budget = max(1000, settings.context_window_for(model_id) - settings.response_reserved_tokens)

    context: list[dict[str, Any]] = []
    system_prompt = (chat.get("system_prompt") or "").strip()

    used_tokens = 0
    if system_prompt:
        system_tokens = estimate_tokens(system_prompt)
        used_tokens += system_tokens
        context.append({"role": "system", "content": system_prompt})

    selected: list[dict[str, Any]] = []
    for message in reversed(messages):
        token_cost = int(message.get("token_estimate") or estimate_tokens(message["content"]))
        if selected and (used_tokens + token_cost > context_budget):
            break

        content: Any = message["content"]
        if message.get("has_image") and message.get("image_base64") and message.get("image_mime_type"):
            content = [
                {
                    "type": "text",
                    "text": message["content"],
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{message['image_mime_type']};base64,{message['image_base64']}",
                    },
                },
            ]

        selected.append({
            "role": message["role"],
            "content": content,
        })
        used_tokens += token_cost

    if not selected and messages:
        latest = messages[-1]
        latest_content: Any = latest["content"]
        if latest.get("has_image") and latest.get("image_base64") and latest.get("image_mime_type"):
            latest_content = [
                {
                    "type": "text",
                    "text": latest["content"],
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{latest['image_mime_type']};base64,{latest['image_base64']}",
                    },
                },
            ]
        selected.append({"role": latest["role"], "content": latest_content})

    selected.reverse()
    context.extend(selected)

    return context
