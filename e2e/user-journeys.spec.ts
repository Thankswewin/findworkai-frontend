import { test, expect, Page } from '@playwright/test'
import { 
  createTestBusiness, 
  createTestLead, 
  createTestCampaign 
} from '../src/test-utils/factories'

// Helper to login
async function loginUser(page: Page, email: string = 'test@example.com', password: string = 'password123') {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  
  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: 10000 })
}

// Helper to mock API responses
async function mockApiResponses(page: Page) {
  // Mock businesses API
  await page.route('**/api/v1/businesses**', (route) => {
    const businesses = Array.from({ length: 10 }, () => createTestBusiness())
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ businesses, total: 10 })
    })
  })
  
  // Mock leads API
  await page.route('**/api/v1/leads**', (route) => {
    const leads = Array.from({ length: 20 }, () => createTestLead())
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ leads, total: 20 })
    })
  })
  
  // Mock campaigns API
  await page.route('**/api/v1/campaigns**', (route) => {
    const campaigns = Array.from({ length: 5 }, () => createTestCampaign())
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ campaigns, total: 5 })
    })
  })
}

test.describe('Complete User Journey: Lead Generation', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponses(page)
  })
  
  test('should complete full lead generation workflow', async ({ page }) => {
    // Step 1: Login
    await loginUser(page)
    
    // Step 2: Search for businesses
    await page.click('a[href*="advanced-search"]')
    await expect(page).toHaveURL(/advanced-search/)
    
    // Fill search criteria
    await page.fill('input[placeholder*="search"]', 'Coffee Shop')
    await page.selectOption('select[name="category"]', 'Restaurant')
    await page.fill('input[name="location"]', 'New York')
    await page.click('button:has-text("Search")')
    
    // Wait for results
    await page.waitForSelector('.business-card', { timeout: 10000 })
    const results = await page.locator('.business-card').count()
    expect(results).toBeGreaterThan(0)
    
    // Step 3: Select businesses for lead generation
    await page.click('.business-card:first-child input[type="checkbox"]')
    await page.click('.business-card:nth-child(2) input[type="checkbox"]')
    await page.click('button:has-text("Generate Leads")')
    
    // Step 4: Configure lead scoring
    await page.waitForSelector('h2:has-text("Lead Scoring")')
    await page.fill('input[name="minScore"]', '70')
    await page.click('input[name="verifiedOnly"]')
    await page.click('button:has-text("Apply Scoring")')
    
    // Step 5: Review and save leads
    await page.waitForSelector('.lead-preview')
    const leadCount = await page.locator('.lead-preview').count()
    expect(leadCount).toBeGreaterThan(0)
    
    await page.click('button:has-text("Save Leads")')
    
    // Verify success
    await expect(page.locator('text=/successfully saved/i')).toBeVisible()
  })
})

test.describe('Complete User Journey: Email Campaign', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponses(page)
  })
  
  test('should create and launch email campaign', async ({ page }) => {
    // Step 1: Login and navigate to campaigns
    await loginUser(page)
    await page.click('a[href*="campaigns"]')
    await expect(page).toHaveURL(/campaigns/)
    
    // Step 2: Create new campaign
    await page.click('button:has-text("New Campaign")')
    
    // Fill campaign details
    await page.fill('input[name="campaignName"]', 'Summer Promotion 2024')
    await page.fill('textarea[name="description"]', 'Special summer offers for local businesses')
    await page.selectOption('select[name="type"]', 'email')
    
    // Step 3: Select target audience
    await page.click('button:has-text("Select Leads")')
    await page.waitForSelector('.lead-selector')
    
    // Filter leads
    await page.selectOption('select[name="priority"]', 'high')
    await page.fill('input[name="minScore"]', '80')
    await page.click('button:has-text("Apply Filters")')
    
    // Select filtered leads
    await page.click('button:has-text("Select All")')
    await page.click('button:has-text("Confirm Selection")')
    
    // Step 4: Design email template
    await page.click('button:has-text("Design Email")')
    await page.fill('input[name="subject"]', 'Exclusive Offer for Your Business')
    await page.fill('.email-editor', 'Dear {{business_name}}, We have an exclusive offer...')
    
    // Add personalization
    await page.click('button:has-text("Add Personalization")')
    await page.click('button:has-text("{{contact_name}}")')
    
    // Step 5: Review and schedule
    await page.click('button:has-text("Review Campaign")')
    
    // Check preview
    await expect(page.locator('text=/Summer Promotion 2024/i')).toBeVisible()
    await expect(page.locator('text=/leads selected/i')).toBeVisible()
    
    // Schedule campaign
    await page.click('input[name="scheduleType"][value="scheduled"]')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.fill('input[type="datetime-local"]', tomorrow.toISOString().slice(0, 16))
    
    // Launch campaign
    await page.click('button:has-text("Launch Campaign")')
    
    // Confirm in modal
    await page.click('button:has-text("Confirm Launch")')
    
    // Verify success
    await expect(page.locator('text=/campaign scheduled successfully/i')).toBeVisible()
  })
})

