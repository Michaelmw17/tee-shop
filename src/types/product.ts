// 🎯 SINGLE SOURCE OF TRUTH FOR PRODUCT DATA STRUCTURE
// Define the Product interface once, use it everywhere

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];      // Array of image URLs
  sizes: string[];       // Available sizes
  colors: string[];      // Available colors
  material: string;      // Material description
}

// Inventory tracking for size/color combinations
export interface InventoryItem {
  [key: string]: number; // e.g., "Black-M": 12, "Off-white-L": 18
}

export interface Inventory {
  [productId: string]: InventoryItem;
}

// Helper type for cart items
export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  qty: number;
}
