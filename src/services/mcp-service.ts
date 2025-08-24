/**
 * MCP Service for Frontend
 * Handles communication with MCP-enhanced AI generation backend
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface MCPAIRequest {
  business_info: {
    name: string;
    business_category: string;
    city: string;
    state: string;
    rating?: number;
    has_website?: boolean;
    website?: string;
    total_reviews?: number;
    phone?: string;
    address?: string;
  };
  existing_website_url?: string;
  generation_type: 'website' | 'email' | 'content';
  framework: 'html' | 'nextjs' | 'react';
  style: 'modern' | 'classic' | 'minimal' | 'bold';
  component_requirements?: string[];
  use_mcp_context: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface MCPAIResponse {
  output: string;
  mcp_context_used: boolean;
  scraped_data_summary?: {
    pages_analyzed: number;
    current_style: string;
    seo_score: number;
    performance_issues: number;
  };
  components_used?: string[];
  recommendations: string[];
  model_used: string;
  tokens_used?: number;
  generation_time: number;
  status: string;
}

export interface MCPStatus {
  status: string;
  servers_configured: number;
  servers: {
    [key: string]: {
      type: string;
      url: string;
      configured: boolean;
    };
  };
  cache_size: number;
  features: {
    website_scraping: boolean;
    ui_components: boolean;
    context_aggregation: boolean;
    intelligent_hints: boolean;
  };
}

class MCPService {
  private axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 120000, // 2 minutes timeout for MCP operations
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Generate content with MCP context enhancement
   */
  async generateWithMCP(request: MCPAIRequest): Promise<MCPAIResponse> {
    try {
      const response = await this.axiosInstance.post<MCPAIResponse>(
        '/mcp-ai-agent/generate-with-mcp',
        request
      );
      return response.data;
    } catch (error) {
      console.error('MCP generation failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get MCP server status
   */
  async getMCPStatus(): Promise<MCPStatus> {
    try {
      const response = await this.axiosInstance.get<MCPStatus>('/mcp-ai-agent/mcp-status');
      return response.data;
    } catch (error) {
      console.error('Failed to get MCP status:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generate website with MCP enhancement
   */
  async generateWebsite(
    businessInfo: MCPAIRequest['business_info'],
    options: {
      existingWebsiteUrl?: string;
      framework?: 'html' | 'nextjs' | 'react';
      style?: 'modern' | 'classic' | 'minimal' | 'bold';
      components?: string[];
      useMCP?: boolean;
    } = {}
  ): Promise<MCPAIResponse> {
    const request: MCPAIRequest = {
      business_info: businessInfo,
      existing_website_url: options.existingWebsiteUrl,
      generation_type: 'website',
      framework: options.framework || 'html',
      style: options.style || 'modern',
      component_requirements: options.components,
      use_mcp_context: options.useMCP !== false, // Default to true
      temperature: 0.8,
      max_tokens: 6000,
    };

    return this.generateWithMCP(request);
  }

  /**
   * Generate marketing email with MCP enhancement
   */
  async generateEmail(
    businessInfo: MCPAIRequest['business_info'],
    options: {
      existingWebsiteUrl?: string;
      useMCP?: boolean;
    } = {}
  ): Promise<MCPAIResponse> {
    const request: MCPAIRequest = {
      business_info: businessInfo,
      existing_website_url: options.existingWebsiteUrl,
      generation_type: 'email',
      framework: 'html',
      style: 'modern',
      use_mcp_context: options.useMCP !== false,
      temperature: 0.7,
      max_tokens: 1500,
    };

    return this.generateWithMCP(request);
  }

  /**
   * Analyze existing website using MCP
   */
  async analyzeWebsite(url: string): Promise<{
    analysis: any;
    recommendations: string[];
  }> {
    // This would call a specific endpoint for website analysis
    // For now, we'll use the generation endpoint with a special request
    const request: MCPAIRequest = {
      business_info: {
        name: 'Analysis Target',
        business_category: 'Unknown',
        city: 'Unknown',
        state: 'Unknown',
      },
      existing_website_url: url,
      generation_type: 'content',
      framework: 'html',
      style: 'modern',
      use_mcp_context: true,
      temperature: 0.3,
      max_tokens: 1000,
    };

    const response = await this.generateWithMCP(request);
    
    return {
      analysis: response.scraped_data_summary || {},
      recommendations: response.recommendations,
    };
  }

  /**
   * Get recommended components for a business type
   */
  getRecommendedComponents(businessType: string): string[] {
    const baseComponents = [
      'navbar',
      'hero',
      'footer',
      'contact',
      'testimonial',
      'cta',
    ];

    const typeSpecificComponents: { [key: string]: string[] } = {
      restaurant: ['menu', 'reservation', 'gallery', 'reviews'],
      medical: ['appointment', 'services', 'team', 'insurance'],
      retail: ['products', 'shopping-cart', 'reviews', 'promotions'],
      service: ['services', 'pricing', 'portfolio', 'process'],
      fitness: ['classes', 'trainers', 'membership', 'schedule'],
      salon: ['services', 'booking', 'gallery', 'team'],
      automotive: ['services', 'appointment', 'reviews', 'specials'],
      realestate: ['listings', 'search', 'agents', 'mortgage-calculator'],
    };

    const normalizedType = businessType.toLowerCase().replace(/[^a-z]/g, '');
    const specificComponents = Object.entries(typeSpecificComponents).find(
      ([key]) => normalizedType.includes(key)
    )?.[1] || [];

    return [...baseComponents, ...specificComponents];
  }

  /**
   * Format generation output for preview
   */
  formatOutput(output: string, framework: string): string {
    // Clean up any markdown code blocks if present
    let cleaned = output.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    
    // For Next.js/React, ensure it's properly formatted
    if (framework === 'nextjs' || framework === 'react') {
      cleaned = cleaned.replace(/```(?:tsx|jsx|typescript|javascript)?\n?/g, '');
    }

    return cleaned.trim();
  }

  /**
   * Handle errors from API calls
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        return new Error(
          error.response.data.detail || 
          error.response.data.message || 
          `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request made but no response
        return new Error('No response from server. Please check your connection.');
      }
    }
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const mcpService = new MCPService();

// Export types for use in components
export type { MCPAIRequest, MCPAIResponse, MCPStatus };
