import { NextRequest, NextResponse } from 'next/server';
import { getAvailableStock, getLowStockWarning, getAvailableColors, getAvailableSizes } from '@/lib/inventory-db';

// Force dynamic rendering - don't try to pre-render this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { productId, color, size, allColors, allSizes } = await request.json();

    console.log('🔍 Inventory Check Request:', { productId, color, size, allColors, allSizes });

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    // Security: Validate productId is a positive integer
    if (typeof productId !== 'number' || productId < 1 || !Number.isInteger(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    
    // Security: Validate string inputs to prevent injection
    if (color && (typeof color !== 'string' || color.length > 50)) {
      return NextResponse.json({ error: 'Invalid color' }, { status: 400 });
    }
    
    if (size && (typeof size !== 'string' || size.length > 10)) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 });
    }

    const response: {
      stock?: number;
      warning?: string | null;
      availableColors?: string[];
      availableSizes?: string[];
    } = {};

    // Get available stock for specific variant (total - reserved)
    if (color && size) {
      response.stock = await getAvailableStock(productId, color, size);
      response.warning = await getLowStockWarning(productId, color, size);
      console.log('📊 Stock Check Result:', { productId, color, size, stock: response.stock, warning: response.warning });
    }

    // Get available colors
    if (allColors) {
      response.availableColors = await getAvailableColors(productId, allColors);
    }

    // Get available sizes for a color
    if (color && allSizes) {
      response.availableSizes = await getAvailableSizes(productId, color, allSizes);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Inventory check error:', error);
    return NextResponse.json(
      { error: 'Failed to check inventory' },
      { status: 500 }
    );
  }
}
