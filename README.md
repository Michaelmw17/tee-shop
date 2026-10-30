# Tee Shop

A T-shirt store built with Next.js, Stripe Checkout and Neon Postgres. It tracks inventory in a database, holds stock for 30 minutes during checkout, and ships to Australia only (AUD).

## Features

- Stripe Checkout payments with webhook confirmation
- Database-backed inventory with 30-minute cart reservations
- Low-stock and sold-out warnings
- Free shipping over $200 AUD, otherwise $10 (express $25)
- Beta mode that limits the store to selected products (see [BETA_LAUNCH_GUIDE.md](./BETA_LAUNCH_GUIDE.md))
- Prices are always taken from the server-side catalog, never from the browser

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Stripe, Neon Postgres. Node 22+.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in real values
npm run db:migrate                 # create tables and seed stock
npm run db:harden                  # apply schema fixes
npm run dev                        # http://localhost:3000
```

Full instructions, including the Stripe webhook listener, are in [docs/SETUP.md](./docs/SETUP.md).

**Secrets live in `.env.local` (gitignored) and in Vercel environment variables. Never commit them.** See [docs/SECURITY.md](./docs/SECURITY.md).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and run |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run type-check` | TypeScript check |
| `npm run validate` | Type-check, lint and `npm audit` |
| `npm run db:migrate` | Create tables and seed inventory from `src/data/inventory.json` |
| `npm run db:harden` | Apply idempotent schema fixes to an existing database |

## Project structure

```
src/
  app/api/checkout/        Create Stripe session (server-side prices, atomic reservation)
  app/api/checkout/session Order confirmation lookup (minimal, masked data)
  app/api/inventory/check  Stock levels for the UI
  app/api/webhooks/stripe  Signature-verified, idempotent fulfilment
  app/store/               Store pages
  lib/products.ts          Product catalog (single source of truth for prices)
  lib/inventory-db.ts      Stock, reservations
  lib/db.ts                Database connection and schema
  config/beta.ts           Beta mode switches
  proxy.ts                 Rate limiting and beta path rules
  types/product.ts         The one Product type used everywhere
scripts/                   Database and inventory maintenance scripts
```

## Managing products

Edit `src/lib/products.ts`. Product ids, colors and sizes must match the `inventory` table exactly (case-sensitive). See [docs/INVENTORY.md](./docs/INVENTORY.md).

## Documentation

- [docs/SETUP.md](./docs/SETUP.md): local setup, Stripe, database, deployment
- [docs/INVENTORY.md](./docs/INVENTORY.md): stock, reservations, maintenance scripts
- [docs/SECURITY.md](./docs/SECURITY.md): protections, secret handling, reporting
- [BETA_LAUNCH_GUIDE.md](./BETA_LAUNCH_GUIDE.md): beta mode and expanding the catalog
