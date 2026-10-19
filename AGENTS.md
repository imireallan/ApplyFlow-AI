# AGENTS.md — Agent Context for ApplyFlow AI

Project: ApplyFlow_AI. Stack: FastAPI (ai_engine) + React Router v7 (frontend) + Node (nudger). Agent: Hermes (agent-agnostic conventions apply).

Conventions:
- Tests: pytest (ai_engine), vitest + playwright (frontend)
- Build: Docker + docker-compose; ports: frontend 5173, Django/backend 8000, ai 8001, DB 5432
- Lint: ruff (Python), prettier/eslint (frontend)
- Security: JWT 7-day expiry; UUID strings required for user_id in services

Non-goals: Prisma; `.postman/` removed from tracking.
