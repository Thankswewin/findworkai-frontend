import { test, expect, Page } from '@playwright/test'

// Test data and helpers
const testUser = {
  email: 'test@findworkai.com',
  password: 'TestPassword123!',
  name: 'Test User'
}

const businessSearchData = {
  query: 'coffee shops',
  location: 'New York, NY',
  category: 'Restaurant',
  radius: '5'
}

// Helper functions
async function loginUser(page: Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', testUser.email)
  await page.fill('input[type="password"]', testUser.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/dashboard/)
}

async function mockBackendAPIs(page: Page) {
  // Mock authentication
  await page.route('**/api/v1/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake_token',
        token_type: 'bearer',
        user: {
          id: 'test-user-123',
          email: testUser.email,
          name: testUser.name,
          subscription_plan: 'professional'
        }
      })
    })
  })

  // Mock business search (Google Maps integration)
  await page.route('**/api/v1/businesses/search', (route) => {
    const mockBusinesses = [
      {
        id: 'biz-001',
        name: 'Central Perk Coffee',
        address: '123 Main St, New York, NY',
        phone: '+1-555-123-4567',
        website: 'https://centralperkcoffee.com',
        rating: 4.5,
        review_count: 245,
        category: 'Coffee Shop',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        business_status: 'OPERATIONAL',
        opening_hours: '6:00 AM - 10:00 PM',
        price_level: 2
      },
      {
        id: 'biz-002',
        name: 'Brooklyn Brew House',
        address: '456 Coffee Ave, Brooklyn, NY',
        phone: '+1-555-987-6543',
        website: 'https://brooklynbrew.com',
        rating: 4.8,
        review_count: 189,
        category: 'Coffee Shop',
        coordinates: { lat: 40.6782, lng: -73.9442 },
        business_status: 'OPERATIONAL',
        opening_hours: '7:00 AM - 9:00 PM',
        price_level: 3
      }
    ]

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        businesses: mockBusinesses,
        total: mockBusinesses.length,
        search_metadata: {
          query: businessSearchData.query,
          location: businessSearchData.location,
          radius: businessSearchData.radius
        }
      })
    })
  })

  // Mock AI analysis
  await page.route('**/api/v1/analysis/analyze/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        business_id: 'biz-001',
        analysis: {
          strengths: [
            'Strong online presence with professional website',
            'High customer rating (4.5/5) with substantial reviews',
            'Prime location in busy Manhattan district',
            'Active on social media platforms'
          ],
          weaknesses: [
            'Limited online ordering system',
            'No loyalty program implementation',
            'Inconsistent social media posting schedule',
            'Missing Google Business optimization'
          ],
          opportunities: [
            'Implement mobile app for ordering and rewards',
            'Expand catering services to local businesses',
            'Partner with local delivery platforms',
            'Create subscription-based coffee delivery service'
          ],
          threats: [
            'Increasing competition from chain coffee shops',
            'Rising commercial rent prices in the area',
            'Supply chain disruptions affecting coffee prices',
            'Changing consumer preferences toward health-conscious options'
          ],
          lead_score: 85,
          priority: 'high',
          recommended_approach: 'Focus on digital transformation and customer retention strategies',
          confidence_level: 0.92
        },
        generated_at: new Date().toISOString()
      })
    })
  })

  // Mock email generation
  await page.route('**/api/v1/outreach/generate-email/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        business_id: 'biz-001',
        email: {
          subject: 'Boost Your Coffee Shop\'s Digital Presence - Free Consultation',
          body: `Dear Central Perk Coffee Team,

I hope this message finds you brewing success! I came across Central Perk Coffee while researching thriving local businesses in Manhattan, and I'm impressed by your 4.5-star rating and loyal customer base.

After a quick analysis of your online presence, I noticed some exciting opportunities that could help you:

🚀 **Immediate Opportunities:**
• Implement a mobile ordering system to reduce wait times
• Launch a customer loyalty program to increase repeat visits
• Optimize your Google Business profile for better local visibility
• Expand your catering services to nearby offices

**Why This Matters:** Local coffee shops that embrace digital tools see an average 23% increase in revenue within 6 months.

**What We Offer:**
• Free 30-minute consultation to discuss your goals
• Custom digital strategy tailored to your business
• Proven track record with 200+ local businesses

Would you be open to a brief 15-minute call this week to explore how we can help Central Perk Coffee reach even more caffeine enthusiasts?

Best regards,
${testUser.name}
Digital Growth Specialist

P.S. I'd love to stop by for a coffee and chat in person if you prefer!`,
          personalization_tokens: [
            { token: '{{business_name}}', value: 'Central Perk Coffee' },
            { token: '{{rating}}', value: '4.5' },
            { token: '{{location}}', value: 'Manhattan' }
          ],
          tone: 'friendly_professional',
          word_count: 245,
          estimated_response_rate: 0.18
        }
      })
    })
  })

  // Mock campaign creation
  await page.route('**/api/v1/campaigns/create', (route) => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        campaign: {
          id: 'camp-001',
          name: 'Coffee Shop Outreach Q4 2024',
          description: 'Targeted outreach to high-potential coffee shops in NYC area',
          type: 'email',
          status: 'draft',
          created_at: new Date().toISOString(),
          target_count: 2,
          estimated_send_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          settings: {
            daily_send_limit: 50,
            follow_up_sequence: true,
            personalization_level: 'high'
          }
        }
      })
    })
  })

  // Mock lead scoring
  await page.route('**/api/v1/leads/score-leads', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        scored_leads: [
          {
            business_id: 'biz-001',
            business_name: 'Central Perk Coffee',
            lead_score: 85,
            priority: 'high',
            score_breakdown: {
              website_quality: 18,
              online_reviews: 22,
              social_presence: 15,
              business_size: 12,
              location_quality: 18
            }
          },
          {
            business_id: 'biz-002',
            business_name: 'Brooklyn Brew House',
            lead_score: 91,
            priority: 'high',
            score_breakdown: {
              website_quality: 20,
              online_reviews: 25,
              social_presence: 18,
              business_size: 15,
              location_quality: 13
            }
          }
        ],
        summary: {
          total_leads: 2,
          high_priority: 2,
          medium_priority: 0,
          low_priority: 0,
          average_score: 88
        }
      })
    })
  })
}

