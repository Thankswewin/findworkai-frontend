/**
 * API Configuration
 * Manages API URLs for different environments
 */

export const API_CONFIG = {
  // Backend URLs
  production: 'https://findworkai-backend-1.onrender.com',
  development: 'http://localhost:8000',
  
  // API endpoints
  endpoints: {
    // Authentication
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
    
    // Enhanced Generation (NEW)
    generateEnhanced: '/api/v1/mcp-enhanced/generate-enhanced',
    validateWebsite: '/api/v1/mcp-enhanced/validate-website',
    fixWebsite: '/api/v1/mcp-enhanced/fix-website',
    testMCP: '/api/v1/mcp-enhanced/test-mcp-integration',
    
    // Business Operations
    searchBusinesses: '/api/v1/search/businesses',
    analyzeBusiness: '/api/v1/analyze-business/analyze',
    saveBusinesses: '/api/v1/businesses/',
    
    // Campaigns
    campaigns: '/api/v1/campaigns/',
    
    // Analytics
    analytics: '/api/v1/analytics/dashboard',
    
    // Outreach
    sendEmail: '/api/v1/outreach/send-email',
    
    // System
    health: '/api/v1/system-status/health'
  }
};

/**
 * Get the appropriate API URL based on environment
 */
export function getApiUrl(): string {
  // Check if we're in production (Vercel deployment)
  if (process.env.NODE_ENV === 'production' || 
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
      typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return API_CONFIG.production;
  }
  
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to development
  return API_CONFIG.development;
}

/**
 * Get full endpoint URL
 */
export function getEndpointUrl(endpoint: keyof typeof API_CONFIG.endpoints): string {
  return `${getApiUrl()}${API_CONFIG.endpoints[endpoint]}`;
}

/**
 * Common request headers
 */
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Handle API errors consistently
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = 'An error occurred';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorData.message || errorMessage;
  } catch {
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }
  
  throw new Error(errorMessage);
}
