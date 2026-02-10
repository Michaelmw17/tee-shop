# ⚡ 15-Minute Database Setup Checklist

## ✅ What's Been Done:
- [x] Installed Neon Postgres client
- [x] Created database schema (inventory + reservations tables)
- [x] Built migration script to transfer JSON data
- [x] Added database connection setup
- [x] Created inventory-db.ts with all functions

## 🚀 What YOU Need to Do:

### 1. Create Neon Account (2 min)
- [ ] Go to https://neon.tech
- [ ] Sign up with GitHub
- [ ] Create project named "yogi-inventory"
- [ ] Copy connection string

### 2. Add Connection String (30 sec)
- [ ] Open `.env.development`
- [ ] Replace `DATABASE_URL=postgresql://...` with your actual connection string
- [ ] Save file

### 3. Run Migration (30 sec)
```bash
npm run db:migrate
```

Watch for "✅ Migration completed successfully!"

### 4. Update 3 Files (3 min)
Change these imports from `@/lib/inventory` to `@/lib/inventory-db`:

**File 1:** `src/app/api/checkout/route.ts`
```typescript
// OLD:
import { validateCartStock, reserveStock } from '@/lib/inventory';

// NEW:
import { validateCartStock, reserveStock } from '@/lib/inventory-db';
```

**File 2:** `src/app/api/webhooks/stripe/route.ts`
```typescript
// OLD:
import { updateInventory, releaseReservation } from '@/lib/inventory';

// NEW:
import { updateInventory, releaseReservation } from '@/lib/inventory-db';
```

**File 3:** `src/app/api/inventory/check/route.ts`
```typescript
// OLD:
import { getAvailableStock, getLowStockWarning, getAvailableColors, getAvailableSizes } from '@/lib/inventory';

// NEW:
import { getAvailableStock, getLowStockWarning, getAvailableColors, getAvailableSizes } from '@/lib/inventory-db';
```

### 5. Test Locally (2 min)
```bash
npm run dev
```

- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Verify stock shows correctly
- [ ] Complete a test purchase

### 6. Deploy to Vercel (5 min)
- [ ] Vercel Dashboard → Your Project → Settings
- [ ] Environment Variables → Add Variable
  - Name: `DATABASE_URL`
  - Value: (paste your Neon connection string)
- [ ] Click "Save"
- [ ] Redeploy

## ✨ You're Done!

Your inventory is now in a secure, scalable database. 

## 🔄 Rollback Plan
If anything breaks:
- Don't update the imports
- Code keeps using JSON files
- You can try again anytime

## 📊 Next Steps
- Monitor database at https://console.neon.tech
- Add purchase history tracking (later)
- Set up automated backups (optional)

---

**Total Time:** ~13 minutes
**Difficulty:** Easy
**Safety:** JSON files are still there as backup
