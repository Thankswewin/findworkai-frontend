import { test, expect, Page } from '@playwright/test'

// Performance testing helpers
class PerformanceMonitor {
  private metrics: { [key: string]: number } = {}
  
  startTiming(operation: string): void {
    this.metrics[`${operation}_start`] = performance.now()
  }
  
  endTiming(operation: string): number {
    const startTime = this.metrics[`${operation}_start`]
    if (!startTime) throw new Error(`No start time recorded for ${operation}`)
    
    const duration = performance.now() - startTime
    this.metrics[operation] = duration
    return duration
  }
  
  getDuration(operation: string): number {
    return this.metrics[operation] || 0
  }
  
  getAllMetrics(): { [key: string]: number } {
    return { ...this.metrics }
  }
}

async function mockHighVolumeAPIs(page: Page) {
  // Mock high-volume business search
  await page.route('**/api/v1/businesses/search', (route) => {
    const businesses = Array.from({ length: 1000 }, (_, i) => ({
      id: `biz-${i.toString().padStart(4, '0')}`,
      name: `Business ${i + 1}`,
      address: `${100 + i} Main St, City ${Math.floor(i / 100)}, NY`,
      phone: `+1-555-${String(i).padStart(3, '0')}-${String(1000 + i).slice(-4)}`,
      website: `https://business${i}.com`,
      rating: 2.0 + Math.random() * 3,
      review_count: Math.floor(Math.random() * 1000) + 10,
      category: ['Restaurant', 'Retail', 'Service', 'Healthcare'][i % 4],
      coordinates: { 
        lat: 40.7128 + (Math.random() - 0.5) * 0.1, 
        lng: -74.0060 + (Math.random() - 0.5) * 0.1 
      }
    }))

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        businesses: businesses.slice(0, 50), // Paginated response
        total: businesses.length,
        page: 1,
        per_page: 50,
        total_pages: Math.ceil(businesses.length / 50)
      })
    })
  })

  // Mock batch AI analysis
  await page.route('**/api/v1/analysis/bulk-analyze', (route) => {
    const analysisResults = Array.from({ length: 50 }, (_, i) => ({
      business_id: `biz-${i.toString().padStart(4, '0')}`,
      analysis: {
        lead_score: Math.floor(Math.random() * 100),
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        processing_time_ms: Math.floor(Math.random() * 5000) + 1000
      }
    }))

    // Simulate processing delay
    setTimeout(() => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: analysisResults,
          batch_id: `batch_${Date.now()}`,
          processed_at: new Date().toISOString(),
          processing_time_total_ms: Math.max(...analysisResults.map(r => r.analysis.processing_time_ms))
        })
      })
    }, 2000)
  })

  // Mock authentication
  await page.route('**/api/v1/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'performance_test_token',
        user: { id: 'perf-user', subscription_plan: 'enterprise' }
      })
    })
  })
}

async function loginUser(page: Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'performance@test.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/dashboard/)
}

