// Simple product management without database complexity
// Edit this file to add/remove products and manage your inventory

import { BETA_MODE, BETA_ENABLED_PRODUCTS, BETA_FEATURES } from '@/config/beta';
import { Product } from '@/types/product';

// Re-export Product type for backwards compatibility
export type { Product };

// 🎯 YOUR PRODUCT CATALOG - Edit here to add/remove products
const PRODUCTS: Product[] = [
  // AFFORDABLE CATEGORY
  {
    id: 1,
    name: "Basic Cotton Tee",
    price: 19.99,
    description: "100% cotton, comfortable fit, everyday wear",
    category: "affordable",
    images: ["https://placehold.co/400x400?text=Basic+Cotton+Tee"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy", "Grey"],
    material: "100% Cotton"
  },
  {
    id: 2,
    name: "Essential V-Neck",
    price: 22.99,
    description: "Soft cotton blend, versatile styling",
    category: "affordable",
    images: ["https://placehold.co/400x400?text=Essential+V-Neck"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Blue"],
    material: "Cotton Blend"
  },
  {
    id: 3,
    name: "Classic Crew Neck",
    price: 24.99,
    description: "Timeless design, durable construction",
    category: "affordable",
    images: ["https://placehold.co/400x400?text=Classic+Crew+Neck"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Red", "Green"],
    material: "Heavyweight Cotton"
  },

  // WORKOUT CATEGORY  
  {
    id: 4,
    name: "Performance Tee",
    price: 29.99,
    description: "Moisture-wicking, breathable, perfect for workouts",
    category: "workout",
    images: ["https://placehold.co/400x400?text=Performance+Tee"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal", "Red"],
    material: "Performance Polyester"
  },
  {
    id: 5,
    name: "Athletic Singlet",
    price: 27.99,
    description: "Lightweight, quick-dry fabric for intense training",
    category: "workout",
    images: ["https://placehold.co/400x400?text=Athletic+Singlet"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue", "Orange"],
    material: "Mesh Polyester"
  },
  {
    id: 6,
    name: "Training Tank Top",
    price: 34.99,
    description: "Compression fit, sweat-resistant technology",
    category: "workout",
    images: ["https://placehold.co/400x400?text=Training+Tank+Top"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy", "Green"],
    material: "Compression Blend"
  },

  // PREMIUM CATEGORY
  {
    id: 7,
    name: "Premium Cotton Tee",
    price: 79.99,
    description: "100% cotton, responsibly sourced, finished locally. Regular premium fit, 240-260 GSM weight for exceptional comfort and durability.",
    category: "premium",
    images: ["https://placehold.co/400x400?text=Premium+Cotton+Tee"],
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Off-white"],
    material: "100% Cotton (240-260 GSM) • Responsibly Sourced • Locally Finished"
  },
  {
    id: 8,
    name: "Luxury Modal Tee",
    price: 79.99,
    description: "Ultra-soft modal fiber, sophisticated drape",
    category: "premium",
    images: ["https://placehold.co/400x400?text=Luxury+Modal+Tee"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Taupe", "Rose"],
    material: "Modal Blend"
  },
  {
    id: 9,
    name: "Merino Wool Blend",
    price: 99.99,
    description: "Temperature regulating, odor-resistant luxury",
    category: "premium",
    images: ["https://placehold.co/400x400?text=Merino+Wool+Blend"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Navy", "Camel", "Forest"],
    material: "Merino Wool Blend"
  }
];

// 📦 PRODUCT FUNCTIONS - Simple and reliable with beta support

// Beta-aware: Get products based on beta configuration
export function getAllProducts(): Product[] {
  if (BETA_MODE && !BETA_FEATURES.allowMultipleProducts) {
    return PRODUCTS.filter(product => BETA_ENABLED_PRODUCTS.includes(product.id));
  }
  return PRODUCTS;
}

export function getProductsByCategory(category: string): Product[] {
  const products = getAllProducts(); // Uses beta filtering
  return products.filter(product => product.category === category);
}

export function getProductById(id: number): Product | null {
  // Always allow getting product by ID (for direct links, cart, checkout)
  return PRODUCTS.find(product => product.id === id) || null;
}

export function getCategories(): string[] {
  const products = getAllProducts(); // Uses beta filtering
  return [...new Set(products.map(product => product.category))];
}

// Beta helper: Get the primary beta product
export function getBetaProduct(): Product | null {
  if (!BETA_MODE || BETA_ENABLED_PRODUCTS.length === 0) return null;
  return getProductById(BETA_ENABLED_PRODUCTS[0]);
}

// 🎯 TO ADD NEW PRODUCTS:
// 1. Add new product object to PRODUCTS array above
// 2. Save file
// 3. Restart dev server or deploy
// 4. New product appears on your store!

// 💡 INVENTORY MANAGEMENT:
// - Track stock manually in spreadsheet or notebook
// - Remove products from PRODUCTS array when out of stock
// - Add back when restocked