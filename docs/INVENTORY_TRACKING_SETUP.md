# Inventory Tracking Setup Guide

## 🎉 Automatic Inventory Tracking is Now Active!

Your website now tracks inventory automatically through Stripe webhooks. Here's what you need to do in Stripe:

---

## 📋 What You Need to Do in Stripe

### Step 1: Set Up Webhook Endpoint

1. **Go to Stripe Dashboard**
   - Test mode: https://dashboard.stripe.com/test/webhooks
   - Live mode: https://dashboard.stripe.com/webhooks

2. **Click "Add endpoint"**

3. **Enter your webhook URL:**
   - For local development: `http://localhost:3000/api/webhooks/stripe`
   - For production: `https://yourdomain.com/api/webhooks/stripe`

4. **Select events to listen to:**
   - Click "Select events"
   - Check: `checkout.session.completed`
   - Click "Add events"

5. **Click "Add endpoint"**

### Step 2: Get Your Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click "Reveal" under "Signing secret"
3. Copy the secret (starts with `whsec_...`)

### Step 3: Add to Your Environment Variables

Add this to your `.env.local` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## 🔒 Testing Webhooks Locally

Since webhooks need a public URL, you'll need to use the Stripe CLI for local testing:

### Option 1: Stripe CLI (Recommended)

1. **Install Stripe CLI:**
   - Windows: `scoop install stripe`
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Or download from: https://stripe.com/docs/stripe-cli

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Get your webhook signing secret** from the CLI output
   - It will show: `whsec_...`
   - Add this to your `.env.local`

5. **Test a payment** - the CLI will show webhook events in real-time!

### Option 2: Deploy to Vercel/Production

If you deploy to production, the webhook will work automatically with the URL you set up in Step 1.

---

## 📊 How It Works

### When a Customer Pays:

1. **Customer completes checkout** via Stripe
2. **Stripe sends webhook** to your endpoint
3. **Your server receives the event** and extracts order details
4. **Inventory automatically updates:**
   - Example: `Black-M: 12 → 11`
5. **Customers see real-time stock** on your website

### What You'll See:

- ✅ **"10 items remaining"** - Low stock warning
- ⚠️ **"Only 3 left!"** - Very low stock
- 🔴 **"SOLD OUT"** - No stock available
- 🎨 **Grayed out colors/sizes** - Unavailable options

---

## 🗂️ Managing Your Inventory

### Update Stock Levels

Edit the file: `src/data/inventory.json`

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Black-XL": 10,
    "Off-white-M": 12,
    "Off-white-L": 18,
    "Off-white-XL": 10
  }
}
```

**Format:** `"Color-Size": StockQuantity`

### Example: Your Inventory

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Black-XL": 10,
    "Off-white-M": 12,
    "Off-white-L": 18,
    "Off-white-XL": 10
  }
}
```

- Total Black: 40 units
- Total Off-white: 40 units
- **Total: 80 units**

### When Stock Changes:

The webhook automatically reduces stock when someone pays. If you need to:

- **Restock**: Edit the JSON file and increase numbers
- **Add new variants**: Add new `"Color-Size": quantity` entries
- **Remove variants**: Delete the line or set to `0`

---

## ✅ Verification Checklist

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` added to `.env.local`
- [ ] Webhook listening to `checkout.session.completed` event
- [ ] Inventory data populated in `src/data/inventory.json`
- [ ] Tested a purchase and verified inventory decreased
- [ ] Stock warnings appear on product pages
- [ ] Sold out items are properly disabled

---

## 🚨 Troubleshooting

### Webhook Not Receiving Events?

1. Check Stripe Dashboard → Webhooks → Your endpoint
2. Look at "Recent events" to see if events are being sent
3. Click on a failed event to see the error message

### Inventory Not Updating?

1. Check your server logs for webhook errors
2. Verify the product metadata includes `productId`, `color`, and `size`
3. Make sure the `inventory.json` file has the correct product ID

### Stock Warnings Not Showing?

1. Make sure inventory is properly loaded
2. Check browser console for errors
3. Verify the product ID matches between `products.ts` and `inventory.json`

---

## 🎯 Production Deployment

When deploying to production:

1. Update webhook URL to your production domain
2. Add `STRIPE_WEBHOOK_SECRET` to your production environment variables
3. Switch to Stripe Live mode and create a new webhook
4. Test with a real payment (small amount)
5. Monitor the first few transactions to ensure inventory updates correctly

---

## 📞 Need Help?

- Stripe Webhooks Docs: https://stripe.com/docs/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Test your webhook: https://dashboard.stripe.com/test/webhooks

---

**You're all set!** 🎊 Your inventory will now automatically track sales through Stripe!
