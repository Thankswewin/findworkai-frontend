import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FindWorkAI - Discover Business Opportunities with AI',
  description: 'AI-Powered Business Discovery Platform by Pheelymon. Transform your lead generation with intelligent automation.',
  keywords: 'FindWorkAI, business discovery, AI leads, Pheelymon',
}

// Server Component - runs on server, better performance
export default async function Home() {
  // For now, always redirect to login
  // The login page will handle checking if user is already authenticated
  redirect('/login')
  
  // This will never render due to redirects, but TypeScript needs it
  return null
}
