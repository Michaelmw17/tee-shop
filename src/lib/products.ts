// Simple product management without database complexity
// Edit this file to add/remove products and manage your inventory

export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  sizes: string[]
  colors: string[]
}

// 🎯 YOUR PRODUCT CATALOG - Edit here to add/remove products
const PRODUCTS: Product[] = [
  // AFFORDABLE CATEGORY
  {
    id: 1,
    name: "Basic Cotton Tee",
    price: 19.99,
    description: "100% cotton, comfortable fit, everyday wear",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Basic+Cotton+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy", "Grey"]
  },
  {
    id: 2,
    name: "Essential V-Neck",
    price: 22.99,
    description: "Soft cotton blend, versatile styling",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Essential+V-Neck",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Blue"]
  },
  {
    id: 3,
    name: "Classic Crew Neck",
    price: 24.99,
    description: "Timeless design, durable construction",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Classic+Crew+Neck",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Red", "Green"]
  },

  // WORKOUT CATEGORY  
  {
    id: 4,
    name: "Performance Tee",
    price: 29.99,
    description: "Moisture-wicking, breathable, perfect for workouts",
    category: "workout",
    image: "https://placehold.co/400x400?text=Performance+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal", "Red"]
  },
  {
    id: 5,
    name: "Athletic Singlet",
    price: 27.99,
    description: "Lightweight, quick-dry fabric for intense training",
    category: "workout",
    image: "https://placehold.co/400x400?text=Athletic+Singlet",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue", "Orange"]
  },
  {
    id: 6,
    name: "Training Tank Top",
    price: 34.99,
    description: "Compression fit, sweat-resistant technology",
    category: "workout",
    image: "https://placehold.co/400x400?text=Training+Tank+Top",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy", "Green"]
  },

  // PREMIUM CATEGORY
  {
    id: 7,
    name: "Cashmere Blend Tee",
    price: 89.99,
    description: "5% cashmere, 95% premium cotton - luxurious comfort",
    category: "premium",
    image: "https://placehold.co/400x400?text=Cashmere+Blend+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Charcoal", "Navy", "Burgundy"]
  },
  {
    id: 8,
    name: "Luxury Modal Tee",
    price: 79.99,
    description: "Ultra-soft modal fiber, sophisticated drape",
    category: "premium",
    image: "https://placehold.co/400x400?text=Luxury+Modal+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Taupe", "Rose"]
  },
  {
    id: 9,
    name: "Merino Wool Blend",
    price: 99.99,
    description: "Temperature regulating, odor-resistant luxury",
    category: "premium",
    image: "https://placehold.co/400x400?text=Merino+Wool+Blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Navy", "Camel", "Forest"]
  }
];

// 📦 PRODUCT FUNCTIONS - Simple and reliable
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(product => product.category === category);
}

export function getProductById(id: number): Product | null {
  return PRODUCTS.find(product => product.id === id) || null;
}

export function getCategories(): string[] {
  return [...new Set(PRODUCTS.map(product => product.category))];
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