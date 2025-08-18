/**
 * Test Data Factories
 * Provides consistent test data generation for unit and integration tests
 */

import { faker } from '@faker-js/faker'

// User factory
export interface TestUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'user',
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

// Business factory
export interface TestBusiness {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  category: string
  rating: number
  reviewCount: number
  coordinates: {
    lat: number
    lng: number
  }
  hours: Record<string, string>
  images: string[]
  verified: boolean
  createdAt: Date
}

export const createTestBusiness = (overrides: Partial<TestBusiness> = {}): TestBusiness => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zipCode: faker.location.zipCode(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  website: faker.internet.url(),
  category: faker.helpers.arrayElement(['Restaurant', 'Retail', 'Service', 'Technology', 'Healthcare']),
  rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
  reviewCount: faker.number.int({ min: 0, max: 1000 }),
  coordinates: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  hours: {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  images: Array.from({ length: 3 }, () => faker.image.url()),
  verified: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  ...overrides,
})

// Lead factory
export interface TestLead {
  id: string
  businessId: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  notes: string
  tags: string[]
  lastContactedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export const createTestLead = (overrides: Partial<TestLead> = {}): TestLead => ({
  id: faker.string.uuid(),
  businessId: faker.string.uuid(),
  businessName: faker.company.name(),
  contactName: faker.person.fullName(),
  contactEmail: faker.internet.email(),
  contactPhone: faker.phone.number(),
  score: faker.number.int({ min: 0, max: 100 }),
  status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'converted', 'lost']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
  notes: faker.lorem.paragraph(),
  tags: faker.helpers.arrayElements(['hot-lead', 'follow-up', 'decision-maker', 'budget-approved'], 2),
  lastContactedAt: faker.datatype.boolean() ? faker.date.recent() : undefined,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

// Campaign factory
export interface TestCampaign {
  id: string
  name: string
  description: string
  type: 'email' | 'sms' | 'call' | 'social'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetAudience: string
  startDate: Date
  endDate?: Date
  budget: number
  spent: number
  leads: string[]
  metrics: {
    sent: number
    opened: number
    clicked: number
    converted: number
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export const createTestCampaign = (overrides: Partial<TestCampaign> = {}): TestCampaign => {
  const sent = faker.number.int({ min: 100, max: 10000 })
  const opened = faker.number.int({ min: 0, max: sent })
  const clicked = faker.number.int({ min: 0, max: opened })
  const converted = faker.number.int({ min: 0, max: clicked })
  
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName() + ' Campaign',
    description: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['email', 'sms', 'call', 'social']),
    status: faker.helpers.arrayElement(['draft', 'active', 'paused', 'completed']),
    targetAudience: faker.helpers.arrayElement(['Small Business', 'Enterprise', 'Startup', 'Non-profit']),
    startDate: faker.date.recent(),
    endDate: faker.datatype.boolean() ? faker.date.future() : undefined,
    budget: faker.number.int({ min: 1000, max: 100000 }),
    spent: faker.number.int({ min: 0, max: 50000 }),
    leads: Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => faker.string.uuid()),
    metrics: {
      sent,
      opened,
      clicked,
      converted,
    },
    createdBy: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }
}

// Analytics factory
export interface TestAnalytics {
  period: string
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  totalRevenue: number
  averageDealSize: number
  topSources: Array<{
    source: string
    count: number
    percentage: number
  }>
  dailyMetrics: Array<{
    date: string
    leads: number
    conversions: number
    revenue: number
  }>
}

export const createTestAnalytics = (overrides: Partial<TestAnalytics> = {}): TestAnalytics => {
  const totalLeads = faker.number.int({ min: 100, max: 1000 })
  const convertedLeads = faker.number.int({ min: 10, max: totalLeads / 2 })
  
  return {
    period: faker.helpers.arrayElement(['7d', '30d', '90d', '1y']),
    totalLeads,
    convertedLeads,
    conversionRate: (convertedLeads / totalLeads) * 100,
    totalRevenue: faker.number.int({ min: 10000, max: 1000000 }),
    averageDealSize: faker.number.int({ min: 500, max: 50000 }),
    topSources: [
      { source: 'Google', count: faker.number.int({ min: 10, max: 100 }), percentage: 35 },
      { source: 'LinkedIn', count: faker.number.int({ min: 10, max: 100 }), percentage: 25 },
      { source: 'Direct', count: faker.number.int({ min: 10, max: 100 }), percentage: 20 },
      { source: 'Referral', count: faker.number.int({ min: 10, max: 100 }), percentage: 15 },
      { source: 'Other', count: faker.number.int({ min: 10, max: 100 }), percentage: 5 },
    ],
    dailyMetrics: Array.from({ length: 7 }, (_, i) => ({
      date: faker.date.recent({ days: 7 - i }).toISOString().split('T')[0],
      leads: faker.number.int({ min: 5, max: 50 }),
      conversions: faker.number.int({ min: 0, max: 10 }),
      revenue: faker.number.int({ min: 1000, max: 20000 }),
    })),
    ...overrides,
  }
}

// API Response factory
export interface TestApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const createTestApiResponse = <T>(
  data?: T,
  overrides: Partial<TestApiResponse<T>> = {}
): TestApiResponse<T> => ({
  success: true,
  data,
  ...overrides,
})

export const createTestApiError = (
  code: string = 'ERROR',
  message: string = 'An error occurred',
  details?: any
): TestApiResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
})

// Batch creation helpers
export const createTestUsers = (count: number = 5): TestUser[] =>
  Array.from({ length: count }, () => createTestUser())

export const createTestBusinesses = (count: number = 10): TestBusiness[] =>
  Array.from({ length: count }, () => createTestBusiness())

export const createTestLeads = (count: number = 20): TestLead[] =>
  Array.from({ length: count }, () => createTestLead())

export const createTestCampaigns = (count: number = 5): TestCampaign[] =>
  Array.from({ length: count }, () => createTestCampaign())

// Mock data for specific scenarios
export const mockAuthenticatedUser = createTestUser({
  id: 'auth-user-123',
  email: 'test@findworkai.com',
  name: 'Test User',
  role: 'user',
})

export const mockAdminUser = createTestUser({
  id: 'admin-user-123',
  email: 'admin@findworkai.com',
  name: 'Admin User',
  role: 'admin',
})

export const mockHighScoreLead = createTestLead({
  score: 95,
  status: 'qualified',
  priority: 'high',
  tags: ['hot-lead', 'decision-maker', 'budget-approved'],
})

export const mockActiveCampaign = createTestCampaign({
  status: 'active',
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
})
