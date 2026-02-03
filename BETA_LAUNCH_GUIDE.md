# 🚀 Beta Launch Configuration Guide

Your store is now equipped with a flexible beta mode system. Here's everything you need to know.

## 🎯 Current Status

**BETA MODE: ENABLED** ✅

- Showing only 1 product (ID: 7 - Cashmere Blend Tee)
- Category navigation hidden
- Simplified homepage focused on beta launch
- Cart and checkout still fully functional

## 📁 Key Files

### `src/config/beta.ts`
**This is your control center.** All beta settings are here.

### Main Toggle
```typescript
export const BETA_MODE = true;  // ← Change to false to enable full catalog
```

### Product Selection
```typescript
export const BETA_ENABLED_PRODUCTS = [
  7  // ← Your beta product ID
];
```

## 🔄 How to Expand Your Store

### Option 1: Full Launch (Flip Everything On)
1. Open `src/config/beta.ts`
2. Change `BETA_MODE = true` to `BETA_MODE = false`
3. Save the file
4. **Done!** Full catalog is now live

### Option 2: Gradual Expansion (Add Products One by One)
1. Keep `BETA_MODE = true`
2. Add product IDs to the array:
   ```typescript
   export const BETA_ENABLED_PRODUCTS = [
     7,  // First product
     8,  // Second product
     9   // Third product
   ];
   ```
3. Products will appear as you add their IDs

### Option 3: Custom Configuration
1. Keep `BETA_MODE = true`
2. Modify individual feature flags in `BETA_FEATURES`:
   ```typescript
   export const BETA_FEATURES = {
     showCategoryNav: false,     // true to show navigation
     showAllProductsLink: false, // true to show "view all"
     // ... customize as needed
   };
   ```

## 🛠️ Customizing Your Beta Product

### Step 1: Find Your Product
Your beta product is currently set to ID 7 in `src/lib/products.ts`:
```typescript
{
  id: 7,
  name: "Cashmere Blend Tee",
  price: 89.99,
  // ...
}
```

### Step 2: Update Product Details
Edit the product object to match your actual T-shirt:
```typescript
{
  id: 7,
  name: "Premium Cotton Tee",           // ← Your product name
  price: 49.99,                         // ← Your price
  description: "100% cotton, 240-260 GSM, regular premium fit",
  category: "premium",
  image: "URL_TO_YOUR_IMAGE",           // ← Your product image
  sizes: ["S", "M", "L", "XL"],         // ← Your sizes
  colors: ["Black", "Off-White"],       // ← Your colors
  material: "100% Cotton 240-260 GSM"   // ← Your material
}
```

### Step 3: Update Beta Messages (Optional)
In `src/config/beta.ts`, customize the messaging:
```typescript
export const BETA_MESSAGES = {
  storeTitle: "Premium Cotton Tee - Beta Launch",
  storeSubtitle: "Limited first run • 100% cotton • 240-260 GSM",
  comingSoon: "More styles coming soon. Join us for the first drop!",
  soldOut: "This beta run is sold out. Join our list for the next drop.",
};
```

## 📊 What Beta Mode Changes

### Homepage
- ✅ Simplified hero section focused on beta product
- ✅ Product showcase with details
- ✅ "Why Beta?" section explaining your approach
- ✅ Direct call-to-action buttons

### Store Page (`/store`)
- ✅ Redirects to beta product page
- ✅ Or shows single product card (configurable)
- ✅ Hides category grid

### Navigation
- ✅ Removes category links (Affordable/Workout/Premium)
- ✅ Shows simple "Shop" link
- ✅ Cart icon remains visible

### Product Catalog
- ✅ Only beta product(s) appear in listings
- ✅ All 9 products remain in database (just hidden)
- ✅ Direct product URLs still work (for testing)

## 🧪 Testing Before Launch

### Test Your Beta Product
1. Visit homepage: `http://localhost:3000`
2. Click "Shop Now"
3. Should see your single product
4. Test add to cart
5. Test checkout flow

### Test Full Catalog (Without Publishing)
1. Temporarily set `BETA_MODE = false`
2. Refresh your browser
3. Verify all products appear
4. Set back to `BETA_MODE = true`

## 📸 Adding Your Product Images

Replace the placeholder image URL in `src/lib/products.ts`:

```typescript
// Before
image: "https://placehold.co/400x400?text=Cashmere+Blend+Tee",

// After
image: "/images/products/premium-tee-black.jpg",
// or external URL:
image: "https://your-cdn.com/products/tee-1.jpg",
```

**Image Requirements:**
- Square aspect ratio (1:1) recommended
- Minimum 800x800px for quality
- JPG or PNG format
- Place in `public/images/products/` folder

## 🎨 Customizing Beta Messages

All user-facing text is in `src/config/beta.ts`:

```typescript
export const BETA_MESSAGES = {
  storeTitle: "Your Product Name - Beta Launch",
  storeSubtitle: "Your tagline here",
  comingSoon: "Custom message about future products",
  soldOut: "Custom sold out message",
};
```

## 🚨 Common Issues

### "I changed BETA_MODE but nothing happened"
- Make sure you saved the file
- Refresh your browser (hard refresh: Ctrl+Shift+R)
- Check the dev server is running

### "Product isn't showing"
- Verify the product ID exists in `src/lib/products.ts`
- Check `BETA_ENABLED_PRODUCTS` array has correct ID
- Ensure `BETA_MODE = true`

### "I see all products in beta mode"
- Check `BETA_MODE = true` (not false)
- Verify you're editing `src/config/beta.ts` (not another file)
- Restart dev server if needed

## 📈 Launch Checklist

Before going live with beta:

- [ ] Updated product #7 with your actual T-shirt details
- [ ] Added real product images
- [ ] Set correct pricing
- [ ] Configured available sizes and colors
- [ ] Updated BETA_MESSAGES with your brand voice
- [ ] Tested full checkout flow
- [ ] Verified cart functionality
- [ ] Set up Stripe with real keys (not test mode)
- [ ] Confirmed `BETA_MODE = true`

## 🎯 Your Beta Scope (Locked In)

As per your requirements:
- **Product:** 1 men's T-shirt, regular premium fit, 100% cotton, 240-260 GSM
- **Colors:** 2 (Black + Off-White)
- **Units:** 80 total
- **Brand:** Minimal wordmark only
- **Budget:** $6k-$7k target, $8k max
- **Marketing:** Network-first, no paid ads

This beta system is designed to support exactly this scope, with easy expansion when you're ready.

## 🔮 Next Steps After Beta

When your first 80 units sell:

1. **Analyze & Learn**
   - What sold fastest? (color/size)
   - Customer feedback themes?
   - Production/fulfillment issues?

2. **Decide Next Product**
   - Add to products.ts
   - Update BETA_ENABLED_PRODUCTS array
   - Or flip to full catalog

3. **Scale Gradually**
   - One learning cycle at a time
   - Don't rush to fill all 9 product slots
   - Let demand guide expansion

---

**Questions?** All configuration is in `src/config/beta.ts` - that's your command center.

**Ready to launch?** Just update product #7 with your details and you're good to go! 🚀
