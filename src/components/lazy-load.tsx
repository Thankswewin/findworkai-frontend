/**
 * Lazy loading wrapper for better performance
 * Dynamically imports components only when needed
 */

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

// Loading component shown while lazy component loads
export function LoadingComponent() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

// Custom loading component with message
export function LoadingWithMessage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// Type-safe lazy loading wrapper
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => <>{fallback || <LoadingComponent />}</>,
    ssr: false, // Disable SSR for client-only components
  })
}

// Lazy loaded dashboard components
export const LazyDashboardAnalytics = dynamic(
  () => import('@/components/analytics/DashboardAnalytics'),
  {
    loading: () => <LoadingWithMessage message="Loading analytics..." />,
    ssr: true,
  }
)

export const LazyAIAgent = dynamic(
  () => import('@/components/ai-agent/AIAgentPanel'),
  {
    loading: () => <LoadingWithMessage message="Initializing AI Agent..." />,
    ssr: false,
  }
)

export const LazyLeadScoring = dynamic(
  () => import('@/components/leads/LeadScoring'),
  {
    loading: () => <LoadingWithMessage message="Loading lead scoring..." />,
    ssr: true,
  }
)

export const LazyCampaignBuilder = dynamic(
  () => import('@/components/campaigns/CampaignBuilder'),
  {
    loading: () => <LoadingWithMessage message="Loading campaign builder..." />,
    ssr: false,
  }
)

// Lazy loaded chart components (Recharts is heavy)
export const LazyLineChart = dynamic(
  () => import('recharts').then(mod => mod.LineChart),
  {
    loading: () => <LoadingComponent />,
    ssr: false,
  }
)

export const LazyBarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  {
    loading: () => <LoadingComponent />,
    ssr: false,
  }
)

export const LazyPieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart),
  {
    loading: () => <LoadingComponent />,
    ssr: false,
  }
)

// Lazy loaded modals and dialogs
export const LazyExportModal = dynamic(
  () => import('@/components/export/ExportModal'),
  {
    loading: () => null, // No loading for modals
    ssr: false,
  }
)

export const LazySettingsModal = dynamic(
  () => import('@/components/settings/SettingsModal'),
  {
    loading: () => null,
    ssr: false,
  }
)
