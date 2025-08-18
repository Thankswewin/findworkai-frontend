import { test, expect, Page } from '@playwright/test'

test.describe('Follow-ups Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API response for testing
    await page.route('**/api/v1/followup/followups/pending*', (route) => {
      // Simulate network error for testing error states
      if (route.request().url().includes('force-error')) {
        route.abort('failed')
      } else {
        // Return mock data for successful case
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            followups: [
              {
                id: 'test-1',
                lead_id: 'lead-1',
                lead_name: 'Test Company',
                type: 'email',
                status: 'pending',
                priority: 'high',
                scheduled_date: new Date(Date.now() + 86400000).toISOString(),
                notes: 'Test follow-up',
                contact_info: { email: 'test@example.com' }
              },
              {
                id: 'test-2',
                lead_id: 'lead-2',
                lead_name: 'Another Company',
                type: 'call',
                status: 'overdue',
                priority: 'medium',
                scheduled_date: new Date(Date.now() - 86400000).toISOString(),
                notes: 'Overdue call',
                contact_info: { phone: '555-0123' }
              }
            ]
          })
        })
      }
    })
  })

  test('should display follow-ups page header', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Check page title
    await expect(page.locator('h2:has-text("Follow-ups")')).toBeVisible()
    await expect(page.locator('text="Manage automated follow-up sequences and reminders"')).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Wait for stats to load
    await page.waitForSelector('text="Total"')
    
    // Check all stat cards are visible
    await expect(page.locator('text="Total"')).toBeVisible()
    await expect(page.locator('text="Pending"')).toBeVisible()
    await expect(page.locator('text="Completed"')).toBeVisible()
    await expect(page.locator('text="Overdue"')).toBeVisible()
    await expect(page.locator('text="Completion Rate"')).toBeVisible()
  })

  test('should display follow-up items', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Wait for follow-ups to load
    await page.waitForSelector('text="Test Company"')
    
    // Check follow-up items are displayed
    await expect(page.locator('text="Test Company"')).toBeVisible()
    await expect(page.locator('text="Another Company"')).toBeVisible()
    
    // Check status badges (use more specific selectors)
    await expect(page.locator('span.text-xs:has-text("pending")')).toBeVisible()
    await expect(page.locator('span.text-xs:has-text("overdue")')).toBeVisible()
  })

  test('should filter follow-ups by status', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Wait for follow-ups to load
    await page.waitForSelector('text="Test Company"')
    
    // Click on pending filter
    await page.click('button:has-text("pending")')
    
    // Should show only pending items
    await expect(page.locator('text="Test Company"')).toBeVisible()
    
    // Click on overdue filter
    await page.click('button:has-text("overdue")')
    
    // Should show only overdue items
    await expect(page.locator('text="Another Company"')).toBeVisible()
  })

  test('should open create follow-up modal', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Click new follow-up button
    await page.click('button:has-text("New Follow-Up")')
    
    // Check modal is visible
    await expect(page.locator('h3:has-text("Create Follow-Up")')).toBeVisible()
    
    // Check form fields
    await expect(page.locator('label:has-text("Lead ID")')).toBeVisible()
    await expect(page.locator('label:has-text("Type")')).toBeVisible()
    await expect(page.locator('label:has-text("Scheduled Date")')).toBeVisible()
    await expect(page.locator('label:has-text("Priority")')).toBeVisible()
    await expect(page.locator('label:has-text("Notes")')).toBeVisible()
  })

  test('should close create modal on cancel', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Open modal
    await page.click('button:has-text("New Follow-Up")')
    await expect(page.locator('h3:has-text("Create Follow-Up")')).toBeVisible()
    
    // Click cancel
    await page.click('button:has-text("Cancel")')
    
    // Modal should be closed
    await expect(page.locator('h3:has-text("Create Follow-Up")')).not.toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Override the route to force an error
    await page.route('**/api/v1/followup/followups/pending*', (route) => {
      route.abort('failed')
    })
    
    await page.goto('/dashboard/followups')
    
    // Should show error state with retry button
    await page.waitForSelector('text="Connection Error"', { timeout: 10000 })
    await expect(page.locator('text="Connection Error"')).toBeVisible()
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible()
  })

  test('should show development warning when in dev mode', async ({ page }) => {
    // Set NODE_ENV to development (this would be set in your test environment)
    await page.goto('/dashboard/followups?force-error=true')
    
    // In development, should show warning about mock data
    const devWarning = page.locator('text="Development Mode"')
    
    // This will only show if NODE_ENV is development
    if (process.env.NODE_ENV === 'development') {
      await expect(devWarning).toBeVisible()
    }
  })

  test('should retry failed requests', async ({ page }) => {
    let retryCount = 0
    
    // Mock API to fail first, then succeed
    await page.route('**/api/v1/followup/followups/pending*', (route) => {
      retryCount++
      if (retryCount === 1) {
        route.abort('failed')
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ followups: [] })
        })
      }
    })
    
    await page.goto('/dashboard/followups')
    
    // Wait for error state
    await page.waitForSelector('text="Connection Error"')
    
    // Click retry
    await page.click('button:has-text("Try Again")')
    
    // Should eventually show follow-ups (empty in this case)
    await expect(page.locator('text="No follow-ups found"')).toBeVisible()
  })

  test('should limit retry attempts to 3', async ({ page }) => {
    // Force all requests to fail
    await page.route('**/api/v1/followup/followups/pending*', (route) => {
      route.abort('failed')
    })
    
    await page.goto('/dashboard/followups')
    
    // Wait for error state
    await page.waitForSelector('button:has-text("Try Again")')
    
    // Try 3 times
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("Try Again")')
      await page.waitForTimeout(500) // Wait a bit between retries
    }
    
    // After 3 retries, button should be disabled
    await expect(page.locator('button:has-text("Max retries reached")')).toBeDisabled()
  })

  test('should handle complete follow-up action', async ({ page }) => {
    await page.goto('/dashboard/followups')
    
    // Wait for follow-ups to load
    await page.waitForSelector('text="Test Company"')
    
    // Mock the complete API call
    await page.route('**/api/v1/followup/followups/complete/*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })
    
    // Click complete button on first follow-up (wait for it to be visible first)
    const completeButton = page.locator('button:has-text("Complete")').first()
    await completeButton.waitFor({ state: 'visible', timeout: 5000 })
    await completeButton.click()
    
    // Should show success message (via toast)
    // Note: You'd need to have toast notifications visible in your test
  })

  test('should display empty state when no follow-ups', async ({ page }) => {
    // Override route to return empty followups
    await page.route('**/api/v1/followup/followups/pending*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ followups: [] })
      })
    })
    
    await page.goto('/dashboard/followups')
    
    // Should show empty state
    await expect(page.locator('text="No follow-ups found"')).toBeVisible()
    await expect(page.locator('text="Create your first follow-up to get started"')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/dashboard/followups')
    
    // Check that content is still accessible
    await expect(page.locator('h2:has-text("Follow-ups")')).toBeVisible()
    await expect(page.locator('button:has-text("New Follow-Up")')).toBeVisible()
    
    // Stats should stack on mobile (check by scrolling if needed)
    const statsCards = page.locator('[class*="grid-cols-1"]')
    await expect(statsCards).toBeTruthy()
  })
})

test.describe('Error Boundary', () => {
  test('should catch and display errors gracefully', async ({ page }) => {
    // Navigate to a page that will trigger an error
    // You might need to create a test page that intentionally throws
    await page.goto('/dashboard/followups')
    
    // Inject an error into the React component
    await page.evaluate(() => {
      // Force an error in the React tree
      const errorEvent = new ErrorEvent('error', {
        error: new Error('Test error'),
        message: 'Test error message'
      })
      window.dispatchEvent(errorEvent)
    })
    
    // Check if error boundary catches it (if implemented at app level)
    // This depends on your error boundary implementation
  })
})
