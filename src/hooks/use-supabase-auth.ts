/**
 * Supabase Authentication Hook
 * Provides authentication methods using Supabase
 */

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })
  
  const router = useRouter()
  const supabase = getSupabaseClient()

  // Check current session on mount
  useEffect(() => {
    if (!supabase) return

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error checking session:', error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to check session'
        }))
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          error: null
        })

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in')
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            router.push('/login')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // Additional user metadata
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          user: data.user,
          message: 'Please check your email to confirm your account'
        }
      }

      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        error: null
      })

      return {
        success: true,
        requiresEmailConfirmation: false,
        user: data.user,
        session: data.session
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      setAuthState(prev => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [supabase])

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        error: null
      })

      return {
        success: true,
        user: data.user,
        session: data.session
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      setAuthState(prev => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [supabase])

  // Sign out
  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null
      })

      router.push('/login')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed'
      setAuthState(prev => ({ ...prev, error: message }))
      throw error
    }
  }, [supabase, router])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      }
    } catch (error) {
      throw error
    }
  }, [supabase])

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return {
        success: true,
        message: 'Password updated successfully'
      }
    } catch (error) {
      throw error
    }
  }, [supabase])

  // Sign in with OAuth provider
  const signInWithProvider = useCallback(async (provider: 'google' | 'github' | 'facebook') => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error) {
      throw error
    }
  }, [supabase])

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    isAuthenticated: !!authState.session
  }
}
