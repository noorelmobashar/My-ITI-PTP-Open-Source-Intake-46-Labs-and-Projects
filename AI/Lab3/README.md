# Local RAG Chat Application

A local Retrieval-Augmented Generation (RAG) chat application built with **FastAPI**, **Llama 3.2**, **FAISS**, and **LangChain**. It allows you to chat with your own documents and databases securely, entirely offline, leveraging local LLMs through **Ollama**.

## Features

- **Local LLM Integration**: Uses `llama3.2` for generation and `nomic-embed-text` for embeddings via Ollama.
- **Multi-Format Document Support**: Upload and ingest a wide variety of formats including `.pdf`, `.txt`, `.md`, `.json`, `.csv`, `.docx`, `.doc`, `.xml`, `.log`, and `.html`.
- **Database Ingestion**: Import schemas and row-level data directly from a local MariaDB/MySQL database (`iti`).
- **Interactive UI**: A single-page, intuitive web UI with drag-and-drop file uploading and a chat interface.
- **Embeddings Explorer**: Inspect stored FAISS vector chunks and their metadata directly from the UI.
- **Source Tracking**: Chat responses automatically cite the documents or table rows used for generation.

## Technical Architecture

- **Backend**: FastAPI
- **LLM Engine**: Ollama (`ChatOllama`, `OllamaEmbeddings`)
- **Vector Store**: FAISS
- **Pipeline Orchestration**: LangChain (LCEL)
- **Frontend**: Vanilla HTML / JS + Tailwind CSS

## Prerequisites

1. **Python 3.10+**
2. **Ollama**: Installed and running locally on port 11434 (default).
3. **Ollama Models**:
   ```bash
   ollama run llama3.2
   ollama pull nomic-embed-text
   ```
4. **MariaDB/MySQL**: Running locally (if database ingestion is intended).

## Installation

1. Navigate to the project directory.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: The build relies on standard ML and API libraries like `fastapi`, `langchain`, `faiss-cpu`, `pymysql`, `pypdf`, and `python-docx`.)*

## Usage

Start the FastAPI application using Uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Alternatively, if you run the script directly, it will boot the Uvicorn server automatically:
```bash
python main.py
```

Then, open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

### Document Ingestion
- Use the **browse** button or **Drop Zone** in the UI sidebar to upload documents.
- Files will be stored in the `./docs` directory.
- The app automatically triggers Langchain splitting, chunking, and FAISS indexing upon upload.

### Database Ingestion
- Ensure your MariaDB service is running.
- To customize the database connection, modify `DB_CONFIG` in `ingest.py` (Default: `host=localhost`, `db=iti`, `user=noor`, `password=noor`).
- You can trigger database ingestion via the backend/UI (the `/import-database` endpoint is responsible for pulling the structured data to the vector index).

## Project Structure

- `main.py`: The core FastAPI application, defining the Endpoints and LangChain RAG pipeline logic.
- `ingest.py`: Handles file processing, mapping loaders, config definition, data splitting, embeddings generation, FAISS index management, and database extraction.
- `index.html`: The fully-featured UI template served at the root route.
- `requirements.txt`: Python package dependency listings.
- `docs/`: Directory where uploaded files are stored temporarily or permanently.
- `faiss_index/`: Persisted FAISS vector index database directory.

## Core API Endpoints

- `GET /` - Serves the web-based Chat UI.
- `POST /upload` - Upload multiformat files and trigger context ingestion.
- `POST /ingest` - Force ingestion of all documents within the `./docs` path.
- `POST /chat` - Submits a contextual query against the RAG backend interface.
- `POST /import-database` - Iterates over configured MariaDB database tables, chunks row data, and populates the FAISS db.
- `GET /embeddings` - Serves stored vectors and chunk text representations.
- `GET /documents` - Returns an array of accessible uploaded original files.
- `DELETE /documents/{name}` - Removed a localized document and synchronously resets the FAISS representation.
