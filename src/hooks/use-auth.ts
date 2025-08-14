/**
 * Authentication hooks using NextAuth
 * Provides secure session management without localStorage
 */

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user ?? null

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
        return { success: false, error: result.error }
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
      return { success: false, error: 'Login failed' }
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    }
  }, [router])

  const refreshSession = useCallback(async () => {
    try {
      await update()
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }, [update])

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshSession,
    session,
  }
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo)
  }

  return { isAuthenticated, isLoading }
}

// Hook for admin-only routes
export function useRequireAdmin(redirectTo: string = '/dashboard') {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not admin
  if (!isLoading && user?.role !== 'admin') {
    toast.error('You do not have permission to access this page')
    router.push(redirectTo)
  }

  return { isAdmin: user?.role === 'admin', isLoading }
}
