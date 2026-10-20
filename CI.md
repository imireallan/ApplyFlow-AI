# Blocking CI — ApplyFlow AI

Red = block merge.
- ai_engine: ruff + pytest; strict mypy; build (docker-compose build ai_engine)
- frontend: prettier/eslint + vitest + playwright; build (npm run build); typecheck (npm run typecheck)
- Security: `/security-review` must pass
- Merge queue: re-run on latest main before merge
