import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

// Stripe Checkout Session ids look like cs_test_a1B2... or cs_live_a1B2...
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

// Show enough of the email to confirm it, without exposing it to anyone holding a session id
function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!local || !domain) return null;
  return `${local[0]}***@${domain}`;
}

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ error: 'Valid session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return only what the success page displays. No name, address or phone.
    return NextResponse.json({
      id: session.id,
      customer_details: { email: maskEmail(session.customer_details?.email) },
      amount_total: session.amount_total,
      payment_status: session.payment_status,
    });

  } catch (error: unknown) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
