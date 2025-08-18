'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    // Also subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      setLoading(true)
      console.log('Checking Supabase session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Supabase getSession error:', error)
        setTestResult({ error: `Supabase error: ${error.message}` })
      } else {
        console.log('Current Supabase session:', session)
        setSession(session)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setTestResult({ error: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const testBackendAPI = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setTestResult({ error: 'No Supabase session found' })
        return
      }

      // Test direct API call with Supabase token
      const response = await fetch('http://localhost:8000/api/v1/followup/followups/pending?days_ahead=30', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        token: session.access_token.substring(0, 50) + '...'
      })
    } catch (error) {
      setTestResult({ error: error.message })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Session</CardTitle>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Provider:</strong> {session.user.app_metadata?.provider}</p>
              <p><strong>Token (first 50 chars):</strong> {session.access_token.substring(0, 50)}...</p>
              <p><strong>Expires at:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-600">No active session - Please log in</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Backend API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testBackendAPI} className="mb-4">
            Test Backend API
          </Button>
          
          {testResult && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkSession} variant="outline">
            Refresh Session
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/login'} 
            variant="outline"
          >
            Go to Login
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/dashboard/followups'} 
            variant="outline"
          >
            Go to Follow-ups Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
