import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/products';

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

    // Get products from simple product catalog
    const products = getProductsByCategory(sanitizedCategory);
    
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
    return NextResponse.json({ 
      error: 'Internal server error',
      category: '',
      products: [],
      total: 0
    }, { status: 500 });
  }
}
