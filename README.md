# 🎯 T-Shirt Shop - Production Ready E-Commerce

A **professional, full-featured T-shirt e-commerce store** with real-time inventory tracking, Stripe payments, and database-backed order management.

## 🚀 **QUICK START**

### **Prerequisites**
- Node.js 22+ (required for database compatibility)
- npm or yarn
- Stripe account (free test account works)
- Neon Postgres account (free tier available)

### **1. Clone & Install**
```bash
git clone <your-repo-url>
cd yogi
npm install
```

### **2. Database Setup**

**Sign up for Neon (Free):**
1. Visit https://console.neon.tech/signup
2. Create a new project (e.g., "TshirtShop")
3. Select a region (e.g., Sydney for AU)
4. **Get Connection String:**
   - Go to **Dashboard** → Your Project
   - Click **Connection Details** (top right)
   - Select **Connection string**
   - Copy the **Pooled connection** string
   - Format: `postgresql://user:password@host-pooler.region.aws.neon.tech/database?sslmode=require`

**Create `.env.development` file:**
```bash
# Database (paste your Neon connection string from https://console.neon.tech)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Stripe Test Keys (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Settings
NODE_ENV=development
```

### **3. Initialize Database**
```bash
# Windows (PowerShell)
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run db:migrate

# macOS/Linux
npm run db:migrate
```

This creates:
- `inventory` table (product stock levels)
- `reservations` table (30-min cart reservations)
- `purchases` table (order history)

### **4. Start Development Server**
```bash
# Windows (PowerShell)
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run dev

# macOS/Linux
npm run dev
```

Server runs at: http://localhost:3000

### **5. Start Stripe Webhook Listener**

**Install Stripe CLI:**
- Windows: Download from https://github.com/stripe/stripe-cli/releases
- macOS: `brew install stripe/stripe-cli/stripe`
- Linux: `wget` from releases page

**Start listening:**
```bash
# Windows
& "$env:USERPROFILE\stripe-cli\stripe.exe" listen --forward-to localhost:3000/api/webhooks/stripe

# macOS/Linux
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Copy the webhook secret** (starts with `whsec_`) and add it to `.env.development`

### **6. Test the Store**

1. Visit http://localhost:3000/store
2. Add items to cart
3. Checkout with test card: `4242 4242 4242 4242`
4. Verify inventory updated in Neon console

---

## 📊 **WHAT'S INCLUDED**

### **Features**
- ✅ **Real-time Inventory Tracking** - Stock updates instantly after purchase
- ✅ **Stripe Integration** - Secure AUD payments with webhooks
- ✅ **Cart Reservations** - 30-minute stock holds during checkout
- ✅ **Low Stock Warnings** - Automatic alerts when items running low
- ✅ **Order History** - Full purchase tracking in database
- ✅ **Security Hardening** - Rate limiting, input validation, security headers
- ✅ **Conditional Shipping** - Free shipping over $200 AUD
- ✅ **Australia-Only** - Simplified logistics

### **Tech Stack**
- **Framework:** Next.js 15.5.4 with TypeScript
- **Database:** Neon Postgres (serverless)
- **Payments:** Stripe API v2025-10-29
- **Styling:** Tailwind CSS
- **Deployment:** Vercel-ready

---

## 💾 **DATABASE QUERIES**

### **View Current Inventory**
```sql
SELECT product_id, color, size, stock, updated_at
FROM inventory 
WHERE product_id = 7 
ORDER BY color, size;
```

### **View All Purchases**
```sql
SELECT 
  id, product_id, color, size, quantity,
  unit_price, total_price, customer_name, customer_email, created_at
FROM purchases 
ORDER BY created_at DESC;
```

### **Sales Summary**
```sql
SELECT 
  product_id, color, size,
  SUM(quantity) as total_sold,
  COUNT(*) as num_orders,
  SUM(total_price) as total_revenue
FROM purchases 
GROUP BY product_id, color, size
ORDER BY total_sold DESC;
```

### **Active Reservations**
```sql
SELECT session_id, product_id, color, size, quantity, expires_at
FROM reservations 
WHERE expires_at > EXTRACT(EPOCH FROM NOW()) * 1000
ORDER BY created_at DESC;
```

---

## 🛠️ **DEVELOPMENT COMMANDS**

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Database migration
npm run db:migrate

# Security scan
npm run security:scan

# Security fixes
npm run security:fix
```

---
---

## 🚀 **DEPLOYMENT TO VERCEL**

### **1. Prepare Environment Variables**

