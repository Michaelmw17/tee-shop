# 🎯 T-Shirt Shop - Ready for Business!

## ⚡ **QUICK START - Fix Checkout Error**

**Getting "Failed to create checkout session"?** You need to add your Stripe keys:

1. **Get Stripe Test Keys**: https://dashboard.stripe.com/test/apikeys
2. **Create `.env.local`** file in the root directory:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
3. **Restart the server**: `npm run dev`
4. **Test with card**: `4242 4242 4242 4242`

**That's it!** Your checkout will work perfectly. 🎉

---

## 🚀 **WHAT YOU HAVE**

A **professional, cost-effective T-shirt e-commerce store** built with:

- ✅ **Next.js 15.5.4** - Modern React framework with TypeScript
- ✅ **Stripe Integration** - Secure AUD payments (tested with $32.99 order)
- ✅ **Australia-Only Shipping** - Simplified logistics
- ✅ **Simple Product Catalog** - Easy to manage in code
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Shopping Cart** - Full e-commerce functionality

## 💰 **COST-EFFECTIVE APPROACH**

**Total Monthly Costs: $0-1.25**
- Vercel Hosting: Free
- Product Management: $0 (code-based)
- Stripe: Only 2.9% + 30¢ per sale
- Domain: ~$15/year (optional)

**No database hosting fees, no monthly software subscriptions!**

## Vercel Deployment

- Push your repo to GitHub.
- Import to Vercel and set environment variables in the dashboard.
- Custom config in `config/vercel.json`.

## 🏪 **CURRENT STATUS**

### ✅ **READY TO LAUNCH**
- Store running at `http://localhost:3001`
- 9 sample products across 3 categories
- Full checkout process working
- Payment processing proven

### 🛍️ **PRODUCT MANAGEMENT**
- **File:** `/src/lib/products.ts`
- **Add Products:** Edit the PRODUCTS array
- **Upload Images:** Place in `/public` folder
- **Categories:** Affordable, Workout, Premium

## 🚀 **GETTING STARTED**

### **Install & Run**
```bash
npm install
npm run dev
```
Visit: `http://localhost:3001`

### **Environment Variables**
```bash
# Copy the template and add your Stripe test keys
cp .env.local.example .env.local

# Edit .env.local with your test keys from:
# https://dashboard.stripe.com/test/apikeys

npm run dev  # Now it works!
```

## 🚀 **LAUNCH YOUR BUSINESS (30 minutes)**

### **Automatic Environment Switching:**
- **Development**: Automatically uses test keys (safe)
- **Production**: Uses live keys from Vercel (real money!)

### **Quick Deploy:**
1. **Get live Stripe keys** from dashboard
2. **Deploy to Vercel** with one click
3. **Add environment variables** in Vercel
4. **Start making money!** 💰

📚 **Full deployment guide:** [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)

## 📋 **ORDER MANAGEMENT**

**All order management through Stripe Dashboard:**
- View all payments and customer details
- Handle refunds and customer service
- Export data for accounting
- Track revenue and analytics

**No complex admin panel needed - Stripe handles everything!**

## 🎯 **BUSINESS MODEL**

**Perfect for:**
- Small T-shirt businesses
- Print-on-demand operations
- Local clothing brands
- Side hustles scaling up

**Smart Features:**
- Australia-only shipping (simplified logistics)
- AUD currency (local market focus)
- Manual inventory (start simple, scale later)
- Direct customer relationships

## 📈 **SCALING PATH**

### **$0-1K/month**: Current Setup (Perfect!)
- Manual inventory tracking
- Stripe dashboard for orders
- Focus on marketing and sales

### **$1K+/month**: Optional Upgrades
- Add customer accounts
- Inventory automation
- Email marketing integration
- Analytics dashboard

## 🎊 **WHY THIS APPROACH WORKS**

1. **Start Simple**: No over-engineering
2. **Prove Demand**: Validate your business first
3. **Stay Lean**: Focus on revenue, not features
4. **Scale Smart**: Add complexity when needed

**You're ready to make money today!** 💰

---

## 📞 **NEXT STEPS**

1. **Customize products** in `/src/lib/products.ts`
2. **Upload your T-shirt images** to `/public`
3. **Deploy to Vercel** (30 minutes)
4. **Start marketing** your T-shirts

**From setup to first sale: Under 1 hour!**

## 📚 **DOCUMENTATION**

Additional documentation is available in the [`/docs`](./docs/) folder:

- [`CURRENT_STATUS.md`](./docs/CURRENT_STATUS.md) - Current project status and what's working
- [`COMPLETION_CHECKLIST.md`](./docs/COMPLETION_CHECKLIST.md) - Full development checklist and roadmap
- [`DATABASE_VS_NO_DATABASE.md`](./docs/DATABASE_VS_NO_DATABASE.md) - Why we chose the simple approach
- [`README_NEXT_STEPS.md`](./docs/README_NEXT_STEPS.md) - Detailed next steps guide
- [`SECURITY.md`](./docs/SECURITY.md) - Security policies and best practices

## 🎯 **PROJECT STRUCTURE**

```
yogi/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   └── lib/
│       └── products.ts      # 🛍️ Product catalog (edit here!)
├── public/                  # Static files and images
├── docs/                    # 📚 All documentation
├── config/                  # Build and tool configurations
└── README.md               # This file
```
