# 🗄️ Database Migration Guide

## Quick Setup (< 15 minutes)

### Step 1: Create Free Neon Database (2 minutes)

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub (instant)
3. Click "Create Project"
   - Name: `yogi-inventory`
   - Region: Choose closest to you
   - Postgres Version: 16 (default)
4. Click "Create Project"

### Step 2: Get Connection String (1 minute)

1. After project creation, you'll see a **Connection String**
2. Copy the string that looks like:
   ```
   postgresql://username:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Save it somewhere safe!

### Step 3: Add to Environment Variables (1 minute)

Update `.env.development`:
```bash
DATABASE_URL=postgresql://your-actual-connection-string-here
```

### Step 4: Run Migration (1 minute)

```bash
npm run db:migrate
```

This will:
- Create `inventory` and `reservations` tables
- Transfer all data from `inventory.json`
- Verify everything worked

### Step 5: Update Code References (5 minutes)

The migration script will show you which files to update. Simply change imports from:
```typescript
import { ... } from '@/lib/inventory';
```

To:
```typescript
import { ... } from '@/lib/inventory-db';
```

Files to update:
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/inventory/check/route.ts`

### Step 6: Test It! (2 minutes)

```bash
npm run dev
```

Try adding items to cart and checking out. It should work exactly the same!

---

## What You Get

✅ **Transaction Safety** - No race conditions
✅ **Automatic Indexing** - Fast lookups
✅ **Purchase History** - Can add order tracking later
✅ **Connection Pooling** - Handles concurrent users
✅ **Free Tier** - 0.5GB storage, 100 hours compute/month
✅ **Vercel Integration** - Auto-deploys with your app

---

## Neon Free Tier Limits

- **Storage**: 0.5GB (enough for 1 million+ orders)
- **Compute**: 100 hours/month (auto-suspends when inactive)
- **Connections**: Unlimited (connection pooling)
- **Databases**: 10 per project

You won't hit these limits with 80 items!

---

## Database Schema

### inventory table
```sql
- product_id: INTEGER (e.g., 7)
- color: VARCHAR(50) (e.g., "Black")
- size: VARCHAR(10) (e.g., "M")
- stock: INTEGER (e.g., 35)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
UNIQUE(product_id, color, size)
```

### reservations table
```sql
- session_id: VARCHAR(255) (Stripe session ID)
- product_id: INTEGER
- color: VARCHAR(50)
- size: VARCHAR(10)
- quantity: INTEGER
- expires_at: BIGINT (Unix timestamp)
- created_at: TIMESTAMP
```

---

## Rollback Plan

If anything goes wrong, you still have your JSON files!

To rollback:
1. Just don't update the import statements
2. Code keeps using JSON files
3. Database sits there unused

---

## Production Deployment

When deploying to Vercel:

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = (your Neon connection string)
3. Vercel auto-detects Neon and optimizes connection pooling

That's it! No extra configuration needed.

---

## Monitoring Your Database

### Neon Dashboard:
- View real-time queries
- Monitor storage usage
- See connection stats
- Download backups

### Access:
[https://console.neon.tech](https://console.neon.tech)

---

## Next Steps After Migration

1. ✅ Test checkout flow
2. ✅ Test stock reservations
3. ✅ Verify webhook updates
4. 🚀 Deploy to Vercel
5. 🎉 Launch!

---

## Common Issues

**"Connection refused"**
→ Check DATABASE_URL is correct, includes `?sslmode=require`

**"No data after migration"**
→ Run migration script again: `npm run db:migrate`

**"Slow queries"**
→ Indexes are created automatically, should be fast

**"Hit connection limit"**
→ Won't happen - Neon uses connection pooling

---

## Need Help?

- Neon Docs: https://neon.tech/docs
- Neon Discord: https://discord.gg/neon
- Or just ask me! 😊
