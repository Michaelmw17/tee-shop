# 🎯 Single Source of Truth Architecture

## The Problem You Identified

Previously, product data was being defined in multiple places with inconsistent structures:
- `products.ts` had `image` (singular)
- Components expected `images` (plural)  
- Transformation logic in components could override actual data
- Type definitions duplicated across files

**Result:** Bugs like missing colors, inconsistent data, hard to maintain.

## The Solution: Single Source of Truth

### 1. **Centralized Type Definition**

**File: `src/types/product.ts`**

This is now the **ONLY** place where the Product interface is defined:

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];      // Always an array
  sizes: string[];       
  colors: string[];      
  material: string;
}
```

### 2. **All Files Import This Type**

Every file that uses Product now imports from the same source:

```typescript
import { Product } from '@/types/product';
```

**Files updated:**
- ✅ `src/lib/products.ts` - Product catalog
- ✅ `src/components/ProductCard.tsx` - Product display
- ✅ `src/app/store/product/[id]/page.tsx` - Product details
- ✅ `src/app/api/products/[id]/route.ts` - API (uses it via products.ts)

### 3. **Standardized Data Structure**

All products in `products.ts` now use **exact same structure**:

```typescript
const PRODUCTS: Product[] = [
  {
    id: 7,
    name: "Premium Cotton Tee",
    price: 49.99,
    description: "...",
    category: "premium",
    images: ["https://..."],  // ✅ Array, not singular
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Off-White"],
    material: "100% Cotton..."
  },
  // ... all other products follow same structure
];
```

### 4. **No More Transformations**

❌ **Before:** Components had fallback logic
```typescript
// DON'T DO THIS ANYMORE
colors: data.product.colors || ["Black"],  // Could hide real data!
images: [data.product.image] || data.product.images  // Confusing!
```

✅ **After:** Direct passthrough
```typescript
// Data flows directly from products.ts → API → Component
return data.product;  // That's it!
```

## How To Use It

### Adding/Editing Products

**Only edit ONE file: `src/lib/products.ts`**

```typescript
const PRODUCTS: Product[] = [
  {
    id: 10,  // New product
    name: "Your Product Name",
    price: 29.99,
    description: "Your description",
    category: "premium",
    images: [
      "https://example.com/main-image.jpg",
      "https://example.com/side-view.jpg",  // Multiple images supported
      "https://example.com/back-view.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Off-White", "Navy"],  // All will appear automatically
    material: "100% Cotton"
  }
];
```

**That's it!** Changes automatically flow to:
- Homepage carousel
- Category pages
- Product detail pages
- Cart
- Checkout
- API responses

### TypeScript Will Catch Mistakes

If you forget a required field or use wrong type, TypeScript will error:

```typescript
{
  id: 11,
  name: "Test",
  price: "free",  // ❌ ERROR: Type 'string' is not assignable to type 'number'
  // ❌ ERROR: Property 'images' is missing
}
```

## Benefits

### ✅ Single Update Point
Change product details in ONE place (`products.ts`), it updates everywhere

### ✅ Type Safety  
TypeScript ensures consistency across entire app

### ✅ No More Bugs
Can't have mismatched data - it's literally the same object flowing through

### ✅ Easier to Maintain
New developers know exactly where to look

### ✅ No Transformation Logic
Data doesn't get altered/lost as it flows through app

## File Structure

```
src/
├── types/
│   └── product.ts          ← 🎯 SINGLE SOURCE OF TRUTH (Type Definition)
├── lib/
│   └── products.ts         ← 🎯 SINGLE SOURCE OF TRUTH (Data)
├── components/
│   └── ProductCard.tsx     ← Imports Product type, uses directly
├── app/
│   ├── page.tsx            ← Imports Product type, uses directly
│   ├── store/
│   │   └── product/[id]/page.tsx  ← Imports Product type, uses directly
│   └── api/
│       └── products/[id]/route.ts  ← Uses getProductById, returns directly
```

## The Data Flow

```
products.ts (data) 
    ↓
API route (pass through)
    ↓  
Component fetches
    ↓
Display (no transformation)
```

**Every step uses the same Product type from `src/types/product.ts`**

## What This Means for Your Beta

Your beta product (ID 7) is defined **once** in `products.ts`:

```typescript
{
  id: 7,
  name: "Premium Cotton Tee",
  price: 49.99,
  description: "100% cotton, responsibly sourced, finished locally...",
  category: "premium",
  images: ["https://placehold.co/400x400?text=Premium+Cotton+Tee"],
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "Off-White"],  // ✅ Both colors work now!
  material: "100% Cotton (240-260 GSM) • Responsibly Sourced • Locally Finished"
}
```

This exact data appears on:
- Homepage
- /store page
- /store/product/7 page  
- Cart
- Checkout

**Change it once, changes everywhere. No bugs. No transformations. One truth.**

## Future: Adding More Products

When you exit beta and add more products:

1. Open `src/lib/products.ts`
2. Add new product object to array
3. Save
4. Done

TypeScript will ensure you include all required fields with correct types.
The product will automatically appear in all relevant places.
No component changes needed.

---

**Key Takeaway:** Update products in `src/lib/products.ts` only. Type is defined in `src/types/product.ts`. Everything else just uses these - no transformations, no duplication, one source of truth.
