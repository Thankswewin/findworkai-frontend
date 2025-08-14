/**
 * NextAuth.js configuration for secure authentication
 * Uses JWT tokens with httpOnly cookies for maximum security
 */

import { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { env } from './env'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'user' | 'admin'
    }
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'user' | 'admin'
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    email: string
    name: string
    role: 'user' | 'admin'
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = credentialsSchema.parse(credentials)

          // Call your backend API to verify credentials
          const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            console.error('Authentication failed:', response.status)
            return null
          }

          const data = await response.json()

          // Return user object
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || data.user.email,
            role: data.user.role || 'user',
            accessToken: data.access_token,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken: user.accessToken,
          accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        id: token.userId,
        email: token.email,
        name: token.name,
        role: token.role,
      }
      session.accessToken = token.accessToken
      return session
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  // Security settings
  secret: env.NEXTAUTH_SECRET,
  
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
      },
    },
  },

  // Enable debug messages in development
  debug: env.NODE_ENV === 'development',
}

/**
 * Refresh the access token if it has expired
 */
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.refreshToken}`
      },
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const refreshedTokens = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
