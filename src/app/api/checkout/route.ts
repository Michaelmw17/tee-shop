import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
    }

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
            size: item.size,
            color: item.color,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    console.log('💰 Creating Stripe session with line items:', lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/cart`,
      shipping_address_collection: {
        allowed_countries: ['AU'], // Australia only
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1000, // $10.00 AUD shipping
              currency: 'aud',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 2500, // $25.00 AUD express shipping
              currency: 'aud',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      // Store metadata for order tracking
      metadata: {
        order_source: 'yogi_tees_website',
        item_count: items.length.toString(),
      },
    });

    console.log('✅ Stripe session created:', session.id);
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
    
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    
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