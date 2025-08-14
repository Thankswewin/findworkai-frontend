/**
 * Centralized type definitions for the entire application
 * All shared types should be defined here to ensure consistency
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'user' | 'admin'

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

// ============================================
// Business & Lead Types
// ============================================

export interface Business {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode?: string
  country: string
  phone?: string
  website?: string
  email?: string
  rating?: number
  totalReviews?: number
  businessCategory?: string
  hasWebsite?: boolean
  opportunityScore?: number
  weaknesses?: string[]
  opportunities?: string[]
  leadStatus?: LeadStatus
  lastContactDate?: Date
  createdAt: Date
  updatedAt: Date
  metadata?: BusinessMetadata
}

export interface BusinessMetadata {
  source?: string
  googlePlaceId?: string
  verified?: boolean
  industry?: string
  employeeCount?: number
  annualRevenue?: number
  tags?: string[]
}

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed-won'
  | 'closed-lost'

export interface LeadScore {
  score: number
  factors: ScoreFactor[]
  calculatedAt: Date
}

export interface ScoreFactor {
  name: string
  weight: number
  value: number
  contribution: number
}

// ============================================
// Campaign Types
// ============================================

export interface Campaign {
  id: string
  name: string
  description?: string
  campaignType: CampaignType
  serviceType: string
  status: CampaignStatus
  totalRecipients?: number
  totalSent?: number
  openRate?: number
  replyRate?: number
  clickRate?: number
  bounceRate?: number
  createdAt: Date
  updatedAt: Date
  scheduledAt?: Date
  completedAt?: Date
}

export type CampaignType = 
  | 'email'
  | 'sms'
  | 'social'
  | 'direct-mail'
  | 'multi-channel'

export type CampaignStatus = 
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: TemplateVariable[]
  createdAt: Date
  updatedAt: Date
}

export interface TemplateVariable {
  key: string
  description: string
  defaultValue?: string
  required: boolean
}

// ============================================
// Analytics Types
// ============================================

export interface DashboardMetrics {
  overview: OverviewMetrics
  campaigns: CampaignMetrics
  emailPerformance: EmailPerformanceMetrics
  pipeline: PipelineMetrics
}

export interface OverviewMetrics {
  totalLeads: number
  hotLeads: number
  contactedLeads: number
  convertedLeads: number
  conversionRate: number
  periodComparison?: PeriodComparison
}

export interface CampaignMetrics {
  total: number
  active: number
  completed: number
  draft: number
  scheduled: number
}

export interface EmailPerformanceMetrics {
  totalSent: number
  avgOpenRate: number
  avgReplyRate: number
  avgClickRate: number
  avgBounceRate: number
}

export interface PipelineMetrics {
  estimatedValue: number
  highValueLeads: number
  mediumValueLeads: number
  lowValueLeads: number
  averageDealSize: number
}

export interface PeriodComparison {
  current: number
  previous: number
  change: number
  changePercent: number
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  metadata?: ResponseMetadata
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

export interface ResponseMetadata {
  page?: number
  limit?: number
  total?: number
  hasMore?: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  query?: string
  filters?: Record<string, unknown>
}

// ============================================
// AI Agent Types
// ============================================

export interface AIAgentRequest {
  action: AIAgentAction
  business?: Business
  context?: AIAgentContext
}

export type AIAgentAction = 
  | 'process'
  | 'analyze'
  | 'generate-website'
  | 'create-campaign'
  | 'getHistory'
  | 'clearHistory'

export interface AIAgentContext {
  marketData?: MarketData
  competitorAnalysis?: CompetitorAnalysis
  industryInsights?: IndustryInsights
  previousActions?: AIAgentHistoryItem[]
}

export interface AIAgentHistoryItem {
  timestamp: Date
  action: string
  input: Record<string, unknown>
  output: Record<string, unknown>
  success: boolean
}

export interface MarketData {
  marketSize: number
  growthRate: number
  trends: string[]
  opportunities: string[]
  threats: string[]
}

export interface CompetitorAnalysis {
  competitors: Competitor[]
  marketPosition: string
  competitiveAdvantages: string[]
  weaknesses: string[]
}

export interface Competitor {
  name: string
  marketShare: number
  strengths: string[]
  weaknesses: string[]
}

export interface IndustryInsights {
  industry: string
  keyTrends: string[]
  regulations: string[]
  bestPractices: string[]
}

// ============================================
// Form Types
// ============================================

export interface FormField<T = string> {
  value: T
  error?: string
  touched?: boolean
}

export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncState<T> = {
  data: Nullable<T>
  loading: boolean
  error: Nullable<Error>
}

// Make all properties of T optional except the ones in K
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

// Make all properties of T required except the ones in K
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> & Pick<T, K>

// Extract the type of array elements
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
