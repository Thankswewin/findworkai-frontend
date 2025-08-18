const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down actions to see what's happening
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Simple Test - Checking AI Button States\n');

    // Navigate directly to your localhost
    console.log('1. Going to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    // Take screenshot of current page
    await page.screenshot({ path: 'current-page.png', fullPage: true });
    console.log('📸 Screenshot saved as current-page.png');

    // Check current URL
    const currentUrl = page.url();
    console.log(`2. Current URL: ${currentUrl}`);

    // Try to find and click on Search or any navigation to search
    try {
      // Look for search navigation
      await page.click('text=/Search/i', { timeout: 5000 });
      console.log('3. Clicked on Search navigation');
    } catch {
      console.log('3. Could not find Search navigation, trying direct URL...');
      await page.goto('http://localhost:3000/dashboard/search');
    }

    await page.waitForTimeout(2000);

    // Now try to find the search inputs
    console.log('4. Looking for search inputs...');
    
    // Try different selectors
    const searchInput = await page.$('input[id="search-query"]') || 
                       await page.$('input[placeholder*="restaurant"]') ||
                       await page.$('input[placeholder*="dentist"]') ||
                       await page.$('input[type="text"]');

    if (searchInput) {
      console.log('   ✓ Found search input');
      await searchInput.fill('hotels');
      
      // Find location input
      const locationInput = await page.$('input[id="location"]') || 
                           await page.$('input[placeholder*="Francisco"]') ||
                           await page.$('input[placeholder*="Location"]');
      
      if (locationInput) {
        console.log('   ✓ Found location input');
        await locationInput.fill('Abuja');
        
        // Click search button
        await page.click('button:has-text("Search")');
        console.log('   ✓ Clicked Search button');
        
        // Wait for results
        await page.waitForTimeout(5000);
        
        // Look for AI buttons
        console.log('\n5. Checking for AI buttons...');
        const buttons = await page.$$('button');
        console.log(`   Found ${buttons.length} total buttons on page`);
        
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && (text.includes('Website') || text.includes('Content') || text.includes('Marketing'))) {
            const isDisabled = await button.isDisabled();
            console.log(`   Button "${text.trim()}": ${isDisabled ? '🔒 DISABLED' : '✅ ENABLED'}`);
          }
        }
      }
    } else {
      console.log('   ❌ Could not find search inputs');
    }

    // Final screenshot
    await page.screenshot({ path: 'final-state.png', fullPage: true });
    console.log('\n📸 Final screenshot saved as final-state.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();
