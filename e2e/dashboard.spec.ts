import { test, expect } from '@playwright/test'

test.describe('Dashboard Pages', () => {
  // Skip authentication check for now since auth is not fully implemented
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state if needed
    await page.goto('/dashboard')
  })

  test('should display main dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for dashboard elements
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to AI Agent page', async ({ page }) => {
    await page.goto('/dashboard/ai-agent')
    
    // Check if AI Agent page loads
    await expect(page).toHaveURL(/.*ai-agent/)
    
    // Look for AI Agent specific content
    const aiContent = page.locator('text=/ai|agent|build/i').first()
    await expect(aiContent).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to Analytics page', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    await expect(page).toHaveURL(/.*analytics/)
    
    // Check for analytics-specific elements
    const analyticsContent = page.locator('text=/analytics|metrics|data/i').first()
    await expect(analyticsContent).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to Campaigns page', async ({ page }) => {
    await page.goto('/dashboard/campaigns')
    
    await expect(page).toHaveURL(/.*campaigns/)
    
    // Check for campaign-specific elements
    const campaignContent = page.locator('text=/campaign|email|outreach/i').first()
    await expect(campaignContent).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to Advanced Search page', async ({ page }) => {
    await page.goto('/dashboard/advanced-search')
    
    await expect(page).toHaveURL(/.*advanced-search/)
    
    // Check for search-specific elements
    const searchContent = page.locator('text=/search|filter|find/i').first()
    await expect(searchContent).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ]

  viewports.forEach(({ name, width, height }) => {
    test(`should be responsive on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/dashboard')
      
      // Check that main content is visible
      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()
      
      // Check navigation visibility
      if (width < 768) {
        // Mobile: navigation might be in a hamburger menu
        const mobileMenu = page.locator('button[aria-label*="menu" i]')
        if (await mobileMenu.isVisible()) {
          await mobileMenu.click()
        }
      }
      
      // Take screenshot for visual regression testing
      await page.screenshot({ 
        path: `test-results/responsive-${name.toLowerCase()}.png`,
        fullPage: true 
      })
    })
  })
})

test.describe('Performance', () => {
  test('should load dashboard quickly', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/dashboard', { waitUntil: 'networkidle' })
    
    const loadTime = Date.now() - startTime
    
    // Dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      }
    })
    
    // DOM should be ready quickly
    expect(metrics.domContentLoaded).toBeLessThan(1500)
    expect(metrics.loadComplete).toBeLessThan(2500)
  })

  test('should handle slow network gracefully', async ({ page }) => {
    // Simulate slow 3G network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100)
    })
    
    await page.goto('/dashboard')
    
    // Should show loading states
    const loadingIndicator = page.locator('[aria-label*="loading" i], .loading, .spinner').first()
    
    // Content should eventually appear even on slow network
    const content = page.locator('main, [role="main"]').first()
    await expect(content).toBeVisible({ timeout: 15000 })
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim()
      }))
    })
    
    // Verify heading levels don't skip (e.g., h1 -> h3)
    for (let i = 1; i < headings.length; i++) {
      const levelDiff = headings[i].level - headings[i - 1].level
      expect(levelDiff).toBeLessThanOrEqual(1)
    }
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toHaveCount(1)
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    expect(await nav.count()).toBeGreaterThan(0)
    
    // Check that interactive elements have accessible names
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const hasText = await button.textContent()
      const hasAriaLabel = await button.getAttribute('aria-label')
      const hasAriaLabelledBy = await button.getAttribute('aria-labelledby')
      
      // Button should have either text content or ARIA label
      expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Start from the top of the page
    await page.keyboard.press('Tab')
    
    // First focused element should be visible
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        isVisible: el ? window.getComputedStyle(el).visibility !== 'hidden' : false
      }
    })
    
    expect(firstFocused.isVisible).toBe(true)
    
    // Tab through first 10 interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      
      const focused = await page.evaluate(() => {
        const el = document.activeElement
        return {
          tagName: el?.tagName,
          hasTabIndex: el?.hasAttribute('tabindex'),
          isInteractive: ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el?.tagName || '')
        }
      })
      
      // Focused element should be interactive or have explicit tabindex
      expect(focused.isInteractive || focused.hasTabIndex).toBe(true)
    }
  })
})

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page')
    
    // Should show 404 error page
    const errorMessage = page.locator('text=/404|not found|doesn\'t exist/i')
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 })
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return errors
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    await page.goto('/dashboard')
    
    // Should show error state or fallback content
    const errorState = page.locator('text=/error|retry|failed|unable/i').first()
    
    // Give the page time to make API calls and show error state
    await page.waitForTimeout(2000)
    
    // Check if any error indication is visible
    const hasError = await errorState.isVisible().catch(() => false)
    
    // Page should still be functional despite API errors
    const mainContent = page.locator('main, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })

  test('should handle network offline gracefully', async ({ context, page }) => {
    await page.goto('/dashboard')
    
    // Go offline
    await context.setOffline(true)
    
    // Try to navigate
    await page.click('a[href*="analytics"]').catch(() => {
      // Click might fail if link doesn't exist, that's ok
    })
    
    // Should show offline indicator or handle gracefully
    await page.waitForTimeout(1000)
    
    // Page should still be visible
    await expect(page).toHaveTitle(/.+/)
    
    // Go back online
    await context.setOffline(false)
  })
})
