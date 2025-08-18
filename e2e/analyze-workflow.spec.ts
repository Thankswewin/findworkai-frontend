import { test, expect } from '@playwright/test';

test.describe('Analyze-First Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard before each test
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForSelector('h2:has-text("Search Leads")');
  });

  test('should disable AI buttons before analysis', async ({ page }) => {
    // Search for businesses
    await page.fill('#search-query', 'hotels');
    await page.fill('#location', 'Abuja');
    await page.click('button:has-text("Search Businesses")');

    // Wait for business cards to appear
    await page.waitForSelector('[data-testid="enhanced-business-card"]');

    // Get the first business card
    const firstCard = page.locator('[data-testid="enhanced-business-card"]').first();

    // Check that AI buttons are disabled
    await expect(firstCard.locator('button:has-text("Build Website")')).toBeDisabled();
    await expect(firstCard.locator('button:has-text("Content Kit")')).toBeDisabled();
    await expect(firstCard.locator('button:has-text("Marketing Campaign")')).toBeDisabled();
  });

  test('should enable AI buttons after successful analysis', async ({ page }) => {
    // Search for businesses
    await page.fill('#search-query', 'hotels');
    await page.fill('#location', 'Abuja');
    await page.click('button:has-text("Search Businesses")');

    // Wait for business cards to appear
    await page.waitForSelector('[data-testid="enhanced-business-card"]');

    // Get the first business card
    const firstCard = page.locator('[data-testid="enhanced-business-card"]').first();

    // Click the analyze button
    await firstCard.locator('button:has-text("Analyze")').click();

    // Wait for the analysis to complete (check for the re-analyze button)
    await firstCard.locator('button:has-text("Re-Analyze")').waitFor();

    // Check that AI buttons are now enabled
    await expect(firstCard.locator('button:has-text("Build Website")')).toBeEnabled();
    await expect(firstCard.locator('button:has-text("Content Kit")')).toBeEnabled();
    await expect(firstCard.locator('button:has-text("Marketing Campaign")')).toBeEnabled();
  });
});
