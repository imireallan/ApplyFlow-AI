# Local Development

This repo is designed to run locally via Docker Compose (recommended), or each service can be run independently.

## Prerequisites

- Docker + Docker Compose
- Pinecone account + API key
- One LLM provider:
  - Groq (default) + API key, or
  - OpenAI + API key

## 1) Create `.env` at repo root

Create a file named `.env` in the repo root (it is git-ignored). Minimum variables:

```bash
# Vector DB
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=applyflow-cvs

# LLM provider (groq | openai)
LLM_PROVIDER=groq
GROQ_API_KEY=...

# Nudger (optional for now, but required for the container to start cleanly)
DATABASE_URL=postgres://allan_admin:password123@db:5432/applyflow_db
```

If using OpenAI:

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=...
```

## 2) Start the stack

From the repo root:

```bash
docker compose up --build
```

### Ports

- **Frontend**: `5173` → `http://localhost:5173`
- **AI Engine**: `8000` → `http://localhost:8000`
- **Postgres**: `5432` → `postgres://allan_admin:password123@localhost:5432/applyflow_db`

## 3) Use the app

1. Open `http://localhost:5173`.
2. Go to **Upload** and upload your resume PDF.
3. Go to **Search** and paste a job description.

## Troubleshooting

### Pinecone errors / missing index

The AI Engine creates the Pinecone index automatically if it does not exist:

- Index name defaults to `applyflow-cvs` (override with `PINECONE_INDEX_NAME`)
- Dimension is `384` (embedding model `all-MiniLM-L6-v2`)

If Pinecone rejects requests, verify `PINECONE_API_KEY` and your Pinecone project limits.

### LLM rate limiting (429)

Groq can rate limit or hit daily token caps. In the UI, the search screen shows a friendly “System Overloaded” message on HTTP `429`.

Mitigations:

- Wait and retry
- Reduce `top_k` (fewer chunks → fewer LLM calls)
- Switch providers (`LLM_PROVIDER=openai`)

### Frontend can’t reach AI Engine

The frontend uses `VITE_AI_API_URL` (set in `docker-compose.yml`) and appends:

- `/cv/index-cv`
- `/agent/process`

If you run the frontend outside Compose, set `VITE_AI_API_URL` to match your AI Engine URL:

- `http://localhost:8000` (works locally)
- `http://localhost:8000/api` (also supported when mounted behind a prefix)

