import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FindWorkAI - Discover Business Opportunities with AI',
  description: 'AI-Powered Business Discovery Platform by Pheelymon. Transform your lead generation with intelligent automation.',
  keywords: 'FindWorkAI, business discovery, AI leads, Pheelymon',
}

// Server Component - runs on server, better performance
export default async function Home() {
  // Check authentication on server side
  const session = await getServerSession(authOptions)
  
  // Redirect based on auth status (server-side redirect, instant)
  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
  
  // This will never render due to redirects, but TypeScript needs it
  return null
}
