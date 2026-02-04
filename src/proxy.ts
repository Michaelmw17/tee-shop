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

// API routes that need rate limiting
const RATE_LIMITED_PATHS = [
  '/api/checkout',
  '/api/inventory/check',
  '/api/webhooks/stripe'
];

function getRateLimitKey(request: NextRequest): string {
  // Use IP address or forwarded IP from Vercel
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
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

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}, RATE_LIMIT.windowMs);

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

  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    // Check for admin session cookie
    const adminAuth = request.cookies.get('admin-auth');
    
    if (!adminAuth || adminAuth.value !== 'authenticated') {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
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