test.describe('Complete User Journey: Analytics Review', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponses(page)
    
    // Mock analytics data
    await page.route('**/api/v1/analytics/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalLeads: 500,
          convertedLeads: 50,
          conversionRate: 10,
          totalRevenue: 250000,
          averageDealSize: 5000,
          topSources: [
            { source: 'Google', count: 200, percentage: 40 },
            { source: 'LinkedIn', count: 150, percentage: 30 },
            { source: 'Direct', count: 100, percentage: 20 },
            { source: 'Other', count: 50, percentage: 10 },
          ],
          dailyMetrics: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            leads: Math.floor(Math.random() * 30) + 10,
            conversions: Math.floor(Math.random() * 5),
            revenue: Math.floor(Math.random() * 20000) + 5000,
          }))
        })
      })
    })
  })
  
  test('should review analytics and export report', async ({ page }) => {
    // Step 1: Login and navigate to analytics
    await loginUser(page)
    await page.click('a[href*="analytics"]')
    await expect(page).toHaveURL(/analytics/)
    
    // Step 2: Check key metrics
    await expect(page.locator('text=/Total Leads/i')).toBeVisible()
    await expect(page.locator('text=/500/')).toBeVisible()
    await expect(page.locator('text=/Conversion Rate/i')).toBeVisible()
    await expect(page.locator('text=/10%/')).toBeVisible()
    
    // Step 3: Change date range
    await page.click('button:has-text("Last 30 days")')
    await page.click('button:has-text("Last 90 days")')
    
    // Wait for data to refresh
    await page.waitForTimeout(1000)
    
    // Step 4: Interact with charts
    await page.hover('.recharts-line-dot:first-child')
    await expect(page.locator('.recharts-tooltip')).toBeVisible()
    
    // Step 5: Filter by source
    await page.click('button:has-text("All Sources")')
    await page.click('label:has-text("Google")')
    await page.click('button:has-text("Apply")')
    
    // Step 6: Export report
    await page.click('button:has-text("Export Report")')
    
    // Select export options
    await page.click('input[name="format"][value="pdf"]')
    await page.click('input[name="includeCharts"]')
    await page.click('input[name="includeDetails"]')
    
    // Generate report
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Generate Report")')
    ])
    
    // Verify download
    expect(download.suggestedFilename()).toContain('analytics-report')
  })
})

test.describe('User Journey: AI Agent Builder', () => {
  test('should build and deploy an AI agent', async ({ page }) => {
    await loginUser(page)
    
    // Navigate to AI Agent builder
    await page.click('a[href*="ai-agent"]')
    await expect(page).toHaveURL(/ai-agent/)
    
    // Step 1: Choose template
    await page.click('button:has-text("Website Builder")')
    
    // Step 2: Configure agent
    await page.fill('input[name="agentName"]', 'My Business Website Builder')
    await page.fill('textarea[name="description"]', 'AI agent to build business websites')
    
    // Select capabilities
    await page.click('input[name="capabilities"][value="design"]')
    await page.click('input[name="capabilities"][value="content"]')
    await page.click('input[name="capabilities"][value="seo"]')
    
    // Step 3: Set parameters
    await page.fill('input[name="maxPages"]', '10')
    await page.selectOption('select[name="style"]', 'modern')
    await page.selectOption('select[name="colorScheme"]', 'professional')
    
    // Step 4: Test agent
    await page.click('button:has-text("Test Agent")')
    await page.fill('textarea[name="testPrompt"]', 'Create a homepage for a coffee shop')
    await page.click('button:has-text("Run Test")')
    
    // Wait for test results
    await page.waitForSelector('.test-results', { timeout: 30000 })
    await expect(page.locator('.test-results')).toContainText('Test completed')
    
    // Step 5: Deploy agent
    await page.click('button:has-text("Deploy Agent")')
    await page.click('button:has-text("Confirm Deployment")')
    
    // Verify deployment
    await expect(page.locator('text=/Agent deployed successfully/i')).toBeVisible()
  })
})

test.describe('Error Recovery Journey', () => {
  test('should handle errors gracefully throughout user journey', async ({ page }) => {
    await loginUser(page)
    
    // Simulate network failure
    await page.route('**/api/v1/**', (route) => {
      route.abort('failed')
    })
    
    // Try to load dashboard
    await page.goto('/dashboard')
    
    // Should show error state
    await expect(page.locator('text=/error|failed|retry/i').first()).toBeVisible({ timeout: 10000 })
    
    // Click retry button
    await page.route('**/api/v1/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      })
    })
    
    await page.click('button:has-text("Retry")')
    
    // Should recover
    await expect(page.locator('text=/error|failed/i')).not.toBeVisible()
  })
})

test.describe('Mobile User Journey', () => {
  test.use({ viewport: { width: 375, height: 667 } })
  
  test('should complete lead generation on mobile', async ({ page }) => {
    await mockApiResponses(page)
    await loginUser(page)
    
    // Open mobile menu
    await page.click('button[aria-label*="menu"]')
    
    // Navigate to search
    await page.click('a:has-text("Search")')
    
    // Search for businesses
    await page.fill('input[placeholder*="search"]', 'Restaurant')
    await page.click('button[type="submit"]')
    
    // Wait for results
    await page.waitForSelector('.business-card')
    
    // Verify mobile-optimized layout
    const cards = await page.locator('.business-card').all()
    for (const card of cards.slice(0, 3)) {
      const box = await card.boundingBox()
      expect(box?.width).toBeLessThanOrEqual(375) // Should fit mobile width
    }
    
    // Select a business
    await page.click('.business-card:first-child')
    
    // Should show details in mobile-friendly view
    await expect(page.locator('.business-details')).toBeVisible()
  })
})