test.describe('AI Agent Performance Tests', () => {
  let perfMonitor: PerformanceMonitor

  test.beforeEach(async ({ page }) => {
    perfMonitor = new PerformanceMonitor()
    await mockHighVolumeAPIs(page)
  })

  test('should handle large business search results efficiently', async ({ page }) => {
    await loginUser(page)
    
    perfMonitor.startTiming('search_page_load')
    await page.click('a[href*="search"]')
    await page.waitForLoadState('networkidle')
    perfMonitor.endTiming('search_page_load')

    // Perform search
    perfMonitor.startTiming('search_execution')
    await page.fill('input[name="query"]', 'test businesses')
    await page.click('button[type="submit"]')
    await page.waitForSelector('.business-card', { timeout: 10000 })
    perfMonitor.endTiming('search_execution')

    // Verify performance benchmarks
    expect(perfMonitor.getDuration('search_page_load')).toBeLessThan(3000)
    expect(perfMonitor.getDuration('search_execution')).toBeLessThan(5000)

    // Check if results are paginated (not all 1000 loaded at once)
    const visibleCards = await page.locator('.business-card').count()
    expect(visibleCards).toBeGreaterThan(10)
    expect(visibleCards).toBeLessThanOrEqual(50)

    // Test scrolling performance
    perfMonitor.startTiming('scroll_performance')
    await page.mouse.wheel(0, 1000)
    await page.waitForTimeout(100)
    await page.mouse.wheel(0, 1000)
    perfMonitor.endTiming('scroll_performance')

    expect(perfMonitor.getDuration('scroll_performance')).toBeLessThan(500)
  })

  test('should handle concurrent AI analysis requests', async ({ page }) => {
    await loginUser(page)
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'concurrent test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Select multiple businesses for concurrent analysis
    perfMonitor.startTiming('bulk_selection')
    for (let i = 0; i < 10; i++) {
      await page.click(`.business-card:nth-child(${i + 1}) input[type="checkbox"]`)
    }
    perfMonitor.endTiming('bulk_selection')

    // Trigger bulk AI analysis
    perfMonitor.startTiming('bulk_ai_analysis')
    await page.click('button:has-text("Analyze Selected")')
    
    // Wait for analysis to complete
    await page.waitForSelector('.analysis-results', { timeout: 30000 })
    perfMonitor.endTiming('bulk_ai_analysis')

    // Performance assertions
    expect(perfMonitor.getDuration('bulk_selection')).toBeLessThan(2000)
    expect(perfMonitor.getDuration('bulk_ai_analysis')).toBeLessThan(15000)

    // Verify all analyses completed
    const analysisCards = await page.locator('.analysis-result').count()
    expect(analysisCards).toBeGreaterThanOrEqual(10)
  })

  test('should maintain responsive UI during heavy processing', async ({ page }) => {
    await loginUser(page)
    
    // Start heavy processing task
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'heavy processing test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Select many items
    for (let i = 0; i < 20; i++) {
      await page.click(`.business-card:nth-child(${(i % 10) + 1}) input[type="checkbox"]`)
    }
    
    // Start analysis
    await page.click('button:has-text("Analyze Selected")')
    
    // Test UI responsiveness during processing
    perfMonitor.startTiming('ui_responsiveness')
    
    // Try navigation during processing
    await page.click('a[href*="dashboard"]', { timeout: 1000 })
    await expect(page).toHaveURL(/dashboard/)
    
    // Try going back
    await page.click('a[href*="search"]', { timeout: 1000 })
    
    perfMonitor.endTiming('ui_responsiveness')
    
    // UI should remain responsive
    expect(perfMonitor.getDuration('ui_responsiveness')).toBeLessThan(2000)
  })

  test('should handle memory usage efficiently with large datasets', async ({ page }) => {
    await loginUser(page)
    
    // Navigate through multiple pages of large dataset
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'memory test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Simulate browsing through many pages
    for (let pageNum = 1; pageNum <= 5; pageNum++) {
      perfMonitor.startTiming(`page_${pageNum}_load`)
      
      if (pageNum > 1) {
        await page.click('button:has-text("Next"), .pagination button:nth-child(2)')
        await page.waitForSelector('.business-card')
      }
      
      // Interact with results
      const cards = await page.locator('.business-card').count()
      expect(cards).toBeGreaterThan(0)
      
      // Click a few cards to load details
      for (let i = 0; i < Math.min(3, cards); i++) {
        await page.click(`.business-card:nth-child(${i + 1})`)
        await page.waitForSelector('.business-details, .business-modal')
        await page.press('Escape') // Close modal
      }
      
      perfMonitor.endTiming(`page_${pageNum}_load`)
      
      // Each page should load quickly
      expect(perfMonitor.getDuration(`page_${pageNum}_load`)).toBeLessThan(3000)
    }
  })

  test('should optimize API call patterns', async ({ page }) => {
    // Track API calls
    const apiCalls: string[] = []
    
    await page.route('**/api/**', (route) => {
      apiCalls.push(`${route.request().method()} ${route.request().url()}`)
      route.continue()
    })
    
    await loginUser(page)
    
    // Perform typical user workflow
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'api optimization test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Select and analyze
    await page.click('.business-card:first-child input[type="checkbox"]')
    await page.click('button:has-text("Analyze Selected")')
    
    await page.waitForTimeout(2000) // Allow API calls to complete
    
    // Analyze API call patterns
    const searchCalls = apiCalls.filter(call => call.includes('/businesses/search')).length
    const analysisCalls = apiCalls.filter(call => call.includes('/analysis/')).length
    
    // Should minimize redundant API calls
    expect(searchCalls).toBeLessThanOrEqual(2) // Initial search + maybe one refresh
    expect(analysisCalls).toBeLessThanOrEqual(2) // Should batch or cache effectively
    
    console.log('API Call Pattern:', { searchCalls, analysisCalls, total: apiCalls.length })
  })

  test('should handle network latency gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', (route) => {
      setTimeout(() => {
        route.continue()
      }, 2000) // Add 2s delay to all API calls
    })
    
    await loginUser(page)
    
    perfMonitor.startTiming('slow_network_workflow')
    
    // Perform search with slow network
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'slow network test')
    
    // Should show loading states
    await page.click('button[type="submit"]')
    await expect(page.locator('.loading, .spinner')).toBeVisible()
    
    // Eventually load results
    await page.waitForSelector('.business-card', { timeout: 15000 })
    
    perfMonitor.endTiming('slow_network_workflow')
    
    // Should handle slow network reasonably well
    expect(perfMonitor.getDuration('slow_network_workflow')).toBeLessThan(20000)
  })

  test.afterEach(async () => {
    // Log performance metrics
    const metrics = perfMonitor.getAllMetrics()
    console.log('Performance Metrics:', metrics)
    
    // Assert overall performance
    const totalOperationTime = Object.values(metrics).reduce((sum, time) => sum + time, 0)
    expect(totalOperationTime).toBeLessThan(60000) // Total test time should be reasonable
  })
})

