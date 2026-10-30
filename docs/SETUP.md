# Setup

## Prerequisites

- Node.js 22+
- A Stripe account (test mode is free)
- A Neon Postgres project (free tier works)
- Stripe CLI for local webhooks

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy the template and fill in real values. `.env.local` is gitignored.

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon dashboard, Connection Details, pooled connection string |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard, Developers, API keys |
| `STRIPE_SECRET_KEY` | Same page. Use `sk_test_` locally, `sk_live_` only in Vercel |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI output locally, or the webhook endpoint page in production |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your domain in production |

Checkout refuses to run if `STRIPE_SECRET_KEY` or `NEXT_PUBLIC_APP_URL` is missing.

## 3. Database

```bash
npm run db:migrate   # creates inventory, reservations, purchases tables and seeds stock
npm run db:harden    # per-line uniqueness and CHECK constraints (safe to re-run)
```

Run `db:harden` after `db:migrate` on every database, new or existing.

## 4. Run

```bash
npm run dev
```

## 5. Stripe webhook (local)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart the dev server.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC. Declined: `4000 0000 0000 0002`.

## Deploying to Vercel

1. Import the repo in Vercel.
2. Add every variable above under Project Settings, Environment Variables, using **live** Stripe keys for Production.
3. In Stripe (live mode), add a webhook endpoint `https://<your-domain>/api/webhooks/stripe` for the events `checkout.session.completed` and `checkout.session.expired`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Run `npm run db:harden` against the production database once.
5. Place a small real order to confirm stock decreases.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Checkout is temporarily unavailable" | `STRIPE_SECRET_KEY` or `NEXT_PUBLIC_APP_URL` is missing |
| Webhook returns 400 "Invalid signature" | Wrong `STRIPE_WEBHOOK_SECRET`. Restart the server after changing it |
| `self-signed certificate in certificate chain` on Windows | Your network uses a corporate CA. Set `NODE_EXTRA_CA_CERTS` to that CA's `.pem` file. **Do not set `NODE_TLS_REJECT_UNAUTHORIZED=0`**, it turns off certificate checking for every connection, including Stripe and the database |
| Port 3000 in use | Stop the other node process (`taskkill /F /IM node.exe /T` on Windows) |
| "Both middleware and proxy detected" | Delete `src/middleware.ts`. This project uses `src/proxy.ts` |
| Database connection failed | Check `DATABASE_URL` and that it includes `sslmode=require` |