test.describe('Complete AI Agent Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendAPIs(page)
  })

  test('should complete full AI-powered lead generation workflow', async ({ page }) => {
    // Step 1: Login
    await loginUser(page)
    
    // Verify dashboard loaded
    await expect(page.locator('h1')).toContainText(/dashboard|welcome/i)

    // Step 2: Navigate to Business Search
    await page.click('a[href*="search"], button:has-text("Find Businesses")')
    await expect(page).toHaveURL(/search/)

    // Step 3: Perform AI-enhanced business search
    await page.fill('input[name="query"], input[placeholder*="search"]', businessSearchData.query)
    await page.fill('input[name="location"], input[placeholder*="location"]', businessSearchData.location)
    await page.selectOption('select[name="category"]', businessSearchData.category)
    await page.fill('input[name="radius"]', businessSearchData.radius)
    
    // Submit search
    await page.click('button[type="submit"], button:has-text("Search")')

    // Wait for search results
    await page.waitForSelector('.business-card, .business-result', { timeout: 15000 })
    const businessCards = await page.locator('.business-card, .business-result').count()
    expect(businessCards).toBeGreaterThan(0)

    // Verify business data is displayed correctly
    await expect(page.locator('text=/Central Perk Coffee/i')).toBeVisible()
    await expect(page.locator('text=/Brooklyn Brew House/i')).toBeVisible()
    await expect(page.locator('text=/4\.5|4\.8/')).toBeVisible() // Ratings

    // Step 4: Select businesses for AI analysis
    await page.click('.business-card:first-child input[type="checkbox"], .business-card:first-child button:has-text("Select")')
    await page.click('.business-card:nth-child(2) input[type="checkbox"], .business-card:nth-child(2) button:has-text("Select")')
    
    // Trigger AI analysis
    await page.click('button:has-text("Analyze Selected"), button:has-text("AI Analysis")')

    // Step 5: Wait for and review AI analysis results
    await page.waitForSelector('.analysis-results, .ai-insights', { timeout: 30000 })
    
    // Verify AI analysis content
    await expect(page.locator('text=/strengths|opportunities|weaknesses|threats/i')).toBeVisible()
    await expect(page.locator('text=/lead.score|priority/i')).toBeVisible()
    await expect(page.locator('text=/85|91/')).toBeVisible() // Lead scores

    // Step 6: Generate AI-powered outreach emails
    await page.click('button:has-text("Generate Emails"), button:has-text("Create Outreach")')
    
    // Wait for email generation
    await page.waitForSelector('.email-preview, .generated-email', { timeout: 20000 })
    
    // Verify email content
    await expect(page.locator('text=/Central Perk Coffee/i')).toBeVisible()
    await expect(page.locator('text=/digital.presence|consultation/i')).toBeVisible()
    await expect(page.locator('text=/subject.*boost/i')).toBeVisible()

    // Step 7: Review and customize generated emails
    const emailSubject = page.locator('input[name="subject"], .email-subject')
    await expect(emailSubject).toContainText(/boost.*digital/i)
    
    // Make minor customization
    await page.click('button:has-text("Edit"), button:has-text("Customize")')
    await page.fill('textarea[name="body"], .email-body-editor', 
      'Custom addition: We specialize in coffee shop digital transformation.')

    // Step 8: Score and prioritize leads
    await page.click('button:has-text("Score Leads"), button:has-text("Prioritize")')
    
    // Wait for lead scoring
    await page.waitForSelector('.lead-scores, .priority-list', { timeout: 15000 })
    
    // Verify lead scores
    await expect(page.locator('text=/85|91/')).toBeVisible()
    await expect(page.locator('text=/high.priority/i')).toBeVisible()

    // Step 9: Create outreach campaign
    await page.click('button:has-text("Create Campaign"), button:has-text("Launch Campaign")')
    
    // Fill campaign details
    await page.fill('input[name="campaignName"], input[name="name"]', 'Coffee Shop Outreach Q4 2024')
    await page.fill('textarea[name="description"]', 'Targeted outreach to high-potential coffee shops')
    await page.selectOption('select[name="type"]', 'email')
    
    // Configure campaign settings
    await page.fill('input[name="dailyLimit"]', '50')
    await page.click('input[name="followUpSequence"], input[type="checkbox"]:has(+ label:has-text("Follow-up"))')
    
    // Step 10: Review campaign before launch
    await page.click('button:has-text("Review Campaign"), button:has-text("Preview")')
    
    // Verify campaign summary
    await expect(page.locator('text=/Coffee Shop Outreach/i')).toBeVisible()
    await expect(page.locator('text=/2.*(leads|recipients)/i')).toBeVisible()
    await expect(page.locator('text=/50.*(daily|limit)/i')).toBeVisible()

    // Step 11: Launch the campaign
    await page.click('button:has-text("Launch Now"), button:has-text("Start Campaign")')
    
    // Confirm in modal if present
    if (await page.locator('button:has-text("Confirm")').isVisible()) {
      await page.click('button:has-text("Confirm")')
    }

    // Step 12: Verify campaign creation success
    await expect(page.locator('text=/campaign.*created|launched.successfully/i')).toBeVisible({ timeout: 10000 })
    
    // Should redirect to campaigns dashboard or show success state
    await expect(page.locator('text=/Coffee Shop Outreach/i')).toBeVisible()
  })

  test('should handle AI analysis failures gracefully', async ({ page }) => {
    await loginUser(page)

    // Mock API failure for AI analysis
    await page.route('**/api/v1/analysis/analyze/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI service temporarily unavailable' })
      })
    })

    // Navigate to search
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', businessSearchData.query)
    await page.click('button[type="submit"]')
    
    // Wait for results and select business
    await page.waitForSelector('.business-card')
    await page.click('.business-card:first-child input[type="checkbox"]')
    await page.click('button:has-text("Analyze")')

    // Should show error handling
    await expect(page.locator('text=/error|failed|unavailable/i')).toBeVisible()
    await expect(page.locator('button:has-text("Retry")')).toBeVisible()
    
    // Test retry functionality
    await page.route('**/api/v1/analysis/analyze/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          business_id: 'biz-001',
          analysis: { lead_score: 75, priority: 'medium' }
        })
      })
    })

    await page.click('button:has-text("Retry")')
    await expect(page.locator('text=/75/')).toBeVisible()
  })

  test('should validate business data accuracy', async ({ page }) => {
    await loginUser(page)
    
    // Navigate to search and perform search
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', businessSearchData.query)
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Verify all expected business fields are present
    const businessCard = page.locator('.business-card').first()
    
    await expect(businessCard.locator('text=/Central Perk Coffee/i')).toBeVisible()
    await expect(businessCard.locator('text=/123 Main St/i')).toBeVisible()
    await expect(businessCard.locator('text=/555-123-4567/')).toBeVisible()
    await expect(businessCard.locator('text=/4\.5/')).toBeVisible()
    await expect(businessCard.locator('text=/245.*review/i')).toBeVisible()
    
    // Verify clickable elements work
    await businessCard.click()
    await expect(page.locator('.business-details, .business-modal')).toBeVisible()
  })

  test('should handle large dataset performance', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/v1/businesses/search', (route) => {
      const largeMockDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `biz-${i.toString().padStart(3, '0')}`,
        name: `Business ${i + 1}`,
        address: `${100 + i} Test St, New York, NY`,
        rating: 3.0 + Math.random() * 2,
        review_count: Math.floor(Math.random() * 500) + 10
      }))

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          businesses: largeMockDataset,
          total: largeMockDataset.length
        })
      })
    })

    await loginUser(page)
    await page.click('a[href*="search"]')
    
    // Measure search performance
    const searchStartTime = Date.now()
    await page.fill('input[name="query"]', 'large dataset test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    const searchEndTime = Date.now()
    
    const searchDuration = searchEndTime - searchStartTime
    expect(searchDuration).toBeLessThan(5000) // Should complete within 5 seconds
    
    // Verify pagination or virtual scrolling works
    const businessCards = await page.locator('.business-card').count()
    expect(businessCards).toBeGreaterThan(10) // Should show results
    expect(businessCards).toBeLessThanOrEqual(50) // But not all at once for performance
  })
})

