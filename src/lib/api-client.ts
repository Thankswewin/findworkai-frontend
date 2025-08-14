/**
 * Optimized API client with caching, deduplication, and performance improvements
 */

import { withRetry, createApiError, handleError } from '@/lib/error-handler'
import { env } from '@/lib/env'

// Request cache for deduplication
const requestCache = new Map<string, Promise<any>>()

// Response cache with TTL
interface CachedResponse<T> {
  data: T
  timestamp: number
  ttl: number
}

const responseCache = new Map<string, CachedResponse<any>>()

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  STATIC_TTL: 60 * 60 * 1000, // 1 hour for static data
  SHORT_TTL: 30 * 1000, // 30 seconds for dynamic data
}

// Request options
export interface RequestOptions extends RequestInit {
  cache?: 'no-cache' | 'force-cache' | 'reload'
  ttl?: number
  retry?: boolean
  dedupe?: boolean
}

/**
 * Generate cache key from URL and options
 */
function getCacheKey(url: string, options?: RequestOptions): string {
  const params = {
    url,
    method: options?.method || 'GET',
    body: options?.body,
  }
  return JSON.stringify(params)
}

/**
 * Check if cached response is still valid
 */
function isCacheValid<T>(cached: CachedResponse<T>): boolean {
  return Date.now() - cached.timestamp < cached.ttl
}

/**
 * Clear expired cache entries
 */
function cleanupCache(): void {
  const now = Date.now()
  
  responseCache.forEach((value, key) => {
    if (now - value.timestamp > value.ttl) {
      responseCache.delete(key)
    }
  })
  
  // Clear request cache (for dedupe)
  requestCache.clear()
}

// Run cleanup every minute
setInterval(cleanupCache, 60 * 1000)

/**
 * Optimized fetch with caching and deduplication
 */
export async function optimizedFetch<T = any>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const cacheKey = getCacheKey(url, options)
  
  // Check response cache
  if (options?.cache !== 'no-cache' && options?.cache !== 'reload') {
    const cached = responseCache.get(cacheKey)
    if (cached && isCacheValid(cached)) {
      console.log(`📦 Cache hit: ${url}`)
      return cached.data
    }
  }
  
  // Check for in-flight requests (deduplication)
  if (options?.dedupe !== false && requestCache.has(cacheKey)) {
    console.log(`🔄 Deduping request: ${url}`)
    return requestCache.get(cacheKey)
  }
  
  // Create new request
  const requestPromise = executeRequest<T>(url, options)
    .then(data => {
      // Cache successful response
      if (options?.cache !== 'no-cache') {
        const ttl = options?.ttl || CACHE_CONFIG.DEFAULT_TTL
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl,
        })
      }
      
      // Clear from request cache
      requestCache.delete(cacheKey)
      return data
    })
    .catch(error => {
      // Clear from request cache on error
      requestCache.delete(cacheKey)
      throw error
    })
  
  // Store in request cache for deduplication
  if (options?.dedupe !== false) {
    requestCache.set(cacheKey, requestPromise)
  }
  
  return requestPromise
}

/**
 * Execute the actual fetch request
 */
async function executeRequest<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${env.NEXT_PUBLIC_API_URL}${url}`
  
  // Setup abort controller for timeout
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout
  
  try {
    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }
    
    // Add auth token if available
    if (typeof window !== 'undefined') {
      // Get token from NextAuth session or other auth mechanism
      const session = await getSession()
      if (session?.accessToken) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${session.accessToken}`,
        }
      }
    }
    
    // Execute request with retry logic
    const executeWithRetry = async () => {
      const response = await fetch(fullUrl, fetchOptions)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw createApiError(response, errorData)
      }
      
      return response.json()
    }
    
    // Use retry wrapper if enabled
    if (options?.retry !== false) {
      return await withRetry(executeWithRetry, {
        maxAttempts: 3,
        shouldRetry: (error) => {
          // Retry on network errors and 5xx errors
          if (error instanceof Error) {
            const statusCode = (error as any).statusCode
            return !statusCode || statusCode >= 500
          }
          return false
        },
      })
    }
    
    return await executeWithRetry()
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * API client with optimized methods
 */
export const apiClient = {
  /**
   * GET request with caching
   */
  get: <T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    optimizedFetch<T>(url, { ...options, method: 'GET' }),
  
  /**
   * POST request (no caching by default)
   */
  post: <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>) =>
    optimizedFetch<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-cache',
    }),
  
  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>) =>
    optimizedFetch<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      cache: 'no-cache',
    }),
  
  /**
   * DELETE request
   */
  delete: <T = any>(url: string, options?: Omit<RequestOptions, 'method'>) =>
    optimizedFetch<T>(url, {
      ...options,
      method: 'DELETE',
      cache: 'no-cache',
    }),
  
  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'method'>) =>
    optimizedFetch<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      cache: 'no-cache',
    }),
  
  /**
   * Clear all caches
   */
  clearCache: () => {
    responseCache.clear()
    requestCache.clear()
    console.log('🧹 API cache cleared')
  },
  
  /**
   * Prefetch and cache data
   */
  prefetch: async (urls: string[], ttl?: number) => {
    console.log(`🔮 Prefetching ${urls.length} URLs`)
    
    await Promise.all(
      urls.map(url =>
        apiClient.get(url, { ttl: ttl || CACHE_CONFIG.STATIC_TTL })
          .catch(error => {
            console.error(`Failed to prefetch ${url}:`, error)
            return null
          })
      )
    )
  },
}

// Import getSession from NextAuth
async function getSession() {
  if (typeof window === 'undefined') {
    // Server-side
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    return getServerSession(authOptions)
  } else {
    // Client-side
    const { getSession } = await import('next-auth/react')
    return getSession()
  }
}

// Export specific API methods for common use cases
export const api = {
  // Business endpoints
  businesses: {
    list: (params?: any) => apiClient.get('/businesses', { ttl: CACHE_CONFIG.SHORT_TTL }),
    get: (id: string) => apiClient.get(`/businesses/${id}`, { ttl: CACHE_CONFIG.DEFAULT_TTL }),
    create: (data: any) => apiClient.post('/businesses', data),
    update: (id: string, data: any) => apiClient.put(`/businesses/${id}`, data),
    delete: (id: string) => apiClient.delete(`/businesses/${id}`),
    search: (query: string) => apiClient.post('/businesses/search', { query }),
  },
  
  // Campaign endpoints
  campaigns: {
    list: () => apiClient.get('/campaigns', { ttl: CACHE_CONFIG.SHORT_TTL }),
    get: (id: string) => apiClient.get(`/campaigns/${id}`),
    create: (data: any) => apiClient.post('/campaigns', data),
    update: (id: string, data: any) => apiClient.put(`/campaigns/${id}`, data),
    delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
  },
  
  // Lead endpoints
  leads: {
    score: (criteria: any) => apiClient.post('/leads/score', criteria),
    getHot: () => apiClient.get('/leads/hot', { ttl: CACHE_CONFIG.SHORT_TTL }),
    export: (format: string) => apiClient.get(`/leads/export?format=${format}`),
  },
  
  // Analytics endpoints
  analytics: {
    dashboard: () => apiClient.get('/analytics/dashboard', { ttl: CACHE_CONFIG.SHORT_TTL }),
    metrics: (period: string) => apiClient.get(`/analytics/metrics?period=${period}`),
    reports: () => apiClient.get('/analytics/reports', { ttl: CACHE_CONFIG.DEFAULT_TTL }),
  },
}
