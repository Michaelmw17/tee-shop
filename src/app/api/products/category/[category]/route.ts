import { NextResponse } from 'next/server';

// This would normally come from a database
const productsDB = {
  affordable: [
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
    }
  ],
  workout: [
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
      name: "Training Tank",
      price: 32.99,
      description: "Compression fit, sweat-resistant technology",
      category: "workout",
  image: "https://placehold.co/400x400?text=Training+Tank",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Grey", "Navy", "Green"]
    }
  ],
  premium: [
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
  ]
};

export async function GET(request: Request, { params }: { params: Promise<{ category: string }> }) {
  try {
    const awaitedParams = await params;
    const category = awaitedParams.category;

    // Input validation
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Sanitize and validate category name
    const sanitizedCategory = category.toLowerCase().trim();
    const validCategories = ['affordable', 'workout', 'premium'];
    
    if (!validCategories.includes(sanitizedCategory)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const products = productsDB[sanitizedCategory as keyof typeof productsDB];

    if (!products) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    const response = NextResponse.json({
      category: sanitizedCategory,
      products,
      total: products.length
    });
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
