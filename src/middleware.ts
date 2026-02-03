// Simple admin authentication middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BETA_MODE } from '@/config/beta';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};