# ApplyFlow AI

ApplyFlow AI is an intelligent job application assistant focused on the “last‑mile” problem of job hunting: **turning a resume + job description into an actionable application strategy**.

Today, the repo implements:

- **CV indexing (PDF → chunks → embeddings → Pinecone)**
- **Semantic retrieval** of the most relevant resume “experience blocks” for a given job description
- **LLM coaching output** per retrieved block: a \(1–10\) match score, one-sentence reasoning, and a 2‑sentence recruiter outreach “nudge”
- A **React Router v7 UI** to upload a CV and search/analyze job descriptions

## Repository layout

- **`frontend/`**: React Router v7 + Vite + Tailwind UI
- **`ai_engine/`**: FastAPI backend providing CV indexing + retrieval + LLM orchestration (LangChain)
- **`nudger/`**: Node/TypeScript service intended for scheduled “nudge” automation (currently a DB connectivity + placeholder scaffold)
- **`docker-compose.yml`**: local orchestration (frontend + ai_engine + nudger + Postgres)

## How the pieces fit together

1. You upload a PDF resume in the UI.
2. The AI Engine chunks and embeds it, then stores vectors in Pinecone.
3. When you paste a job description:
   - The AI Engine retrieves the top \(k\) most similar resume chunks.
   - For each chunk, an LLM returns structured JSON: `match_score`, `reasoning`, `nudge`.
4. The UI renders the best match(es) and provides copy-to-clipboard outreach text.

## Quickstart (Docker Compose)

1. Create a root `.env` file (git-ignored) with at least the variables in the section below.
2. Start the stack:

```bash
docker compose up --build
```

3. Open:
   - **Frontend**: `http://localhost:5173`
   - **AI Engine health**: `http://localhost:8000/health`

## Required environment variables

These are read by `ai_engine/` and `nudger/` (Compose loads them via `env_file: .env`).

- **`PINECONE_API_KEY`**: required (vector DB)
- **`PINECONE_INDEX_NAME`**: optional (default: `applyflow-cvs`)
- **`LLM_PROVIDER`**: optional (`groq` default, or `openai`)
- **`GROQ_API_KEY`**: required when `LLM_PROVIDER=groq`
- **`OPENAI_API_KEY`**: required when `LLM_PROVIDER=openai`
- **`DATABASE_URL`**: required for `nudger/` (e.g. `postgres://allan_admin:password123@db:5432/applyflow_db`)

The frontend reads:

- **`VITE_AI_API_URL`**: the AI Engine base URL (Compose sets it to `http://ai_engine:8000`).
  - The UI appends paths like `/cv/index-cv` and `/agent/process`.
  - The FastAPI app is configured with `root_path="/api"` for proxy deployments; using a base like `http://localhost:8000/api` also works.

## Documentation

- **API reference**: `docs/API.md`
- **Local development guide**: `docs/LOCAL_DEV.md`
- **Product Requirements Document (PRD)**: `docs/PRD.md`
- **Technical Design Document (TDD)**: `docs/TDD.md`
- **Software Design Specification (SDS)**: `docs/SDS.md`
- **Deployment & Operations Guide (OPS)**: `docs/OPS.md`

