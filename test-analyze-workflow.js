const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Starting Analyze-First Workflow Test...\n');

    // Navigate to the search page
    console.log('1. Navigating to search page...');
    await page.goto('http://localhost:3000/dashboard/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Search for businesses
    console.log('2. Searching for hotels in Abuja...');
    await page.fill('input[placeholder*="restaurants"]', 'hotels');
    await page.fill('input[placeholder*="San Francisco"]', 'Abuja');
    await page.click('button:has-text("Search Businesses")');

    // Wait for results
    console.log('3. Waiting for search results...');
    await page.waitForSelector('text=/Search Results/i', { timeout: 10000 });
    await page.waitForTimeout(2000); // Give time for cards to render

    // Check if AI buttons are disabled initially
    console.log('4. Checking if AI buttons are disabled before analysis...');
    
    const quickWebsiteButton = await page.locator('button:has-text("Quick Website")').first();
    const buildWebsiteButton = await page.locator('button:has(svg) >> text=/Build Website|Website/i').first();
    const contentKitButton = await page.locator('button:has(svg) >> text=/Content Kit/i').first();
    const marketingButton = await page.locator('button:has(svg) >> text=/Marketing Campaign/i').first();

    // Check if buttons exist and their state
    let buttonsFound = false;
    
    if (await buildWebsiteButton.count() > 0) {
      const isDisabled = await buildWebsiteButton.isDisabled();
      console.log(`   ✓ Build Website button: ${isDisabled ? '🔒 DISABLED' : '❌ ENABLED (should be disabled!)'}`);
      buttonsFound = true;
    }

    if (await contentKitButton.count() > 0) {
      const isDisabled = await contentKitButton.isDisabled();
      console.log(`   ✓ Content Kit button: ${isDisabled ? '🔒 DISABLED' : '❌ ENABLED (should be disabled!)'}`);
      buttonsFound = true;
    }

    if (await marketingButton.count() > 0) {
      const isDisabled = await marketingButton.isDisabled();
      console.log(`   ✓ Marketing Campaign button: ${isDisabled ? '🔒 DISABLED' : '❌ ENABLED (should be disabled!)'}`);
      buttonsFound = true;
    }

    if (!buttonsFound) {
      console.log('   ⚠️  No AI action buttons found. They might be using different text.');
    }

    // Now click the Analyze button
    console.log('\n5. Clicking Analyze button...');
    const analyzeButton = await page.locator('button:has-text("Analyze")').first();
    if (await analyzeButton.count() > 0) {
      await analyzeButton.click();
      console.log('   ✓ Analyze button clicked');
      
      // Wait for analysis to complete (look for "Re-Analyze" or "Analyzing..." to disappear)
      console.log('6. Waiting for analysis to complete...');
      try {
        await page.waitForSelector('button:has-text("Re-Analyze")', { timeout: 30000 });
        console.log('   ✓ Analysis completed (Re-Analyze button appeared)');
      } catch {
        console.log('   ⚠️  Analysis might still be running or failed');
      }

      // Check if buttons are now enabled
      console.log('\n7. Checking if AI buttons are enabled after analysis...');
      await page.waitForTimeout(1000);

      if (await buildWebsiteButton.count() > 0) {
        const isDisabled = await buildWebsiteButton.isDisabled();
        console.log(`   ✓ Build Website button: ${isDisabled ? '❌ STILL DISABLED (should be enabled!)' : '✅ ENABLED'}`);
      }

      if (await contentKitButton.count() > 0) {
        const isDisabled = await contentKitButton.isDisabled();
        console.log(`   ✓ Content Kit button: ${isDisabled ? '❌ STILL DISABLED (should be enabled!)' : '✅ ENABLED'}`);
      }

      if (await marketingButton.count() > 0) {
        const isDisabled = await marketingButton.isDisabled();
        console.log(`   ✓ Marketing Campaign button: ${isDisabled ? '❌ STILL DISABLED (should be enabled!)' : '✅ ENABLED'}`);
      }
    } else {
      console.log('   ❌ No Analyze button found!');
    }

    // Take a screenshot for evidence
    await page.screenshot({ path: 'analyze-workflow-test.png' });
    console.log('\n📸 Screenshot saved as analyze-workflow-test.png');

    console.log('\n✅ Test completed! Check the results above.');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved as error-screenshot.png');
  } finally {
    // Keep browser open for 5 seconds to see the result
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
