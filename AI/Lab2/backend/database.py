from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Iterable, Sequence

from config import ROOT_DIR, settings


def _resolve_database_file() -> Path:
    candidate = Path(settings.database_path)
    if candidate.is_absolute():
        return candidate
    return (ROOT_DIR / candidate).resolve()


DATABASE_FILE = _resolve_database_file()


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    model TEXT NOT NULL,
    system_prompt TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    model TEXT,
    token_estimate INTEGER NOT NULL DEFAULT 0,
    has_audio INTEGER NOT NULL DEFAULT 0,
    audio_base64 TEXT,
    audio_format TEXT,
    audio_transcript TEXT,
    audio_voice TEXT,
    has_image INTEGER NOT NULL DEFAULT 0,
    image_base64 TEXT,
    image_mime_type TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id_created_at
ON messages(chat_id, created_at);

CREATE INDEX IF NOT EXISTS idx_chats_updated_at
ON chats(updated_at DESC);
"""


def _table_columns(connection: sqlite3.Connection, table_name: str) -> set[str]:
    rows = connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    return {str(row[1]) for row in rows}


def _ensure_column(
    connection: sqlite3.Connection,
    table_name: str,
    column_name: str,
    definition: str,
) -> None:
    if column_name in _table_columns(connection, table_name):
        return
    connection.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")


def _apply_migrations(connection: sqlite3.Connection) -> None:
    _ensure_column(connection, "messages", "has_audio", "INTEGER NOT NULL DEFAULT 0")
    _ensure_column(connection, "messages", "audio_base64", "TEXT")
    _ensure_column(connection, "messages", "audio_format", "TEXT")
    _ensure_column(connection, "messages", "audio_transcript", "TEXT")
    _ensure_column(connection, "messages", "audio_voice", "TEXT")
    _ensure_column(connection, "messages", "has_image", "INTEGER NOT NULL DEFAULT 0")
    _ensure_column(connection, "messages", "image_base64", "TEXT")
    _ensure_column(connection, "messages", "image_mime_type", "TEXT")


def get_connection() -> sqlite3.Connection:
    DATABASE_FILE.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_FILE, check_same_thread=False)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("PRAGMA journal_mode = WAL")
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.executescript(SCHEMA_SQL)
        _apply_migrations(connection)
        connection.commit()


def execute(query: str, params: Sequence[object] | None = None) -> None:
    with get_connection() as connection:
        connection.execute(query, params or [])
        connection.commit()


def execute_many(query: str, params: Iterable[Sequence[object]]) -> None:
    with get_connection() as connection:
        connection.executemany(query, params)
        connection.commit()


def fetch_one(query: str, params: Sequence[object] | None = None) -> sqlite3.Row | None:
    with get_connection() as connection:
        cursor = connection.execute(query, params or [])
        return cursor.fetchone()


def fetch_all(query: str, params: Sequence[object] | None = None) -> list[sqlite3.Row]:
    with get_connection() as connection:
        cursor = connection.execute(query, params or [])
        return cursor.fetchall()