Create `.env.production` with **live** keys:
```bash
DATABASE_URL=your_neon_production_connection_string
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### **2. Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### **3. Configure Production Webhooks**

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy webhook secret to Vercel environment variables

---

## 💰 **COST BREAKDOWN**

**Monthly Costs: $0-5**
- **Vercel Hosting:** Free (Hobby tier)
- **Neon Database:** Free (up to 0.5GB)
- **Stripe Fees:** 2.9% + 30¢ per transaction only
- **Domain:** ~$15/year (optional)

**Scale to 100+ orders/month before any platform fees!**

---

## 📊 **ORDER MANAGEMENT**

### **Stripe Dashboard:**
- View all payments and customer details
- Handle refunds and customer service
- Export data for accounting
- Track revenue and analytics

### **Neon Database:**
- Real-time inventory levels
- Purchase history and analytics
- Customer order patterns
- Stock movement tracking

---

## 🎯 **PRODUCT MANAGEMENT**

### **Add/Update Products**
Edit `/src/lib/products.ts`:
```typescript
export const PRODUCTS = [
  {
    id: 7,
    name: 'Premium Cotton Tee',
    price: 79.99,
    colors: ['Black', 'Off-white'],
    sizes: ['M', 'L', 'XL'],
    image: '/path/to/image.jpg',
    // ...
  }
];
```

### **Update Inventory**
```sql
UPDATE inventory 
SET stock = 100 
WHERE product_id = 7 AND color = 'Black' AND size = 'M';
```

Or use the migration script to bulk import from JSON.

---

## 🔒 **SECURITY FEATURES**

- ✅ Rate limiting (30 requests/min per IP)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Input validation on all API routes
- ✅ SQL injection prevention (parameterized queries)
- ✅ Webhook signature verification
- ✅ HTTPS enforcement in production
- ✅ Environment variable protection

---

## 🐛 **TROUBLESHOOTING**

### **Windows SSL Certificate Error**
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
```
Then run your commands. See [`docs/WINDOWS_SETUP.md`](./docs/WINDOWS_SETUP.md)

### **Port 3000 Already in Use**
```bash
# Kill all node processes
taskkill /F /IM node.exe /T  # Windows
pkill -9 node                # macOS/Linux
```

### **Database Connection Failed**
- Check DATABASE_URL is correct
- Verify Neon project is active
- Confirm SSL mode is set in connection string

### **Webhooks Not Working**
1. Ensure Stripe CLI is running
2. Check STRIPE_WEBHOOK_SECRET in .env
3. Restart dev server after adding secret
4. Verify webhook events in Stripe CLI output

---

## 📚 **DOCUMENTATION**

Additional guides in [`/docs`](./docs/):

- [`WINDOWS_SETUP.md`](./docs/WINDOWS_SETUP.md) - Windows-specific setup instructions
- [`DATABASE_SETUP.md`](./docs/DATABASE_SETUP.md) - Complete database configuration
- [`DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md) - Production deployment steps
- [`SECURITY_POLICY.md`](./docs/SECURITY_POLICY.md) - Security best practices
- [`CURRENT_STATUS.md`](./docs/CURRENT_STATUS.md) - Project status and features

---

## 🎯 **PROJECT STRUCTURE**

```
yogi/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── checkout/      # Stripe checkout session
│   │   │   ├── webhooks/      # Stripe webhooks
│   │   │   └── inventory/     # Stock checking
│   │   ├── store/             # Store pages
│   │   └── checkout/          # Success page
│   ├── components/            # React components
│   ├── lib/                   # Business logic
│   │   ├── inventory-db.ts    # Inventory management
│   │   ├── db.ts             # Database connection
│   │   └── products.ts       # Product catalog
│   └── proxy.ts              # Rate limiting & security
├── scripts/
│   └── migrate-to-db.ts      # Database migration
├── docs/                      # Documentation
├── public/                    # Static assets
└── README.md                 # This file
```

---

## 🎊 **NEXT STEPS**

1. ✅ Set up development environment
2. ✅ Configure database and Stripe
3. ✅ Test checkout flow locally
4. 🔄 Customize products and branding
5. 🔄 Deploy to production
6. 🔄 Set up production webhooks
7. 🔄 Start marketing!

**From setup to first sale: Under 2 hours!**

---

## 📞 **SUPPORT**

- **Issues:** Check [`/docs`](./docs/) folder first
- **Database:** Neon documentation at https://neon.tech/docs
- **Payments:** Stripe documentation at https://stripe.com/docs
- **Deployment:** Vercel documentation at https://vercel.com/docs

---

## 📝 **LICENSE**

MIT License - Feel free to use for your business!

---

**Built with ❤️ using Next.js, Stripe, and Neon Postgres**
