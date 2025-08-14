/**
 * Simple in-memory rate limiting for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval?: number // Max number of unique tokens per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private interval: number
  private maxRequests: number

  constructor(options: RateLimitOptions) {
    this.interval = options.interval
    this.maxRequests = options.uniqueTokenPerInterval ?? 100
  }

  check(identifier: string, limit: number): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.interval

    // Get existing requests for this identifier
    const existingRequests = this.requests.get(identifier) ?? []
    
    // Filter out requests outside the current window
    const recentRequests = existingRequests.filter(timestamp => timestamp > windowStart)
    
    // Check if limit exceeded
    if (recentRequests.length >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(recentRequests[0] + this.interval)
      }
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      this.cleanup()
    }

    return {
      success: true,
      limit,
      remaining: limit - recentRequests.length,
      reset: new Date(now + this.interval)
    }
  }

  private cleanup() {
    const now = Date.now()
    const windowStart = now - this.interval

    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > windowStart)
      
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    }
  }

  reset(identifier?: string) {
    if (identifier) {
      this.requests.delete(identifier)
    } else {
      this.requests.clear()
    }
  }
}

// Create singleton instances for different rate limit configurations
const limiters = new Map<string, RateLimiter>()

export function rateLimit(options: RateLimitOptions) {
  const key = `${options.interval}-${options.uniqueTokenPerInterval}`
  
  if (!limiters.has(key)) {
    limiters.set(key, new RateLimiter(options))
  }
  
  return limiters.get(key)!
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Strict: 10 requests per minute
  strict: () => rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 10 }),
  
  // Standard: 60 requests per minute
  standard: () => rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 60 }),
  
  // Relaxed: 100 requests per minute
  relaxed: () => rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 100 }),
  
  // Burst: 30 requests per 10 seconds
  burst: () => rateLimit({ interval: 10 * 1000, uniqueTokenPerInterval: 30 }),
} as const
