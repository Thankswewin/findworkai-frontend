'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'

export default function TestSupabasePage() {
  const { 
    user, 
    session, 
    loading, 
    error, 
    signUp, 
    signIn, 
    signOut, 
    isAuthenticated 
  } = useSupabaseAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (isSignUp) {
        const result = await signUp(email, password, {
          full_name: email.split('@')[0] // Use email prefix as name
        })
        
        if (result.requiresEmailConfirmation) {
          setMessage('✅ Account created! Please check your email to confirm your account.')
        } else {
          setMessage('✅ Account created and logged in successfully!')
        }
      } else {
        await signIn(email, password)
        setMessage('✅ Logged in successfully!')
      }
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setMessage('✅ Logged out successfully!')
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Supabase Authentication Test
          </h1>

          {/* Connection Status */}
          <div className="mb-6 p-4 rounded-lg bg-gray-100">
            <h2 className="font-semibold mb-2">Connection Status:</h2>
            <div className="space-y-1 text-sm">
              <p>
                Supabase URL: 
                <span className="ml-2 font-mono text-xs">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                </span>
              </p>
              <p>
                Anon Key: 
                <span className="ml-2 font-mono text-xs">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                </span>
              </p>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mb-6 p-4 rounded-lg bg-blue-50">
            <h2 className="font-semibold mb-2">Current User:</h2>
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : isAuthenticated ? (
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Session:</strong> ✅ Active</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Not logged in</p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.startsWith('✅') 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {!isAuthenticated ? (
            <>
              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="test@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Min 6 characters"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          )}

          {/* Test Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Test Instructions:</h3>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              <li>Try creating a new account with any email</li>
              <li>Check if you receive a confirmation email</li>
              <li>Try logging in with the account</li>
              <li>Test the sign out functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
