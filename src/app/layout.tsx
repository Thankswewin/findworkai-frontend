import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { DebugPanel } from '@/components/DebugPanel'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Better font loading performance
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'FindWorkAI - AI-Powered Business Discovery Platform',
  description: 'Discover real businesses, analyze opportunities, and generate leads with AI-powered insights',
  keywords: 'lead generation, business discovery, AI, sales automation, FindWorkAI',
  authors: [{ name: 'Pheelymon', url: 'https://www.instagram.com/pheelymon.oftan' }],
  creator: 'Pheelymon',
  publisher: 'FindWorkAI',
  robots: 'index, follow',
  openGraph: {
    title: 'FindWorkAI - AI-Powered Business Discovery Platform',
    description: 'Transform your lead generation with AI',
    url: 'https://findworkai.com',
    siteName: 'FindWorkAI',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindWorkAI',
    description: 'AI-Powered Business Discovery Platform',
    creator: '@pheelymon',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <PerformanceMonitor />
            {children}
            <DebugPanel />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
