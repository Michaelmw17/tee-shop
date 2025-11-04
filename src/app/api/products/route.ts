import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/lib/products';

export async function GET() {
  try {
    // Get all products from simple catalog
    const allProducts = getAllProducts();

    // Group products by category
    const categories = {
      affordable: getProductsByCategory('affordable'),
      workout: getProductsByCategory('workout'),
      premium: getProductsByCategory('premium')
    };

    return NextResponse.json({
      products: allProducts,
      total: allProducts.length,
      categories
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      products: [],
      total: 0,
      categories: {
        affordable: [],
        workout: [],
        premium: []
      }
    }, { status: 500 });
  }
}
