# 🚀 Production Deployment Guide

## 📋 **Environment Setup Strategy**

Your T-shirt shop uses a **multi-environment setup** that automatically handles test vs live keys:

```
Local Development  →  Uses .env.development (test keys)
Production Deploy  →  Uses Vercel env vars (live keys)
```

## 🔧 **How It Works**

### **Development (Automatic)**
```bash
npm run dev
# ✅ Automatically loads .env.development
# ✅ Uses Stripe test keys (safe)
# ✅ Local URL: http://localhost:3001
```

### **Production (Vercel)**
```bash
npm run build
# ✅ Uses environment variables from Vercel dashboard
# ✅ Uses Stripe live keys (real money!)
# ✅ Production URL: https://your-domain.vercel.app
```

## 🎯 **Quick Deployment (30 minutes)**

### **Step 1: Get Your Live Stripe Keys**

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/apikeys
2. **Switch to "Live" mode** (toggle in top-left)
3. **Copy your live keys:**
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### **Step 2: Deploy to Vercel**

1. **Connect GitHub:**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables in Vercel:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add these variables for **Production**:

   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your_live_key_here
   STRIPE_SECRET_KEY = sk_live_your_live_secret_here
   NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
   NODE_ENV = production
   ```

### **Step 3: Test Production**

1. **Visit your live site**
2. **Add a product to cart**
3. **Go through checkout** (use real card or test card)
4. **Check Stripe Dashboard** for the order

## ⚠️ **IMPORTANT SECURITY**

### **Test Keys (Safe) - Already in .env.development:**
```bash
# These are in your code repository (safe to commit)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SPEr...
STRIPE_SECRET_KEY=sk_test_51SPEr...
```

### **Live Keys (Secret) - Only in Vercel:**
```bash
# These should NEVER be in your code
# Only add them to Vercel environment variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## 🔍 **Verify Your Setup**

### **Development Check:**
```bash
npm run dev
# Should show: http://localhost:3001
# Stripe should be in "test mode"
# No real money processed
```

### **Production Check:**
```bash
# In your live site console:
console.log(process.env.NODE_ENV) // "production"
# Stripe should show "live mode"
# Real money will be processed!
```

## 🎊 **Benefits of This Setup**

1. **🔒 Automatic Security**: Test keys in dev, live keys in prod
2. **🚀 Easy Deployment**: No manual key switching needed
3. **👥 Team Safe**: Developers can't accidentally use live keys
4. **🔧 No Mistakes**: Environment automatically determines key type
5. **💰 Revenue Ready**: Production immediately processes real payments

## 📞 **Deployment Checklist**

- [ ] ✅ Test keys working in development
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Vercel project created
- [ ] ✅ Live Stripe keys added to Vercel
- [ ] ✅ Production URL updated in environment
- [ ] ✅ Test checkout flow on live site
- [ ] ✅ Verify Stripe dashboard shows live orders

**Your T-shirt shop is now live and making money!** 💰

## 🔄 **Environment File Summary**

```
.env.development         # ✅ Committed (test keys)
.env.local              # ❌ Ignored (personal overrides)
.env.production.example # ✅ Committed (template only)
```

**Perfect setup for a professional e-commerce business!**