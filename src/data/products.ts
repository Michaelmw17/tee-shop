import { ORDERED_COLOR_KEYS } from "./colors";

export type CategorySlug = "affordable" | "workout" | "premium";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  material: string;
  category: CategorySlug;
  image: string;
  sizes: string[];
  colors: string[];
}

export const SUPPORTED_COLORS: readonly string[] = ORDERED_COLOR_KEYS;
export const CATEGORY_SLUGS: readonly CategorySlug[] = ["affordable", "workout", "premium"];

/**
 * Central catalogue of mock products used by API routes.
 *
 * To add a new product:
 *  - Append a new object to PRODUCTS with a unique `id`.
 *  - Use one of the CATEGORY_SLUGS for `category`.
 *  - Restrict `colors` to values present in SUPPORTED_COLORS (see src/data/colors.ts).
 *  - Add any additional sizes to the `sizes` array; they will be picked up automatically.
 */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Basic Cotton Tee",
    price: 19.99,
    description: "100% cotton, comfortable fit, everyday wear",
    material: "100% Cotton",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Basic+Cotton+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Charcoal"]
  },
  {
    id: 2,
    name: "Essential V-Neck",
    price: 22.99,
    description: "Soft cotton blend, versatile styling",
    material: "Cotton Blend",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Essential+V-Neck",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Cream"]
  },
  {
    id: 3,
    name: "Classic Crew Neck",
    price: 24.99,
    description: "Timeless design, durable construction",
    material: "Heavyweight Cotton",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Classic+Crew+Neck",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Brown", "Olive"]
  },
  {
    id: 10,
    name: "EcoBlend Tee",
    price: 21.99,
    description: "Recycled fiber blend with buttery-soft feel",
    material: "Recycled Cotton Blend",
    category: "affordable",
    image: "https://placehold.co/400x400?text=EcoBlend+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Olive", "Bone", "Charcoal"]
  },
  {
    id: 11,
    name: "Pocket Crew Tee",
    price: 23.49,
    description: "Classic crew neck with utility pocket detail",
    material: "Cotton Jersey",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Pocket+Crew+Tee",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Charcoal", "Olive", "Brown"]
  },
  {
    id: 12,
    name: "Relaxed Weekend Tee",
    price: 18.99,
    description: "Relaxed drop-shoulder fit for casual days",
    material: "Cotton Modal Blend",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Relaxed+Weekend+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Cream", "Bone"]
  },
  {
    id: 19,
    name: "Urban Graphic Tee",
    price: 20.49,
    description: "Bold street-inspired graphic on breathable cotton",
    material: "Soft Cotton",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Urban+Graphic+Tee",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Brown"]
  },
  {
    id: 20,
    name: "Vintage Wash Tee",
    price: 22.49,
    description: "Garment-washed for a lived-in look and feel",
    material: "Washed Cotton",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Vintage+Wash+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Brown", "Olive", "Cream"]
  },
  {
    id: 21,
    name: "Stripe Crew Tee",
    price: 20.99,
    description: "Classic stripe pattern with soft-touch finish",
    material: "Breathable Cotton Knit",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Stripe+Crew+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Brown", "Olive"]
  },
  {
    id: 22,
    name: "Everyday Raglan Tee",
    price: 19.49,
    description: "Contrasting raglan sleeves for casual comfort",
    material: "Cotton Poly Blend",
    category: "affordable",
    image: "https://placehold.co/400x400?text=Everyday+Raglan+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Cream", "Brown", "Olive"]
  },
  {
    id: 4,
    name: "Performance Tee",
    price: 29.99,
    description: "Moisture-wicking, breathable, perfect for workouts",
    material: "Performance Polyester",
    category: "workout",
    image: "https://placehold.co/400x400?text=Performance+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Charcoal", "Brown"]
  },
  {
    id: 5,
    name: "Athletic Singlet",
    price: 27.99,
    description: "Lightweight, quick-dry fabric for intense training",
    material: "Mesh Polyester",
    category: "workout",
    image: "https://placehold.co/400x400?text=Athletic+Singlet",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Brown"]
  },
  {
    id: 6,
    name: "Training Tank",
    price: 32.99,
    description: "Compression fit, sweat-resistant technology",
    material: "Compression Blend",
    category: "workout",
    image: "https://placehold.co/400x400?text=Training+Tank",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Charcoal", "Olive"]
  },
  {
    id: 13,
    name: "Motion Long Sleeve",
    price: 34.99,
    description: "Mesh back ventilation for high-intensity sessions",
    material: "Ventilated Knit",
    category: "workout",
    image: "https://placehold.co/400x400?text=Motion+Long+Sleeve",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Olive", "Black"]
  },
  {
    id: 14,
    name: "PowerDry Tee",
    price: 31.49,
    description: "PowerDry fabric keeps you cool and dry longer",
    material: "PowerDry Fabric",
    category: "workout",
    image: "https://placehold.co/400x400?text=PowerDry+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Cream", "Black", "Brown"]
  },
  {
    id: 15,
    name: "FlexFit Seamless Tee",
    price: 33.99,
    description: "Seamless knit for unrestricted movement",
    material: "Seamless Nylon Blend",
    category: "workout",
    image: "https://placehold.co/400x400?text=FlexFit+Seamless+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "White", "Cream", "Black"]
  },
  {
    id: 7,
    name: "Cashmere Blend Tee",
    price: 89.99,
    description: "5% cashmere, 95% premium cotton - luxurious comfort",
    material: "Cashmere Cotton Blend",
    category: "premium",
    image: "https://placehold.co/400x400?text=Cashmere+Blend+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Charcoal", "Black", "Brown"]
  },
  {
    id: 8,
    name: "Luxury Modal Tee",
    price: 79.99,
    description: "Ultra-soft modal fiber, sophisticated drape",
    material: "Modal Blend",
    category: "premium",
    image: "https://placehold.co/400x400?text=Luxury+Modal+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Brown", "Cream"]
  },
  {
    id: 9,
    name: "Merino Wool Blend",
    price: 99.99,
    description: "Temperature regulating, odor-resistant luxury",
    material: "Merino Wool Blend",
    category: "premium",
    image: "https://placehold.co/400x400?text=Merino+Wool+Blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Black", "Brown", "Olive"]
  },
  {
    id: 16,
    name: "Silk Touch Tee",
    price: 109.99,
    description: "Silk-infused fabric with subtle sheen finish",
    material: "Silk Blend",
    category: "premium",
    image: "https://placehold.co/400x400?text=Silk+Touch+Tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Cream", "Charcoal"]
  },
  {
    id: 17,
    name: "Heritage Supima Tee",
    price: 84.99,
    description: "100% Supima cotton with micro-ribbed collar",
    material: "Supima Cotton",
    category: "premium",
    image: "https://placehold.co/400x400?text=Heritage+Supima+Tee",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Bone", "Black", "Brown", "Olive"]
  },
  {
    id: 18,
    name: "Luxe Pima Henley",
    price: 92.49,
    description: "Three-button henley crafted from luxe Pima cotton",
    material: "Pima Cotton",
    category: "premium",
    image: "https://placehold.co/400x400?text=Luxe+Pima+Henley",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Bone", "Charcoal", "Olive", "Brown"]
  }
];

export const PRODUCTS_BY_CATEGORY: Record<CategorySlug, Product[]> = {
  affordable: PRODUCTS.filter((product) => product.category === "affordable"),
  workout: PRODUCTS.filter((product) => product.category === "workout"),
  premium: PRODUCTS.filter((product) => product.category === "premium")
};

export function getProductsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS_BY_CATEGORY[category] ?? [];
}

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getAllProducts(): Product[] {
  return PRODUCTS.slice();
}

export function getSupportedSizes(): string[] {
  return Array.from(
    new Set(
      PRODUCTS.flatMap((product) => product.sizes)
    )
  ).sort((a, b) => a.localeCompare(b));
}
