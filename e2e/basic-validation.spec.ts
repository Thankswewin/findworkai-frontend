import { test, expect } from '@playwright/test'

test.describe('Basic Setup Validation', () => {
  test('should redirect homepage to login', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
    
    // Should have the correct title
    await expect(page).toHaveTitle(/FindWorkAI/i)
  })

  test('should connect to backend health endpoint', async ({ page }) => {
    // Test backend connectivity
    const response = await page.request.get('http://localhost:8000/health')
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('status', 'healthy')
  })

  test('should load login page with form elements', async ({ page }) => {
    await page.goto('/login')
    
    // Should have the correct title
    await expect(page).toHaveTitle(/FindWorkAI/i)
    
    // Should have login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Should have FindWorkAI branding
    await expect(page.locator('text=/Welcome back to FindWorkAI/i')).toBeVisible()
    await expect(page.locator('text=/Sign in with Google/i')).toBeVisible()
  })
  
  test('should show proper login page structure', async ({ page }) => {
    await page.goto('/login')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Check for main elements
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    
    // Check for Pheelymon attribution
    await expect(page.locator('text=/Created by.*Pheelymon/i')).toBeVisible()
  })
})
