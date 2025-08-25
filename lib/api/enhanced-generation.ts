/**
 * Enhanced Website Generation API Service
 * Integrates with MCP-enhanced backend for premium AI generation
 */

import { getApiUrl } from './config';

export interface BusinessInfo {
  name: string;
  business_name?: string;
  business_category: string;
  description?: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  email?: string;
  services?: string[];
  features?: string[];
  [key: string]: any;
}

export interface GenerationRequest {
  business_info: BusinessInfo;
  competitor_urls?: string[];
  enable_mcp?: boolean;
  enable_self_reflection?: boolean;
  enable_self_correction?: boolean;
  max_iterations?: number;
  framework?: 'html' | 'react' | 'nextjs';
  style_preference?: string;
}

export interface GenerationResponse {
  final_output: string;
  mcp_context?: any;
  validation_issues?: any[];
  corrections_made?: string[];
  iterations?: number;
  competitor_insights?: any;
  component_suggestions?: any[];
  metadata?: {
    framework?: string;
    style?: string;
    mcp_enabled?: boolean;
    self_reflection_enabled?: boolean;
    self_correction_enabled?: boolean;
    generation_time?: string;
  };
}

export class EnhancedGenerationService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = getApiUrl();
  }

  /**
   * Generate enhanced website with AI self-improvement
   */
  async generateWebsite(request: GenerationRequest): Promise<GenerationResponse> {
    // Temporarily disabled for testing - remove this comment when auth is implemented
    const token = localStorage.getItem('access_token');
    
    // if (!token) {
    //   throw new Error('Authentication required');
    // }

    const defaultRequest: GenerationRequest = {
      ...request,
      enable_mcp: request.enable_mcp ?? false, // Disable MCP by default for speed
      enable_self_reflection: request.enable_self_reflection ?? true,
      enable_self_correction: request.enable_self_correction ?? true,
      max_iterations: request.max_iterations ?? 2,
      framework: request.framework ?? 'html',
      style_preference: request.style_preference ?? 'modern'
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/api/v1/mcp-enhanced/generate-enhanced`, {
      method: 'POST',
      headers,
      body: JSON.stringify(defaultRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate website');
    }

    return response.json();
  }

  /**
   * Validate existing website content
   */
  async validateWebsite(content: string, businessInfo?: BusinessInfo) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/mcp-enhanced/validate-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        business_info: businessInfo
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to validate website');
    }

    return response.json();
  }

  /**
   * Fix issues in website content
   */
  async fixWebsite(content: string, issues: any[], businessInfo?: BusinessInfo) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/mcp-enhanced/fix-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        issues,
        business_info: businessInfo
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fix website');
    }

    return response.json();
  }

  /**
   * Test MCP integration status
   */
  async testMCPIntegration() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/mcp-enhanced/test-mcp-integration`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to test MCP integration');
    }

    return response.json();
  }
}

// Export singleton instance
export const enhancedGenerationService = new EnhancedGenerationService();
