import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/products';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;
    
    // Input validation
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    
    const productId = parseInt(id, 10);
    
    // Validate parsed number
    if (isNaN(productId) || productId < 1) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }
    
    // Get product from simple catalog
    const product = getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const response = NextResponse.json({ product });
    
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
