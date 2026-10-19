# Coding Standards — ApplyFlow_AI

Stack: FastAPI (ai_engine), React Router v7 (frontend), Node (nudger).

- Python: ruff; UUID strings for user_id; strict mypy; lifespan returns AsyncIterator[None]
- Frontend: prettier/eslint; no `use client`; `useState` for dialog sync; form-encoded JSON parsed via `request.formData()`
- Tests: pytest + vitest + playwright; evidence required on findings (file + line)
- Security: JWT 7-day; auth required on /settings (superadmin); validated uploads
- Build: Docker; rollback path documented; feature flags for release
