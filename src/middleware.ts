/**
 * Middleware for route protection and security
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/ai-agent',
  '/api/businesses',
  '/api/campaigns',
  '/api/leads',
]

// Admin-only routes
const adminPaths = [
  '/dashboard/settings',
  '/api/admin',
]

// Public routes that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',
]

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check if route requires admin access
    if (adminPaths.some(adminPath => path.startsWith(adminPath))) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // CSRF token for state-changing operations
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfToken = req.headers.get('x-csrf-token')
      if (!csrfToken && !path.startsWith('/api/auth')) {
        return NextResponse.json(
          { error: 'CSRF token required' },
          { status: 403 }
        )
      }
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Allow public paths
        if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
          return true
        }

        // Check if user is authenticated for protected paths
        if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
          return !!token
        }

        // Default to requiring authentication
        return !!token
      },
    },
  }
)

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
