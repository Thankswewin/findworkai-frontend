/**
 * Performance monitoring hook
 * Tracks Web Vitals and performance metrics
 */

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Web Vitals types
export interface WebVitalsMetric {
  id: string
  name: 'FCP' | 'LCP' | 'CLS' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender'
}

// Performance thresholds
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },     // First Contentful Paint
  LCP: { good: 2500, poor: 4000 },     // Largest Contentful Paint
  CLS: { good: 0.1, poor: 0.25 },      // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },     // Time to First Byte
  INP: { good: 200, poor: 500 },       // Interaction to Next Paint
}

// Get rating based on value and thresholds
function getRating(
  name: WebVitalsMetric['name'],
  value: number
): WebVitalsMetric['rating'] {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Performance monitoring hook
export function usePerformance() {
  const pathname = usePathname()

  // Log Web Vitals
  const logWebVital = useCallback((metric: WebVitalsMetric) => {
    // Add rating
    const enhancedMetric = {
      ...metric,
      rating: getRating(metric.name, metric.value),
      path: pathname,
      timestamp: Date.now(),
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = enhancedMetric.rating === 'good' ? '✅' : 
                    enhancedMetric.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(
        `${emoji} [${metric.name}] ${metric.value.toFixed(2)}ms (${enhancedMetric.rating})`,
        enhancedMetric
      )
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics service
      // Example: Google Analytics, Vercel Analytics, etc.
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: enhancedMetric.rating,
          page_path: pathname,
        })
      }
    }
  }, [pathname])

  // Monitor Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Dynamically import web-vitals to reduce bundle size
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(logWebVital)
      onFCP(logWebVital)
      onLCP(logWebVital)
      onTTFB(logWebVital)
      onINP(logWebVital)
    })
  }, [logWebVital])

  // Track route changes
  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ Route ${pathname} rendered in ${duration.toFixed(2)}ms`)
      }
    }
  }, [pathname])

  // Performance observer for resource timing
  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          
          // Log slow resources
          if (resourceEntry.duration > 1000) {
            console.warn(
              `⚠️ Slow resource: ${resourceEntry.name} took ${resourceEntry.duration.toFixed(2)}ms`
            )
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [])

  // Memory monitoring (development only)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (typeof window === 'undefined' || !('memory' in performance)) return

    const interval = setInterval(() => {
      const memory = (performance as any).memory
      const usedMemoryMB = (memory.usedJSHeapSize / 1048576).toFixed(2)
      const totalMemoryMB = (memory.totalJSHeapSize / 1048576).toFixed(2)
      const limitMemoryMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2)

      // Warn if using more than 50MB
      if (memory.usedJSHeapSize > 50 * 1048576) {
        console.warn(
          `⚠️ High memory usage: ${usedMemoryMB}MB / ${limitMemoryMB}MB`
        )
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    pathname,
    logWebVital,
  }
}

// Custom performance marks
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name)
  }
}

// Measure between two marks
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]
      
      if (process.env.NODE_ENV === 'development' && measure) {
        console.log(`📊 ${name}: ${measure.duration.toFixed(2)}ms`)
      }
      
      return measure?.duration
    } catch (error) {
      console.error('Performance measurement error:', error)
    }
  }
  return null
}

// Helper to track component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const startMark = `${componentName}-start`
    const endMark = `${componentName}-end`
    
    markPerformance(startMark)
    
    return () => {
      markPerformance(endMark)
      measurePerformance(`${componentName}-render`, startMark, endMark)
    }
  }, [componentName])
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
