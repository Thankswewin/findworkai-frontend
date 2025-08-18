import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Debug
  debug: process.env.NODE_ENV === 'development',
  
  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      // Set sampling rate for performance monitoring
      tracingOrigins: ['localhost', 'findworkai.com', /^\//],
    }),
    new Sentry.Replay({
      // Mask sensitive content
      maskAllText: false,
      maskAllInputs: true,
      // Capture console logs
      captureConsole: true,
    }),
  ],
  
  // Filtering
  beforeSend(event, hint) {
    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException as Error
      
      // Ignore network errors in development
      if (process.env.NODE_ENV === 'development' && error?.message?.includes('NetworkError')) {
        return null
      }
      
      // Ignore ResizeObserver errors
      if (error?.message?.includes('ResizeObserver')) {
        return null
      }
      
      // Ignore third-party script errors
      if (event.exception.values?.[0]?.stacktrace?.frames?.some(
        (frame: any) => frame.filename?.includes('chrome-extension://') ||
                 frame.filename?.includes('moz-extension://')
      )) {
        return null
      }
    }
    
    // Filter sensitive data
    if (event.request) {
      // Remove auth headers
      if (event.request.headers) {
        delete event.request.headers['Authorization']
        delete event.request.headers['Cookie']
      }
      
      // Remove sensitive query params
      if (event.request.query_string) {
        event.request.query_string = (event.request.query_string as string)
          .replace(/token=[^&]+/g, 'token=***')
          .replace(/api_key=[^&]+/g, 'api_key=***')
      }
    }
    
    // Add user context
    if (typeof window !== 'undefined') {
      const user = getUserFromSession() // Implement this based on your auth
      if (user) {
        event.user = {
          id: user.id,
          email: user.email,
          username: user.name,
        }
      }
    }
    
    return event
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    // Network errors
    'NetworkError',
    'Failed to fetch',
    // Safari specific
    'AbortError: Fetch is aborted',
    // Chrome specific
    'The play() request was interrupted',
  ],
  
  // Deny list for URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    // Firefox extensions
    /^moz-extension:\/\//i,
    // Safari extensions
    /^safari-extension:\/\//i,
    // Other
    /^resource:\/\//i,
    /^about:\/\//i,
  ],
})

// Helper function to get user from session
function getUserFromSession(): any {
  // Implement based on your authentication method
  // For Supabase:
  if (typeof window !== 'undefined') {
    const storedSession = window.localStorage.getItem('supabase.auth.token')
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        return session?.currentSession?.user
      } catch {
        return null
      }
    }
  }
  return null
}

// Custom error boundary reporting
export function reportErrorToBoundary(error: Error, errorInfo?: any) {
  Sentry.withScope((scope: any) => {
    scope.setLevel('error')
    scope.setContext('errorBoundary', {
      ...errorInfo,
      componentStack: errorInfo?.componentStack,
    })
    Sentry.captureException(error)
  })
}

// Performance monitoring helpers
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const transaction = Sentry.startTransaction({ name })
  Sentry.getCurrentHub().getScope()?.setSpan(transaction)
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      transaction.finish()
    })
  } else {
    transaction.finish()
    return result
  }
}

// Custom breadcrumb logging
export function logBreadcrumb(
  message: string,
  category: string = 'custom',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  })
}
