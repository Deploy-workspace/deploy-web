# Security & Secrets Policy

This repository is **public**. Treat everything committed here as visible to
anyone on the internet, forever (even after deletion — old commits remain in
Git history).

## Never commit

- API keys, tokens, or client secrets (Vercel, Google, Calendly, Stripe, etc.)
- `.env` / `.env.*` files or anything containing credentials
- Private keys or certificates (`*.pem`, `*.key`, `*.p12`)
- Passwords, service account JSON files, or DNS/registrar access tokens
- Internal/client-sensitive business data not meant for public view

## If a secret does get committed

1. Rotate/revoke that credential immediately at the source (it must be
   treated as compromised even if the commit is later removed).
2. Remove it from Git history (not just delete in a new commit).
3. Force-push the cleaned history and notify whoever has write access.

## Where real config lives

Local-only files (`.vercel/`, `.claude/`, `.env*`) are excluded via
`.gitignore` and never belong in this repo. Deployment config and secrets
are managed in the Vercel dashboard / project settings, not in source.
