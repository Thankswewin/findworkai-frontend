'use client'

import { usePerformance } from '@/hooks/use-performance'

export function PerformanceMonitor() {
  // Initialize performance monitoring
  usePerformance()
  
  // This component doesn't render anything, just monitors performance
  return null
}
