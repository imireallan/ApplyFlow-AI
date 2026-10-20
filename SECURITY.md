# Security Review — ApplyFlow AI

Blockers (must fix or resolve with reason):
- Auth: `/settings` is SUPERADMIN-only; org ADMINs cannot change name/slug/subscription
- JWT: 7-day expiry; secret rotation required
- Uploads: validated; no unvalidated file paths in ai_engine
- DB: no exposed connection strings in env; use `.env` + Docker secrets
- CI: never commit `.postman/` or `.env`; `.postman/` removed from tracking

Run: `/security-review` or open-source GitHub Action. Open findings block merge.