test.describe('AI Agent Stress Tests', () => {
  test('should handle rapid user interactions', async ({ page }) => {
    await mockHighVolumeAPIs(page)
    await loginUser(page)
    
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'stress test')
    await page.click('button[type="submit"]')
    
    await page.waitForSelector('.business-card')
    
    // Rapidly click multiple elements
    const rapidClicks = async () => {
      for (let i = 0; i < 20; i++) {
        const cardIndex = (i % 10) + 1
        try {
          await page.click(`.business-card:nth-child(${cardIndex}) input[type="checkbox"]`, { timeout: 100 })
          await page.waitForTimeout(50)
        } catch (error) {
          // Some clicks might fail due to timing - that's expected in stress test
        }
      }
    }
    
    // Execute rapid clicks
    await rapidClicks()
    
    // UI should still be functional
    await expect(page.locator('.business-card')).toBeVisible()
    
    // Should be able to perform normal operation after stress
    await page.click('button:has-text("Analyze Selected")')
    await expect(page.locator('.analysis-results, .loading')).toBeVisible({ timeout: 5000 })
  })

  test('should recover from API failures', async ({ page }) => {
    let failCount = 0
    
    await page.route('**/api/v1/businesses/search', (route) => {
      failCount++
      if (failCount <= 3) {
        // Fail first 3 requests
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server overloaded' })
        })
      } else {
        // Succeed on 4th attempt
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            businesses: [{ id: 'recovery-test', name: 'Recovery Business' }],
            total: 1
          })
        })
      }
    })
    
    await loginUser(page)
    await page.click('a[href*="search"]')
    await page.fill('input[name="query"]', 'recovery test')
    await page.click('button[type="submit"]')
    
    // Should show error first
    await expect(page.locator('text=/error|failed/i')).toBeVisible()
    
    // Click retry multiple times
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Retry")')
      await page.waitForTimeout(1000)
    }
    
    // Should eventually succeed
    await expect(page.locator('text=/Recovery Business/i')).toBeVisible({ timeout: 10000 })
  })

  test('should maintain performance under concurrent user simulation', async ({ page, context }) => {
    await mockHighVolumeAPIs(page)
    
    // Simulate multiple concurrent operations
    const operations = [
      async () => {
        await loginUser(page)
        await page.click('a[href*="search"]')
        await page.fill('input[name="query"]', 'concurrent op 1')
        await page.click('button[type="submit"]')
        await page.waitForSelector('.business-card')
      },
      async () => {
        const page2 = await context.newPage()
        await mockHighVolumeAPIs(page2)
        await loginUser(page2)
        await page2.click('a[href*="dashboard"]')
        await page2.waitForLoadState('networkidle')
        await page2.close()
      },
      async () => {
        await page.click('a[href*="analytics"]')
        await page.waitForTimeout(2000)
      }
    ]
    
    // Execute all operations concurrently
    await Promise.all(operations)
    
    // Verify system is still responsive
    await expect(page.locator('body')).toBeVisible()
    await page.click('a[href*="dashboard"]')
    await expect(page).toHaveURL(/dashboard/)
  })
})
