# syntax=docker/dockerfile:1

# ---------- builder ----------
FROM python:3.14-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ARG EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    FASTEMBED_CACHE_PATH=/opt/models

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project --no-dev

# Bake the embedding model into the image (no download at runtime)
RUN /opt/venv/bin/python -c "from fastembed import TextEmbedding; TextEmbedding('${EMBEDDING_MODEL}')"

# ---------- development: hot reload + debugger ----------
FROM builder AS development
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --python /opt/venv/bin/python debugpy

COPY . .
EXPOSE 8000 5678

# fastapi dev binds to 127.0.0.1 by default, so --host 0.0.0.0 is required in Docker
# CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "fastapi", "dev", "--host", "0.0.0.0", "--port", "8000" "--workers", "2"]
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8000"]

# ---------- production ----------
FROM python:3.14-slim AS production
ENV PATH="/opt/venv/bin:$PATH" \
    FASTEMBED_CACHE_PATH=/opt/models \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN useradd --create-home --uid 1000 appuser

COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /opt/models /opt/models
COPY --chown=appuser:appuser . .

USER appuser
EXPOSE 8000

CMD ["fastapi", "run", "--port", "8000", "--workers", "2"]