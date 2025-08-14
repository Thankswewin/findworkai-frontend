import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    
    // Check for email input
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/login')
    
    // Click submit without filling form
    await page.locator('button[type="submit"]').click()
    
    // Should show validation errors
    await expect(page.locator('text=/email.*required/i')).toBeVisible()
    await expect(page.locator('text=/password.*required/i')).toBeVisible()
  })

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Submit form
    await page.locator('button[type="submit"]').click()
    
    // Should show error message
    await expect(page.locator('text=/invalid.*credentials/i')).toBeVisible()
  })

  test.skip('should login with valid credentials', async ({ page }) => {
    // This test requires a test account and backend
    await page.goto('/login')
    
    // Fill in valid credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    
    // Submit form
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Should show user menu
    await expect(page.locator('text=/test@example.com/i')).toBeVisible()
  })

  test.skip('should logout successfully', async ({ page }) => {
    // This test requires authentication
    // First login (setup would handle this in real scenario)
    await page.goto('/dashboard')
    
    // Click user menu
    await page.locator('button:has-text("User")').click()
    
    // Click logout
    await page.locator('text="Log out"').click()
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })
})
