# Inventory

Stock lives in Neon Postgres. The catalog (names, prices, colors, sizes) lives in `src/lib/products.ts`.

## Tables

| Table | Purpose |
|---|---|
| `inventory` | Stock per `(product_id, color, size)`. Stock can never go below 0 |
| `reservations` | Stock held for an open Stripe checkout session, one row per cart line, 30 minutes |
| `purchases` | One row per paid cart line, unique per `(session_id, product_id, color, size)` |

## How stock moves

1. **Checkout request:** the server rebuilds the cart from the catalog and checks `stock - active reservations` for each line.
2. **Reserve:** after the Stripe session is created, all lines are reserved in one atomic statement under a database lock, so two buyers cannot take the last unit. If it fails, the Stripe session is expired.
3. **Paid:** Stripe sends `checkout.session.completed`. For each line the webhook inserts the purchase and reduces stock in a single statement. A replayed webhook changes nothing.
4. **Abandoned:** `checkout.session.expired` (or the 30-minute expiry) releases the reservation.

## Seeding and changing stock

Initial stock comes from `src/data/inventory.json`, loaded by `npm run db:migrate`. Format: `"product id" -> "Color-Size": quantity`.

After that the database is the source of truth. Change stock with SQL in the Neon console:

```sql
UPDATE inventory SET stock = 100, updated_at = NOW()
WHERE product_id = 7 AND color = 'Black' AND size = 'M';
```

Set a variant to `0` to mark it sold out. Do not delete the row.

## Naming rules

Product ids, colors and sizes in `inventory` must match `src/lib/products.ts` exactly, including case. A mismatch makes the item look out of stock.

## Useful queries

```sql
-- Current stock
SELECT product_id, color, size, stock FROM inventory ORDER BY product_id, color, size;

-- Orders
SELECT created_at, product_id, color, size, quantity, total_price, customer_email
FROM purchases ORDER BY created_at DESC;

-- Active reservations
SELECT session_id, product_id, color, size, quantity
FROM reservations WHERE expires_at > (EXTRACT(EPOCH FROM NOW()) * 1000);
```

## Maintenance scripts

Run with `npx tsx scripts/<name>.ts` (they read `.env.local`).

| Script | Purpose |
|---|---|
| `check-inventory.ts` | Print all inventory levels |
| `check-reservations.ts` | Print active reservations |
| `fix-inventory.ts` | Remove bad inventory entries |
| `reset-stock.ts` | Reset one inventory item |

These change production data when pointed at a production `DATABASE_URL`. Check which database `.env.local` points to first.
