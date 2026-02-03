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
