/**
 * Environment configuration with runtime validation
 * This ensures all required environment variables are present and valid
 */

import { z } from 'zod'

const envSchema = z.object({
  // Public environment variables (exposed to client)
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string().min(1, 'Google Maps API key is required'),
  NEXT_PUBLIC_APP_NAME: z.string().default('FindWorkAI'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  
  // Server-only environment variables
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters').optional(),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
})

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  
  // Only throw in production, warn in development
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables')
  } else {
    console.warn('⚠️  Running with invalid environment variables. Some features may not work.')
  }
}

export const env = parsed.data ?? ({} as z.infer<typeof envSchema>)

// Type-safe environment variable access
export type Env = z.infer<typeof envSchema>

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isTest = env.NODE_ENV === 'test'

// API configuration helpers
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  googleMapsKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  openAiKey: env.OPENAI_API_KEY,
} as const
