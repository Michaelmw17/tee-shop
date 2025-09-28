import { NextResponse } from 'next/server';

// Mock data for affordable tees
const affordableTees = [
  {
    id: 1,
    name: "Basic Cotton Tee",
    price: 19.99,
    description: "100% cotton, comfortable fit, everyday wear",
    category: "affordable",
    image: "/api/placeholder/tee-1"
  },
  {
    id: 2,
    name: "Essential V-Neck",
    price: 22.99,
    description: "Soft cotton blend, versatile styling",
    category: "affordable",
    image: "/api/placeholder/tee-2"
  },
  {
    id: 3,
    name: "Classic Crew Neck",
    price: 24.99,
    description: "Timeless design, durable construction",
    category: "affordable",
    image: "/api/placeholder/tee-3"
  }
];

const workoutGear = [
  {
    id: 4,
    name: "Performance Tee",
    price: 29.99,
    description: "Moisture-wicking, breathable, perfect for workouts",
    category: "workout",
    image: "/api/placeholder/workout-1"
  },
  {
    id: 5,
    name: "Athletic Singlet",
    price: 27.99,
    description: "Lightweight, quick-dry fabric for intense training",
    category: "workout",
    image: "/api/placeholder/workout-2"
  },
  {
    id: 6,
    name: "Training Tank",
    price: 32.99,
    description: "Compression fit, sweat-resistant technology",
    category: "workout",
    image: "/api/placeholder/workout-3"
  }
];

const premiumCollection = [
  {
    id: 7,
    name: "Cashmere Blend Tee",
    price: 89.99,
    description: "5% cashmere, 95% premium cotton - luxurious comfort",
    category: "premium",
    image: "/api/placeholder/premium-1"
  },
  {
    id: 8,
    name: "Luxury Modal Tee",
    price: 79.99,
    description: "Ultra-soft modal fiber, sophisticated drape",
    category: "premium",
    image: "/api/placeholder/premium-2"
  },
  {
    id: 9,
    name: "Merino Wool Blend",
    price: 99.99,
    description: "Temperature regulating, odor-resistant luxury",
    category: "premium",
    image: "/api/placeholder/premium-3"
  }
];

export async function GET() {
  const allProducts = [...affordableTees, ...workoutGear, ...premiumCollection];
  
  return NextResponse.json({
    products: allProducts,
    total: allProducts.length,
    categories: {
      affordable: affordableTees,
      workout: workoutGear,
      premium: premiumCollection
    }
  });
}
