// Proxy file - handles rate limiting, security headers, and access control
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BETA_MODE } from '@/config/beta';

// Simple in-memory rate limiting (for basic protection)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
};

// API routes that need rate limiting.
// The Stripe webhook is deliberately excluded: its requests are authenticated by signature,
// and Stripe sends bursts from a small set of IPs that this limiter could block.
const RATE_LIMITED_PATHS = [
  '/api/checkout',
  '/api/inventory/check'
];

// Cap the map so a flood of distinct keys cannot exhaust memory
const MAX_TRACKED_KEYS = 5000;

function getRateLimitKey(request: NextRequest): string {
  // Vercel sets these headers itself, so a client cannot spoof them.
  // x-forwarded-for is only used as a last resort because clients can send it.
  const trusted = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-real-ip');
  if (trusted) return trusted.split(',')[0].trim();
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',').pop()!.trim() : 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (rateLimit.size > MAX_TRACKED_KEYS) pruneRateLimit();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    // Reset the rate limit window
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    });
    return false;
  }

  if (record.count >= RATE_LIMIT.max) {
    return true;
  }

  record.count++;
  return false;
}

// Drop expired entries when the map grows (no timer, so it is safe on serverless)
function pruneRateLimit() {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to specific API routes
  if (RATE_LIMITED_PATHS.some(path => pathname.startsWith(path))) {
    const key = getRateLimitKey(request);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Beta mode: Restrict access to specific pages only
  if (BETA_MODE) {
    const allowedPaths = [
      '/',
      '/store/cart',
      '/checkout/success',
      '/api',
      '/_next',
      '/favicon.ico',
      '/sitemap.xml'
    ];

    const isAllowed = allowedPaths.some(path => 
      pathname === path || pathname.startsWith(path)
    );

    if (!isAllowed) {
      // Redirect to custom not-found page
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  // There is no admin area. Block the path outright rather than trust a client-set cookie.
  if (pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
