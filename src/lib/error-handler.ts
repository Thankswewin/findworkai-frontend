/**
 * Global error handling utilities
 * Provides consistent error handling, logging, and retry logic
 */

import { ApiError } from '@/types'
import toast from 'react-hot-toast'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface ErrorDetails {
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  statusCode?: number
  timestamp: Date
  context?: Record<string, unknown>
  stack?: string
  retry?: {
    attempts: number
    maxAttempts: number
    delay: number
  }
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly category: ErrorCategory
  public readonly severity: ErrorSeverity
  public readonly statusCode?: number
  public readonly context?: Record<string, unknown>
  public readonly timestamp: Date

  constructor(
    message: string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.category = category
    this.severity = severity
    this.statusCode = statusCode
    this.context = context
    this.timestamp = new Date()
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  toJSON(): ErrorDetails {
    return {
      message: this.message,
      category: this.category,
      severity: this.severity,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Categorize error based on type and message
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (error instanceof AppError) {
    return error.category
  }

  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  if (message.includes('network') || message.includes('fetch')) {
    return ErrorCategory.NETWORK
  }
  if (message.includes('unauthorized') || message.includes('401')) {
    return ErrorCategory.AUTHENTICATION
  }
  if (message.includes('forbidden') || message.includes('403')) {
    return ErrorCategory.AUTHORIZATION
  }
  if (message.includes('rate limit') || message.includes('429')) {
    return ErrorCategory.RATE_LIMIT
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorCategory.VALIDATION
  }
  if (message.includes('500') || message.includes('server')) {
    return ErrorCategory.SERVER
  }

  return ErrorCategory.UNKNOWN
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.'
    }
    
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred. Please try again.'
}

/**
 * Log error with appropriate service
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorDetails = error instanceof AppError ? error.toJSON() : {
    message: getErrorMessage(error),
    category: categorizeError(error),
    severity: ErrorSeverity.MEDIUM,
    timestamp: new Date(),
    context,
    stack: error instanceof Error ? error.stack : undefined,
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorDetails)
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error, { extra: context })
  }
}

/**
 * Handle error with user notification
 */
export function handleError(
  error: unknown,
  options?: {
    showToast?: boolean
    toastMessage?: string
    context?: Record<string, unknown>
    silent?: boolean
  }
): void {
  const { showToast = true, toastMessage, context, silent = false } = options ?? {}

  // Log the error
  if (!silent) {
    logError(error, context)
  }

  // Show user notification
  if (showToast) {
    const message = toastMessage ?? getErrorMessage(error)
    const category = categorizeError(error)

    switch (category) {
      case ErrorCategory.NETWORK:
        toast.error(message, { icon: '🌐' })
        break
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.AUTHORIZATION:
        toast.error(message, { icon: '🔒' })
        break
      case ErrorCategory.RATE_LIMIT:
        toast.error(message, { icon: '⏱️' })
        break
      case ErrorCategory.VALIDATION:
        toast.error(message, { icon: '⚠️' })
        break
      default:
        toast.error(message)
    }
  }
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    shouldRetry = (error) => categorizeError(error) === ErrorCategory.NETWORK,
  } = config ?? {}

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Check if we should retry
      if (attempt === maxAttempts || !shouldRetry(error, attempt)) {
        throw error
      }

      // Calculate delay
      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt

      // Log retry attempt
      console.log(`Retry attempt ${attempt}/${maxAttempts} after ${waitTime}ms`)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

/**
 * Create error from API response
 */
export function createApiError(response: Response, data?: ApiError): AppError {
  const statusCode = response.status
  let category: ErrorCategory
  let severity: ErrorSeverity

  switch (statusCode) {
    case 400:
      category = ErrorCategory.VALIDATION
      severity = ErrorSeverity.LOW
      break
    case 401:
      category = ErrorCategory.AUTHENTICATION
      severity = ErrorSeverity.HIGH
      break
    case 403:
      category = ErrorCategory.AUTHORIZATION
      severity = ErrorSeverity.HIGH
      break
    case 429:
      category = ErrorCategory.RATE_LIMIT
      severity = ErrorSeverity.MEDIUM
      break
    case 500:
    case 502:
    case 503:
      category = ErrorCategory.SERVER
      severity = ErrorSeverity.HIGH
      break
    default:
      category = ErrorCategory.UNKNOWN
      severity = ErrorSeverity.MEDIUM
  }

  const message = data?.message ?? `Request failed with status ${statusCode}`

  return new AppError(message, category, severity, statusCode, data?.details)
}

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Retry the operation
   */
  retry: async <T>(fn: () => Promise<T>, config?: RetryConfig): Promise<T> => {
    return withRetry(fn, config)
  },

  /**
   * Fall back to cached data
   */
  useCache: <T>(cacheKey: string, defaultValue: T): T => {
    try {
      const cached = localStorage.getItem(cacheKey)
      return cached ? JSON.parse(cached) : defaultValue
    } catch {
      return defaultValue
    }
  },

  /**
   * Fall back to default value
   */
  useDefault: <T>(defaultValue: T): T => {
    return defaultValue
  },

  /**
   * Redirect to error page
   */
  redirect: (path: string = '/error'): void => {
    window.location.href = path
  },
}
