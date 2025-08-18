/**
 * Middleware for route protection and security
 * For now, we'll use a simple approach without auth checking in middleware
 * Auth is handled by the Supabase client in components
 */

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // Add security headers
  // In development, allow frames for testing canvas mode
  const isDev = process.env.NODE_ENV === 'development'
  res.headers.set('X-Frame-Options', isDev ? 'SAMEORIGIN' : 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSRF token for state-changing operations
  // Skip CSRF check for API routes that need to work without it
  const skipCSRFPaths = [
    '/api/auth',
    '/api/places',
    '/api/places-osm',
    '/api/test-env',
    '/api/hubspot',
    '/api/ai-agent'
  ]
  
  const isPublicPath = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
  ].some(publicPath => path === publicPath || path.startsWith(publicPath + '/'))
  
  // Skip CSRF in development mode for easier testing
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (req.method !== 'GET' && req.method !== 'HEAD' && !isDevelopment) {
    const csrfToken = req.headers.get('x-csrf-token')
    const shouldSkipCSRF = skipCSRFPaths.some(path => req.nextUrl.pathname.startsWith(path))
    
    if (!csrfToken && !shouldSkipCSRF && !isPublicPath) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 }
      )
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
