# 🚀 T-Shirt Shop Setup Guide

## Quick Start - Fix "Failed to create checkout session"

The checkout error happens because you need to set up your Stripe API keys. Here's how to fix it:

### 1. Get Your Stripe Test Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 2. Set Up Environment Variables

**Option A: Quick Setup (Recommended)**
1. Copy `.env.local.example` to `.env.local`
2. Replace the placeholder keys with your actual Stripe test keys:

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Option B: Update Development File**
Edit `.env.development` and replace the placeholder keys with your actual keys.

### 3. Restart the Server
```bash
npm run dev
```

### 4. Test Checkout
1. Add items to cart at `http://localhost:3000`
2. Go to cart and click "Proceed to Checkout"
3. Should redirect to Stripe checkout page

## 🎯 What's Fixed

✅ **Correct data structure**: Cart items now properly map to Stripe line items  
✅ **Field name fix**: `qty` → `quantity` mapping fixed  
✅ **Better error handling**: Detailed error messages in development  
✅ **Environment setup**: Clear instructions for API keys  
✅ **Port correction**: Fixed localhost:3000 URL  

## 💡 Test with Stripe Test Cards

Use these test card numbers in Stripe checkout:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0000 0000 3220`

Any future expiry date and any 3-digit CVC work for test cards.

## 🛍️ Your T-Shirt Shop Features

- ✅ 9 Products across 3 categories (Affordable, Workout, Premium)
- ✅ Size and color selection
- ✅ Shopping cart with localStorage persistence
- ✅ Stripe checkout with AUD currency
- ✅ Australia-only shipping
- ✅ Order success page
- ✅ Responsive design

Your shop is ready to make money! 💰