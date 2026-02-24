# ApplyFlow AI — API Reference

The AI Engine is a FastAPI service defined in `ai_engine/main.py`.

- **Default local base URL (Docker Compose)**: `http://localhost:8000`
- **Proxy base URL (when mounted behind a prefix)**: `http://localhost:8000/api`
  - The app is configured with `root_path="/api"` to support this deployment style.

## Endpoints

### Health

#### `GET /health`

**Response**

```json
{ "status": "healthy" }
```

### CV operations

#### `POST /cv/index-cv`

Upload and index a PDF resume in Pinecone.

- **Content-Type**: `multipart/form-data`
- **Form fields**
  - `file`: PDF file

**Example**

```bash
curl -sS -X POST \
  -F "file=@/path/to/CV.pdf" \
  "http://localhost:8000/cv/index-cv"
```

**Response**

```json
{
  "message": "CV indexed successfully",
  "filename": "CV.pdf",
  "chunks_created": 12
}
```

#### `POST /cv/search-cv`

Return the most relevant raw CV chunks for a job description (vector similarity only).

**Request (JSON)**

```json
{
  "job_description": "string",
  "top_k": 3
}
```

**Response**

```json
{
  "status": "success",
  "matches": [
    {
      "score": 0.1234,
      "content": "resume chunk text…",
      "metadata": { "source": "temp_uploads/CV.pdf", "page": 0 },
      "id": "optional-doc-id"
    }
  ]
}
```

### Agent operations

#### `POST /agent/process`

Retrieve the top \(k\) CV chunks, then run LLM analysis per chunk to produce:

- **`score`**: integer \(1–10\)
- **`reasoning`**: one sentence
- **`nudge`**: 2-sentence outreach message

**Request (JSON)**

```json
{
  "job_description": "string",
  "top_k": 5
}
```

**Response**

```json
{
  "status": "success",
  "data": [
    {
      "id": "optional-doc-id",
      "content": "resume chunk text…",
      "score": 8,
      "reasoning": "string",
      "nudge": "string"
    }
  ]
}
```

## Environment variables (AI Engine)

- **`PINECONE_API_KEY`**: required
- **`PINECONE_INDEX_NAME`**: optional (default `applyflow-cvs`)
- **`LLM_PROVIDER`**: optional (`groq` default, or `openai`)
- **`GROQ_API_KEY`**: required when `LLM_PROVIDER=groq`
- **`OPENAI_API_KEY`**: required when `LLM_PROVIDER=openai`

## Common error cases

- **`400`** on `/cv/index-cv`: only PDF files are accepted.
- **`429`**: LLM provider rate limiting (the UI handles this in the search screen).
- **`500`**: missing env vars (e.g., Pinecone key) or upstream API issues.

