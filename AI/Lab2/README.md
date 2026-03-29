# Pulse Chat (FastAPI + SQLite + Streaming)

Pulse Chat is a full-stack chatbot application with:
- FastAPI backend
- SQLite persistence
- Streaming responses
- Multi-provider model support (GitHub Models, Gemini, Hugging Face)
- Text, image, and audio features

## Project Structure

- backend/main.py: API routes, chat streaming, image/audio endpoints, static serving
- backend/config.py: env parsing and runtime settings
- backend/database.py: SQLite schema and migrations
- backend/crud.py: chat/message create, read, update, delete helpers
- backend/model_catalog.py: model discovery and capability mapping
- backend/github_models.py: GitHub Models provider calls
- backend/gemini_models.py: Gemini provider calls
- backend/huggingface_models.py: Hugging Face image provider calls
- frontend/index.html: app shell
- frontend/script.js: frontend state and API integration
- frontend/styles.css: responsive UI styling

## Installation Process

### 1. Clone and enter the project

Use your normal Git workflow to clone and open the project folder.

### 2. Create and activate a virtual environment

Linux/macOS:

python3 -m venv .venv
source .venv/bin/activate

### 3. Install backend dependencies

pip install -r backend/requirements.txt

### 4. Create environment file

Copy .env.example to .env, then fill in your keys.

Required in practice:
- GITHUB_MODELS_API_KEY (or equivalent GitHub token env)

Optional depending on enabled providers:
- GEMINI_API_KEY
- HUGGING_FACE_API_KEY

### 5. Run the backend server

cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000

### 6. Open the app

http://127.0.0.1:8000

## Why These Models Were Added

Below is the rationale for the configured model set in your current environment.

### GitHub Models (ALLOWED_MODELS)

1. gpt-5
- I chose this model because it is the strongest general reasoning model in the set.
- It accepts text and image input in this app capability mapping.
- It produces high-quality, reliable long-form answers and strong instruction following.

2. gpt-5-mini
- I chose this model because it keeps good quality with lower latency and cost than full gpt-5.
- It accepts text and image input.
- It produces fast, balanced responses suitable for daily use.

3. gpt-5-nano
- I chose this model because it is optimized for very fast and lightweight runs.
- It accepts text and image input.
- It produces short, efficient responses at low cost.

4. gpt-4o
- I chose this model because it is a proven multimodal workhorse.
- It accepts text and image input.
- It produces stable, high-quality output for both reasoning and visual tasks.

5. gpt-4o-mini
- I chose this model because it is a strong low-cost general model.
- It accepts text and image input.
- It produces quick and useful responses for common chat tasks.

6. gpt-4.1
- I chose this model because it gives consistent high-quality text generation.
- It accepts text input in this configuration.
- It produces accurate explanations, summaries, and instruction-following outputs.

7. gpt-4.1-mini
- I chose this model because it offers a practical speed/quality balance.
- It accepts text input.
- It produces fast assistant responses for interactive chat.

8. gpt-4.1-nano
- I chose this model because it is efficient for lightweight prompts.
- It accepts text input.
- It produces short-form, low-latency outputs.

9. meta-llama-3.1-8b-instruct
- I chose this model because it is an open-weights instruct model with good value.
- It accepts text input.
- It produces capable general assistant responses with competitive cost.

10. meta-llama-3.1-405b-instruct
- I chose this model because it provides very strong open-weights reasoning quality.
- It accepts text input.
- It produces richer and deeper answers than smaller open models.

11. codestral-2501
- I chose this model because it is tuned for coding tasks.
- It accepts text input.
- It produces code generation, refactoring help, and technical responses effectively.

12. ministral-3b
- I chose this model because it is compact and inexpensive.
- It accepts text input.
- It produces fast responses for simple tasks and prototyping.

13. phi-4
- I chose this model because it is strong for compact reasoning workloads.
- It accepts text input.
- It produces concise, structured answers with good quality-per-cost.

14. deepseek-r1
- I chose this model because it is useful for deeper reasoning-style outputs.
- It accepts text input.
- It produces detailed thought-heavy responses.

15. grok-3
- I chose this model because it broadens provider diversity for general chat quality.
- It accepts text input.
- It produces capable conversational and analytical outputs.

16. grok-3-mini
- I chose this model because it gives a faster/lower-cost variant of grok-3.
- It accepts text input.
- It produces lightweight conversational responses with reduced latency.

### Gemini Models

1. gemini-2.5-flash-image
- I chose this model because it gives direct image generation from prompts.
- It accepts text prompts for image generation.
- It produces generated images returned to the UI.

2. gemini-2.5-flash-preview-tts
- I chose this model because it enables voice reply features.
- It accepts text for speech generation.
- It produces audio output (wav in this app flow) and transcript-compatible content.

### Hugging Face Models

1. Qwen/Qwen-Image
- I chose this model because it is a strong text-to-image model and adds provider diversity.
- It accepts text prompts for image generation.
- It produces generated images (URL or image payload depending on provider path).

## API Summary

- GET /api/health
- GET /api/models
- GET /api/images/models
- POST /api/images/generate
- POST /api/chats
- GET /api/chats
- GET /api/chats/{chat_id}
- DELETE /api/chats/{chat_id}
- POST /api/chats/{chat_id}/stream
- POST /api/chats/{chat_id}/audio
- POST /api/chats/{chat_id}/regenerate
- PATCH /api/chats/{chat_id}/last-prompt
- DELETE /api/chats/{chat_id}/last-prompt

## Troubleshooting

- If no models appear: verify .env values and call GET /api/models
- If Qwen image fails with credits message: Hugging Face provider credits are exhausted
- If stream fails with rate limits: wait and retry, or switch model
- If UI seems stale after changes: hard refresh browser and restart backend
