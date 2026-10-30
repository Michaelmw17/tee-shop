import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateCartStock, reserveStock } from '@/lib/inventory-db';
import { logInvalidInput, logCheckoutFailure } from '@/lib/security';
import { getAllProducts } from '@/lib/products';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

const MAX_BODY_BYTES = 10 * 1024;
const MAX_CART_LINES = 20;
const MAX_QTY_PER_LINE = 10;

// A cart line after server-side validation. Name, price and image come from
// the catalog, never from the request.
interface TrustedLine {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  qty: number;
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Rebuild the cart from the catalog so a tampered request cannot change prices
function buildTrustedLines(items: unknown): TrustedLine[] | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_CART_LINES) {
    return null;
  }

  const catalog = getAllProducts();
  const lines: TrustedLine[] = [];
  const seen = new Set<string>();

  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) return null;
    const { id, size, color, qty } = raw as Record<string, unknown>;

    if (typeof id !== 'number' || !Number.isInteger(id) || id < 1) return null;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) return null;
    if (typeof size !== 'string' || typeof color !== 'string') return null;

    const product = catalog.find(p => p.id === id);
    if (!product || !product.sizes.includes(size) || !product.colors.includes(color)) return null;

    const key = `${id}|${color}|${size}`;
    if (seen.has(key)) return null;
    seen.add(key);

    lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      image: product.images[0],
      qty,
    });
  }

  return lines;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!stripe || !appUrl) {
      console.error('Checkout misconfigured: STRIPE_SECRET_KEY or NEXT_PUBLIC_APP_URL missing');
      return badRequest('Checkout is temporarily unavailable', 500);
    }

    // Security: cap the request size before parsing
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return badRequest('Request too large', 413);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest('Invalid request');
    }

    const lines = buildTrustedLines((body as { items?: unknown } | null)?.items);
    if (!lines) {
      logInvalidInput('Checkout rejected: invalid cart payload');
      return badRequest('Invalid items');
    }

    // Validate stock availability (considering existing reservations)
    const stockCheck = await validateCartStock(lines);

    if (!stockCheck.valid) {
      return NextResponse.json({
        error: 'Insufficient stock',
        details: stockCheck.errors
      }, { status: 400 });
    }

    const lineItems = lines.map(item => ({
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

    // Calculate cart total for shipping logic
    const cartTotal = lines.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const freeShippingThreshold = 200;
    const isFreeShipping = cartTotal >= freeShippingThreshold;

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
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/store/cart`,
      expires_at: expiresAt,
      shipping_address_collection: {
        allowed_countries: ['AU'], // Australia only
      },
      shipping_options: shippingOptions,
      // Store metadata for order tracking
      metadata: {
        order_source: 'yogi_tees_website',
        item_count: lines.length.toString(),
      },
    });

    // Reserve inventory for this session (30 minutes)
    const reservation = await reserveStock(session.id, lines);

    if (!reservation.success) {
      // Another buyer took the stock between the check and the reserve
      await stripe.checkout.sessions.expire(session.id);
      return NextResponse.json({
        error: 'Insufficient stock',
        details: reservation.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    logCheckoutFailure(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
