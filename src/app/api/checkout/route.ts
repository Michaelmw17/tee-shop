import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateCartStock, reserveStock } from '@/lib/inventory-db';
import { logInvalidInput, logCheckoutFailure } from '@/lib/security';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout API called');
    
    // Check if Stripe is properly configured
    if (!stripe) {
      console.error('❌ Stripe not configured - check STRIPE_SECRET_KEY');
      
      // In development, provide helpful error message
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ 
          error: 'Stripe not configured',
          message: 'Please add your Stripe test keys to .env.local file. See SETUP_GUIDE.md for instructions.',
          setupUrl: 'https://dashboard.stripe.com/test/apikeys'
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    
    const { items } = await request.json();
    console.log('📦 Items received:', items);

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided');
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.qty) {
        console.error('❌ Invalid item structure:', item);
        return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
      }
      
      // Security: Validate numeric values
      if (typeof item.price !== 'number' || item.price <= 0 || item.price > 10000) {
        console.error('❌ Invalid price:', item.price);        logInvalidInput(`Invalid price: ${item.price} for product ${item.id}`);        return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
      }
      
      if (typeof item.qty !== 'number' || item.qty < 1 || item.qty > 999 || !Number.isInteger(item.qty)) {
        console.error('❌ Invalid quantity:', item.qty);        logInvalidInput(`Invalid quantity: ${item.qty} for product ${item.id}`);        return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
      }
      
      // Security: Validate product ID
      if (typeof item.id !== 'number' || item.id < 1 || !Number.isInteger(item.id)) {
        console.error('❌ Invalid product ID:', item.id);
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
      }
    }

    // ✅ VALIDATE STOCK AVAILABILITY (considering existing reservations)
    console.log('🔍 Checking inventory availability...');
    const stockCheck = await validateCartStock(items);
    
    if (!stockCheck.valid) {
      console.error('❌ Insufficient stock:', stockCheck.errors);
      return NextResponse.json({ 
        error: 'Insufficient stock',
        details: stockCheck.errors 
      }, { status: 400 });
    }
    
    console.log('✅ All items in stock');

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: {
      id: number;
      name: string;
      price: number;
      size: string;
      color: string;
      image: string;
      qty: number;
    }) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name,
          description: `Size: ${item.size}, Color: ${item.color}`,
          images: [item.image],
          metadata: {
            productId: item.id.toString(),
            size: item.size,
            color: item.color,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    console.log('💰 Creating Stripe session with line items:', lineItems);

    // Calculate cart total for shipping logic
    const cartTotal = items.reduce((sum: number, item: { price: number; qty: number }) => sum + (item.price * item.qty), 0);
    const freeShippingThreshold = 200;
    const isFreeShipping = cartTotal >= freeShippingThreshold;
    
    console.log(`📊 Cart total: $${cartTotal.toFixed(2)}, Free shipping: ${isFreeShipping}`);

    // Calculate expiration time (30 minutes from now - Stripe minimum)
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60);

    // Build shipping options based on cart total
    const shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: isFreeShipping ? 0 : 1000, // FREE if over $200, otherwise $10.00 AUD
            currency: 'aud',
          },
          display_name: isFreeShipping ? 'FREE Standard Shipping' : 'Standard Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as const,
              value: 5,
            },
            maximum: {
              unit: 'business_day' as const,
              value: 10,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: 2500, // $25.00 AUD express shipping (always paid)
            currency: 'aud',
          },
          display_name: 'Express Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as const,
              value: 1,
            },
            maximum: {
              unit: 'business_day' as const,
              value: 3,
            },
          },
        },
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/cart`,
      expires_at: expiresAt,
      shipping_address_collection: {
        allowed_countries: ['AU'], // Australia only
      },
      shipping_options: shippingOptions,
      // Store metadata for order tracking
      metadata: {
        order_source: 'yogi_tees_website',
        item_count: items.length.toString(),
      },
    });

    console.log('✅ Stripe session created:', session.id);
    
    // 🔒 RESERVE INVENTORY for this session (30 minutes)
    const reservation = await reserveStock(session.id, items);
    
    if (!reservation.success) {
      // This shouldn't happen since we just validated, but handle it
      console.error('❌ Failed to reserve stock:', reservation.errors);
      // Cancel the Stripe session
      await stripe.checkout.sessions.expire(session.id);
      return NextResponse.json({ 
        error: 'Failed to reserve stock',
        details: reservation.errors 
      }, { status: 400 });
    }
    
    console.log('🔒 Stock reserved for 5 minutes');
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
    
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    logCheckoutFailure(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Provide more detailed error information in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        ...(isDevelopment && { details: errorMessage })
      },
      { status: 500 }
    );
  }
}