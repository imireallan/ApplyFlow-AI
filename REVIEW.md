# REVIEW.md — What Failure Looks Like in ApplyFlow

For AI or human reviewers. Short. Evidence required (file + line), not guesses.

Failure modes by area:
- ai_engine: incorrect UUID user strings; missing lifespan AsyncIterator; strict mypy failures; broken alembic migrations
- frontend: theme flash; missing `useState` for dialog sync; `use client` directives added; form-encoded JSON not parsed
- security: exposed JWT secrets; missing auth on /settings (superadmin-only); unvalidated uploads
- ops: broken rollback path; feature flag missing; no internal-first release step

Cap nits. Skip pre-existing. Count findings. Plain summary.
