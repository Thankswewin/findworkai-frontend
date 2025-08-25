/**
 * API Configuration for Frontend
 * Handles environment-based API URLs
 */

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we have environment variables
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Check current hostname for production/staging
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Even in development, use deployed backend
    return process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1';
  } else if (hostname.includes('staging')) {
    // Staging environment
    return 'https://api-staging.findworkai.com';
  } else if (hostname.includes('findworkai.com')) {
    // Production environment
    return 'https://api.findworkai.com';
  } else {
    // Default to relative URL
    return '';
  }
};

// API configuration object
const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// API endpoints
const endpoints = {
  // Auth endpoints
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
    profile: '/api/v1/auth/profile',
  },
  
  // Business endpoints
  businesses: {
    search: '/api/v1/businesses/search',  // Fixed endpoint path
    analyze: '/api/v1/analysis/analyze',
    details: (id) => `/api/v1/businesses/${id}`,
    export: '/api/v1/export/leads',
  },
  
  // Campaign endpoints
  campaigns: {
    list: '/api/v1/campaigns',
    create: '/api/v1/campaigns/create',
    details: (id) => `/api/v1/campaigns/${id}`,
    start: (id) => `/api/v1/campaigns/${id}/start`,
    pause: (id) => `/api/v1/campaigns/${id}/pause`,
    stats: (id) => `/api/v1/campaigns/${id}/stats`,
    addLeads: (id) => `/api/v1/campaigns/${id}/add-leads`,
  },
  
  // AI Agent endpoints - Updated to match backend MCP Enhanced endpoints
  aiAgent: {
    generate: '/api/v1/mcp-enhanced/generate-enhanced',  // Updated to correct MCP enhanced endpoint
    test: '/api/v1/mcp-enhanced/test-mcp-integration',
    analyze: '/api/v1/analyze-business/analyze',  // Updated to correct endpoint
  },
  
  // Analytics endpoints
  analytics: {
    dashboard: '/api/v1/analytics/dashboard',
    campaigns: '/api/v1/analytics/campaigns',
    export: '/api/v1/analytics/export',
  },
  
  // Export endpoints
  export: {
    businesses: '/api/v1/export/leads',
    campaigns: '/api/v1/export/campaigns',
    analytics: '/api/v1/export/analytics',
  },
  
  // Category endpoints
  categories: {
    search: '/api/v1/categories/search',
    analyzePhotos: '/api/v1/categories/analyze-photos',
  },
};

// Helper function to build full URL
const buildUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Helper function to add auth token to headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token) {
    return {
      ...apiConfig.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return apiConfig.headers;
};

// API request wrapper with error handling
const apiRequest = async (method, endpoint, data = null, options = {}) => {
  try {
    const url = buildUrl(endpoint);
    const config = {
      method,
      headers: getAuthHeaders(),
      ...options,
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API methods
const api = {
  get: (endpoint, options) => apiRequest('GET', endpoint, null, options),
  post: (endpoint, data, options) => apiRequest('POST', endpoint, data, options),
  put: (endpoint, data, options) => apiRequest('PUT', endpoint, data, options),
  patch: (endpoint, data, options) => apiRequest('PATCH', endpoint, data, options),
  delete: (endpoint, options) => apiRequest('DELETE', endpoint, null, options),
};

// Export configuration and utilities
export { apiConfig, endpoints, buildUrl, getAuthHeaders, api };
export default api;
