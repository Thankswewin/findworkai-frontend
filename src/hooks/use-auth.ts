/**
 * Authentication hooks using Supabase
 * Provides secure session management
 */

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name?: string
  role?: 'user' | 'admin'
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            role: session.user.user_metadata?.role || 'user'
          })
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          role: session.user.user_metadata?.role || 'user'
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Invalid email or password')
        return { success: false, error: error.message }
      }

      if (data.user) {
        toast.success('Welcome back!')
        router.push('/dashboard')
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
      return { success: false, error: 'Login failed' }
    }
  }, [router, supabase])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    }
  }, [router, supabase])

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          role: session.user.user_metadata?.role || 'user'
        })
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }, [supabase])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession,
    session: user,
  }
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}

// Hook for admin-only routes
export function useRequireAdmin(redirectTo: string = '/dashboard') {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      toast.error('You do not have permission to access this page')
      router.push(redirectTo)
    }
  }, [isLoading, user, redirectTo, router])

  return { isAdmin: user?.role === 'admin', isLoading }
}
