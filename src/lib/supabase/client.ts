/**
 * Supabase Client Configuration
 * For client-side authentication and database operations
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Get Supabase configuration
// These are replaced at build time by Next.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
function validateEnvVars() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables missing:', {
      url: !!SUPABASE_URL,
      anonKey: !!SUPABASE_ANON_KEY
    })
    // Don't throw in production, just warn
    if (typeof window !== 'undefined') {
      console.warn(
        'Supabase configuration is incomplete. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
      )
    }
  }

  return { url: SUPABASE_URL || '', anonKey: SUPABASE_ANON_KEY || '' }
}

// Create a single supabase client for interacting with your database
export function createClient() {
  const { url, anonKey } = validateEnvVars()

  return createBrowserClient<Database>(
    url,
    anonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for enhanced security
      },
      global: {
        headers: {
          'x-application-name': 'FindWorkAI'
        }
      }
    }
  )
}

// Export a singleton instance for client components
let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!clientInstance && typeof window !== 'undefined') {
    clientInstance = createClient()
  }
  return clientInstance
}

// Convenience export
export const supabase = typeof window !== 'undefined' ? createClient() : null