test.describe('AI Agent Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendAPIs(page)
  })

  test('should integrate with real backend API endpoints', async ({ page }) => {
    // Test against actual backend (requires backend to be running)
    await page.route('**/api/v1/auth/login', (route) => route.continue())
    await page.route('**/api/v1/businesses/**', (route) => route.continue())
    
    // This test will use real backend responses
    await loginUser(page)
    
    // Test health check endpoint
    const response = await page.request.get('http://localhost:8000/health')
    expect(response.status()).toBe(200)
    
    const healthData = await response.json()
    expect(healthData).toHaveProperty('status', 'healthy')
    expect(healthData).toHaveProperty('version')
  })

  test('should handle real-time AI processing', async ({ page }) => {
    await loginUser(page)
    
    // Mock streaming AI response
    await page.route('**/api/v1/analysis/analyze/**', (route) => {
      // Simulate streaming response
      route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        body: `data: {"status": "processing", "progress": 25}

data: {"status": "processing", "progress": 50}

data: {"status": "processing", "progress": 75}

data: {"status": "complete", "progress": 100, "result": {"lead_score": 88}}

`
      })
    })

    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', businessSearchData.query)
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    await page.click('.business-card:first-child input[type="checkbox"]')
    await page.click('button:has-text("Analyze")')

    // Should show progress indicators
    await expect(page.locator('.progress, .loading')).toBeVisible()
    await expect(page.locator('text=/processing|analyzing/i')).toBeVisible()
    
    // Eventually show final results
    await expect(page.locator('text=/88/')).toBeVisible({ timeout: 10000 })
  })
})
