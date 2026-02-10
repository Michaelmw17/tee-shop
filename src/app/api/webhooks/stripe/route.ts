import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateInventory, releaseReservation } from '@/lib/inventory-db';
import { logWebhookFailure } from '@/lib/security';
import { sql } from '@/lib/db';

// Force dynamic rendering - don't try to pre-render this API route
export const dynamic = 'force-dynamic';

// Lazy initialization to prevent build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-10-29.clover',
    });
  }
  return stripeInstance;
}

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  return secret;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    
    try {
      const stripe = getStripe();
      const webhookSecret = getWebhookSecret();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);      logWebhookFailure(`Signature verification failed: ${err instanceof Error ? err.message : 'Unknown'}`);      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('🎣 Webhook received:', event.type);

    // Handle checkout session expiration
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('⏰ Session expired:', session.id);
      
      // Release the reserved inventory
      await releaseReservation(session.id);
      
      return NextResponse.json({ received: true });
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('✅ Payment completed:', session.id);
      
      // Release the reservation (we'll deduct from actual inventory instead)
      await releaseReservation(session.id);
      
      // Retrieve line items from the session
      const stripe = getStripe();
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      console.log('📦 Processing line items:', lineItems.data.length);

      // Update inventory and log purchases for each item
      for (const item of lineItems.data) {
        const product = item.price?.product as Stripe.Product;
        const metadata = product.metadata;
        
        if (metadata && metadata.productId && metadata.size && metadata.color) {
          const productId = parseInt(metadata.productId);
          const size = metadata.size;
          const color = metadata.color;
          const quantity = item.quantity || 1;
          const unitPrice = (item.price?.unit_amount || 0) / 100; // Convert cents to dollars
          const totalPrice = unitPrice * quantity;

          console.log(`📉 Reducing inventory: Product ${productId}, ${color}-${size}, Qty: ${quantity}`);

          const success = await updateInventory(productId, color, size, quantity);
          
          if (!success) {
            console.error(`❌ Failed to update inventory for product ${productId}`);
            // Log the error but don't fail the webhook
            // The payment was successful, we'll handle inventory issues manually
          }

          // Log the purchase to database
          try {
            await sql`
              INSERT INTO purchases (
                session_id, product_id, color, size, quantity, 
                unit_price, total_price, customer_email, customer_name, stripe_payment_id
              ) VALUES (
                ${session.id}, 
                ${productId}, 
                ${color}, 
                ${size}, 
                ${quantity},
                ${unitPrice},
                ${totalPrice},
                ${session.customer_details?.email || null},
                ${session.customer_details?.name || null},
                ${session.payment_intent as string || null}
              )
              ON CONFLICT (session_id) DO NOTHING
            `;
            console.log(`💾 Purchase logged: Product ${productId}, ${color}-${size}, Qty: ${quantity}, Price: $${totalPrice}`);
          } catch (err) {
            console.error('❌ Failed to log purchase:', err);
            // Don't fail the webhook - inventory was already updated
          }
        } else {
          console.warn('⚠️ Line item missing metadata:', item.id);
        }
      }

      console.log('✅ Inventory updated successfully');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
