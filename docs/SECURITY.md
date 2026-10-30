# Security

## Reporting a vulnerability

Use GitHub's private vulnerability reporting on the repository (Security tab, Report a vulnerability), or contact the repository owner directly. Do not open a public issue for a security problem.

## Secrets

- Real secrets live only in `.env.local` (gitignored) and in Vercel environment variables.
- `.gitignore` blocks every `.env*` file except `.env.local.example`, which holds placeholders only.
- CI runs gitleaks over the full git history on every push.
- Never set `NODE_TLS_REJECT_UNAUTHORIZED=0`. It disables certificate checking for all connections. For a corporate CA, use `NODE_EXTRA_CA_CERTS` instead.

### If a secret leaks

1. Rotate it immediately (Neon: reset the role password; Stripe: roll the key or webhook secret).
2. Update `.env.local` and the Vercel environment variables.
3. Redeploy.
4. Review Neon and Stripe logs for unfamiliar activity.
5. Removing the file from git is not enough, the value stays in history. Treat it as compromised.

## What the application enforces

| Area | Protection |
|---|---|
| Prices | Taken from `src/lib/products.ts` on the server. The request only supplies product id, size, color, quantity |
| Cart validation | Ids, sizes and colors checked against the catalog. Quantity 1 to 10, up to 20 lines, 10 KB body cap |
| Overselling | Stock check and reservation are one atomic statement under a database lock |
| Webhook | Stripe signature verified. Only paid sessions fulfilled. Idempotent per cart line |
| Order lookup | `/api/checkout/session` validates the session id format and returns only total, status and a masked email |
| SQL | Parameterized queries only |
| Errors | Generic messages to clients, details only in server logs |
| Rate limiting | 30 requests per minute per IP on checkout and inventory (not the webhook). In memory per instance |
| Admin paths | `/admin` returns 404. There is no admin area |
| Headers | CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP. `X-Powered-By` removed |
| Logging | No request bodies or customer details logged |

## Known limitations

- Rate limiting is per server instance. Reliable limits at scale need a shared store (for example Upstash Redis).
- CSP allows `'unsafe-inline'` scripts because Next.js needs them unless nonces are added.
- Beta mode path rules in `src/proxy.ts` are a convenience, not access control.

## Automation

| Check | When |
|---|---|
| Pre-commit hook (`.husky/pre-commit`) | Every commit: type-check, ESLint on staged files, `npm audit --audit-level=moderate` |
| `Security Scan` workflow | Push, pull request, daily: `npm audit`, build, type-check, gitleaks |
| `CodeQL` workflow | Push, pull request, weekly |
| Dependabot | Weekly npm and GitHub Actions updates |

GitHub Actions are pinned to commit SHAs and workflows run with read-only permissions.

Run everything locally with `npm run validate`. Do not bypass the pre-commit hook with `--no-verify`.

## Before going live

- [ ] Live keys only in Vercel, never in files
- [ ] Production webhook endpoint created with `checkout.session.completed` and `checkout.session.expired`
- [ ] `npm run db:harden` run on the production database
- [ ] `npm audit` reports 0 vulnerabilities
- [ ] Repository is private, or secrets confirmed rotated
