const { chromium } = require('playwright');

async function testCompleteUserWorkflow() {
  console.log('🚀 Starting Complete User Workflow Test');
  console.log('📋 Simulating: Search → Select Business → Build Website → Verify Save\n');

  const browser = await chromium.launch({
    headless: false, // Show browser for visual testing
    slowMo: 500 // Slow down for better visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 }
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to dashboard
    console.log('📍 Step 1: Navigating to dashboard...');
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ Dashboard loaded');

    // Step 2: Go to search page to find businesses
    console.log('\n📍 Step 2: Going to business search...');

    // Look for and click on search leads
    const searchLeadsLink = await page.locator('text=Search Leads').first();
    if (await searchLeadsLink.isVisible()) {
      await searchLeadsLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to search page');
    } else {
      console.log('⚠️ Search Leads not found, trying navigation...');
      await page.goto('http://localhost:3001/dashboard/search');
      await page.waitForLoadState('networkidle');
    }

    // Step 3: Look for business cards or categories
    console.log('\n📍 Step 3: Looking for businesses...');

    // Wait a bit for content to load
    await page.waitForTimeout(3000);

    // Look for business cards
    const businessCards = await page.locator('[class*="business"], [class*="card"], .card').all();
    console.log(`Found ${businessCards.length} potential business cards`);

    if (businessCards.length === 0) {
      console.log('⚠️ No business cards found. Looking for category buttons...');

      // Look for category buttons
      const categoryButtons = await page.locator('button:has-text("restaurant"), button:has-text("Restaurant")').all();
      if (categoryButtons.length > 0) {
        console.log('✅ Found restaurant category button');
        await categoryButtons[0].click();
        await page.waitForTimeout(3000);
      } else {
        console.log('⚠️ No category buttons found. Checking for existing content...');

        // Look for any existing businesses in the UI
        const existingBusinesses = await page.locator('text=hotel, text=restaurant, text=law firm, text=dentist').all();
        if (existingBusinesses.length > 0) {
          console.log(`✅ Found ${existingBusinesses.length} existing business references`);
        } else {
          console.log('⚠️ No businesses found. Creating mock business for testing...');
          await page.evaluate(() => {
            // Create a mock business card for testing
            const mockCard = document.createElement('div');
            mockCard.className = 'mock-business-card';
            mockCard.innerHTML = `
              <div style="border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px; cursor: pointer; background: #f0f9ff;">
                <h3 style="color: #1e40af; margin-bottom: 10px;">Test Restaurant</h3>
                <p style="color: #64748b;">Restaurant • New York, NY</p>
                <p style="color: #64748b;">Rating: 4.5 stars</p>
                <button id="mock-build-btn" style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 4px; margin-top: 10px;">
                  Build Website
                </button>
              </div>
            `;
            document.body.appendChild(mockCard);
          });
          console.log('✅ Created mock business for testing');
        }
      }
    }

    // Step 4: Select a business and try to build website
    console.log('\n📍 Step 4: Selecting business and building website...');

    // Try different selectors to find business elements
    let businessElement = null;
    let businessName = 'Unknown Business';

    // Try to find business cards first
    if (businessCards.length > 0) {
      businessElement = businessCards[0];
      const businessText = await businessElement.textContent();
      console.log(`✅ Selected business card: ${businessText?.substring(0, 50)}...`);
      businessName = businessText?.split('\n')[0] || 'Selected Business';
    } else {
      // Try mock business
      const mockCard = await page.locator('.mock-business-card').first();
      if (await mockCard.isVisible()) {
        businessElement = mockCard;
        businessName = 'Test Restaurant';
        console.log('✅ Using mock business for testing');
      }
    }

    if (!businessElement) {
      throw new Error('Could not find any business to test with');
    }

    // Click on the business
    await businessElement.click();
    await page.waitForTimeout(1000);

    // Look for "Build Website" button
    console.log('📍 Looking for "Build Website" button...');

    const buildButtons = await page.locator('text=Build Website').all();
    if (buildButtons.length === 0) {
      // Try the mock button
      const mockButton = await page.locator('#mock-build-btn').first();
      if (await mockButton.isVisible()) {
        await mockButton.click();
        console.log('✅ Clicked mock build button');
      } else {
        throw new Error('No Build Website button found');
      }
    } else {
      await buildButtons[0].click();
      console.log('✅ Clicked Build Website button');
    }

    // Step 5: Handle AI Builder Modal
    console.log('\n📍 Step 5: Handling AI Builder modal...');

    await page.waitForTimeout(2000);

    // Look for AI Builder modal
    const modalVisible = await page.locator('text=AI Website Builder, text=AI Content Generator, text=AI Marketing Kit').first().isVisible();

    if (!modalVisible) {
      console.log('⚠️ AI Builder modal not immediately visible, waiting...');
      await page.waitForTimeout(3000);
    }

    // Check if we need to choose between background and live mode
    const backgroundModeBtn = await page.locator('text=Background Mode').first();
    const liveModeBtn = await page.locator('text=Live Mode').first();

    if (await backgroundModeBtn.isVisible() && await liveModeBtn.isVisible()) {
      console.log('✅ Found mode selection buttons');

      // Choose background mode for testing
      await backgroundModeBtn.click();
      console.log('✅ Selected Background Mode');
      await page.waitForTimeout(1000);
    }

    // Look for "Start Building" button
    const startBuildBtn = await page.locator('text=Start Building').first();
    if (await startBuildBtn.isVisible()) {
      console.log('✅ Found Start Building button');

      // Check if API key warning is present
      const apiKeyWarning = await page.locator('text=API Key Required').first();
      if (await apiKeyWarning.isVisible()) {
        console.log('⚠️ API Key warning detected. Build may not work without proper configuration.');
      }

      // Try to start building
      console.log('📍 Step 6: Starting AI build process...');
      await startBuildBtn.click();
      console.log('✅ Clicked Start Building');

      // Wait for build to start
      await page.waitForTimeout(3000);

      // Look for progress indicators
      const progressVisible = await page.locator('text=Connecting to AI service, text=AI generating content, text=Building...').first().isVisible();

      if (progressVisible) {
        console.log('✅ Build process started - progress indicators visible');

        // Look for floating widget (if in background mode)
        const floatingWidget = await page.locator('text=Building in background').first();
        if (await floatingWidget.isVisible()) {
          console.log('✅ Background mode active - floating widget visible');
        }

        // Wait for a reasonable time for AI generation
        console.log('⏳ Waiting for AI generation to complete (this may take 2-3 minutes)...');

        // Check progress periodically
        let attempts = 0;
        const maxAttempts = 30; // 30 attempts = 2.5 minutes

        while (attempts < maxAttempts) {
          await page.waitForTimeout(5000); // Wait 5 seconds

          // Check for completion
          const completedText = await page.locator('text=completed successfully, text=Build Complete, text=Complete!').first();
          const errorText = await page.locator('text=Build Failed, text=Error, text=failed').first();

          if (await completedText.isVisible()) {
            console.log('✅ AI generation completed successfully!');
            break;
          }

          if (await errorText.isVisible()) {
            console.log('❌ AI generation failed');
            const errorDetails = await page.locator('[class*="error"], [class*="destructive"]').first().textContent();
            console.log(`Error details: ${errorDetails}`);
            break;
          }

          attempts++;
          console.log(`⏳ Still generating... (${attempts}/${maxAttempts})`);
        }

        if (attempts >= maxAttempts) {
          console.log('⚠️ Build taking longer than expected, but continuing test...');
        }

      } else {
        console.log('⚠️ No progress indicators found - build may not have started properly');
      }

    } else {
      console.log('⚠️ Start Building button not found');
    }

    // Step 6: Check for completion and save functionality
    console.log('\n📍 Step 7: Checking completion and save functionality...');

    // Look for completion indicators
    const completed = await page.locator('text=completed successfully, text=View Result, text=Download').first().isVisible();

    if (completed) {
      console.log('✅ Build appears to be completed');

      // Look for save notifications
      await page.waitForTimeout(2000);

      // Check if anything was saved to localStorage
      const savedContent = await page.evaluate(() => {
        const content = localStorage.getItem('findworkai_user_projects_guest');
        return content ? JSON.parse(content) : null;
      });

      if (savedContent && savedContent.length > 0) {
        console.log(`✅ Found ${savedContent.length} saved project(s) in localStorage`);
        console.log('Sample saved project:', savedContent[0]);
      } else {
        console.log('⚠️ No saved projects found in localStorage');
      }

      // Try to view/download if buttons are available
      const viewBtn = await page.locator('text=View Result, text=View').first();
      if (await viewBtn.isVisible()) {
        console.log('✅ View button available');
        // await viewBtn.click();
        // await page.waitForTimeout(2000);
      }

    } else {
      console.log('⚠️ Build completion not detected');
    }

    // Step 7: Navigate to "Your Content" page to verify save
    console.log('\n📍 Step 8: Navigating to Your Content page to verify save...');

    const yourContentLink = await page.locator('text=Your Content').first();
    if (await yourContentLink.isVisible()) {
      await yourContentLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to Your Content page');

      // Check if any content is displayed
      const contentVisible = await page.locator('text=Your Projects, text=Generated, text=Website, text=Content').first().isVisible();

      if (contentVisible) {
        console.log('✅ Content page appears to have content');

        // Look for specific project cards
        const projectCards = await page.locator('[class*="card"]').all();
        console.log(`Found ${projectCards.length} content cards`);

        if (projectCards.length > 0) {
          const firstCardContent = await projectCards[0].textContent();
          console.log('First content card preview:', firstCardContent?.substring(0, 100));
        }

      } else {
        console.log('⚠️ No content visible in Your Content page');

        // Check for empty state message
        const emptyState = await page.locator('text=No projects found, text=Start discovering opportunities').first();
        if (await emptyState.isVisible()) {
          console.log('ℹ️ Empty state message shown - no content saved yet');
        }
      }

    } else {
      console.log('⚠️ Your Content link not found');
      // Try direct navigation
      await page.goto('http://localhost:3001/dashboard/user-content');
      await page.waitForLoadState('networkidle');
      console.log('✅ Navigated directly to Your Content page');
    }

    // Step 8: Final verification
    console.log('\n📍 Step 9: Final verification...');

    // Check localStorage one more time
    const finalContent = await page.evaluate(() => {
      const projects = localStorage.getItem('findworkai_user_projects_guest');
      const buildingTasks = localStorage.getItem('ai_building_tasks');

      return {
        projects: projects ? JSON.parse(projects) : null,
        buildingTasks: buildingTasks ? JSON.parse(buildingTasks) : null
      };
    });

    console.log('📊 Final localStorage contents:');
    console.log(`- Projects: ${finalContent.projects ? finalContent.projects.length : 0} items`);
    console.log(`- Building tasks: ${finalContent.buildingTasks ? finalContent.buildingTasks.length : 0} items`);

    if (finalContent.projects && finalContent.projects.length > 0) {
      console.log('✅ SUCCESS: Content was saved to user history!');
      console.log('Sample project:', {
        name: finalContent.projects[0].businessName,
        type: finalContent.projects[0].artifacts?.[0]?.type,
        createdAt: finalContent.projects[0].createdAt
      });
    } else {
      console.log('❌ ISSUE: No content was saved to user history');
    }

    // Take final screenshot
    await page.screenshot({ path: 'workflow-test-final.png' });

    console.log('\n🎉 Workflow Test Completed!');
    console.log('📸 Final screenshot saved as workflow-test-final.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'workflow-test-error.png' });
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
const fs = require('fs');
const screenshotDir = 'workflow-test-screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

// Run the test
testCompleteUserWorkflow().catch(console.error);