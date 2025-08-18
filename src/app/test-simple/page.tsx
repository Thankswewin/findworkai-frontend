'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SimpleTestPage() {
  const [result, setResult] = useState<string>('Click button to test')

  const testSupabase = async () => {
    try {
      setResult('Testing Supabase connection...')
      
      const supabase = createClient()
      console.log('Supabase client created:', supabase)
      
      const { data, error } = await supabase.auth.getSession()
      console.log('Session data:', data)
      console.log('Session error:', error)
      
      if (error) {
        setResult(`Error: ${error.message}`)
      } else if (data.session) {
        setResult(`Logged in as: ${data.session.user.email}`)
      } else {
        setResult('No active session - not logged in')
      }
    } catch (err: any) {
      console.error('Test error:', err)
      setResult(`Exception: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Supabase Test</h1>
      <button 
        onClick={testSupabase}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        Test Supabase Connection
      </button>
      <div style={{ 
        padding: '20px', 
        background: '#f0f0f0', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap'
      }}>
        {result}
      </div>
    </div>
  )
}
