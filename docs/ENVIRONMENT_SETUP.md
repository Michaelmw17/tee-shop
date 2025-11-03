# 🔧 Environment Setup - Simplified

## **Simple Two-File System:**

```
.env.development    # ✅ Test keys (committed to repo)
.env.local         # ❌ Personal overrides (gitignored)
```

## **How It Works:**

### **For Most Developers:**
```bash
git clone your-repo
npm install
npm run dev  # Just works! Uses .env.development
```

**No setup needed!** The test keys are already in `.env.development`.

### **If You Need Custom Settings:**
```bash
# Copy and edit for personal overrides
cp .env.local.example .env.local
# Edit .env.local with your custom settings
```

## **Environment Loading:**

Next.js loads environment variables in this order:
1. `.env.development` (your test keys - everyone uses these)
2. `.env.local` (your personal overrides - optional)

## **Production Deployment:**

Add these to **Vercel environment variables**:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your_live_key
STRIPE_SECRET_KEY = sk_live_your_secret_key
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

## **Why This Works:**

- **✅ Simple**: One file for development
- **✅ Secure**: Test keys safe to commit
- **✅ Flexible**: Override with .env.local if needed
- **✅ Team-Friendly**: New developers just run `npm run dev`

**No complex setup, no confusion!**