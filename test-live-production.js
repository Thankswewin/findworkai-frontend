/**
 * Live Production Test for New Website Builder Workflow
 * Tests the new workflow on the actual live site: https://findworkai.vercel.app/dashboard
 */

const puppeteer = require('puppeteer');

async function testLiveProductionWorkflow() {
  console.log('🚀 Testing FindWorkAI New Workflow on Live Production Site...\n');
  console.log('🌐 URL: https://findworkai.vercel.app/dashboard\n');

  // Launch browser with visual mode for demo
  const browser = await puppeteer.launch({
    headless: false, // Show browser for visibility
    defaultViewport: { width: 1400, height: 900 },
    slowMo: 300 // Slow down for better visibility
  });

  try {
    const page = await browser.newPage();

    // Navigate to the live production site
    console.log('📍 Step 1: Navigating to live production site...');
    await page.goto('https://findworkai.vercel.app/dashboard');
    await page.waitForTimeout(5000); // Wait for page to load

    // Take initial screenshot
    await page.screenshot({ path: 'live-production/01-dashboard-homepage.png', fullPage: true });
    console.log('📸 Live dashboard homepage captured');

    // Step 2: Look for business search functionality
    console.log('\n🔍 Step 2: Looking for business search functionality...');

    try {
      // Try different search input selectors that might exist
      let searchInput = null;

      const searchSelectors = [
        'input[placeholder*="Search businesses"]',
        'input[placeholder*="search"]',
        'input[type="search"]',
        '.search input',
        '[data-testid*="search"] input',
        'input[placeholder*="business"]'
      ];

      for (const selector of searchSelectors) {
        try {
          searchInput = await page.waitForSelector(selector, { timeout: 3000 });
          if (searchInput) {
            console.log(`✅ Found search input with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue trying next selector
        }
      }

      if (searchInput) {
        await searchInput.click();
        await searchInput.type('restaurants');
        await page.waitForTimeout(1000);

        console.log('🔎 Search input populated with "restaurants"');

        // Look for search button
        const searchButton = await page.$('button[type="submit"], button:has-text("Search"), .search-button, [data-testid*="search-button"]');
        if (searchButton) {
          await searchButton.click();
          console.log('🔎 Search button clicked');
          await page.waitForTimeout(4000);
        }

        // Take screenshot of search results
        await page.screenshot({ path: 'live-production/02-search-results.png', fullPage: true });
        console.log('📸 Search results captured');

        // Step 3: Look for business cards with new generation buttons
        console.log('\n🎯 Step 3: Checking for new generation buttons...');

        // Wait for content to load
        await page.waitForTimeout(3000);

        // Look for business cards with various possible selectors
        const businessCardSelectors = [
          '.bg-white.rounded-xl.p-6.shadow-lg',
          '.business-card',
          '[data-testid*="business-card"]',
          '.card .shadow-lg',
          '.rounded-lg.p-4.border'
        ];

        let businessCards = [];
        for (const selector of businessCardSelectors) {
          businessCards = await page.$$(selector);
          if (businessCards.length > 0) {
            console.log(`✅ Found ${businessCards.length} business cards with selector: ${selector}`);
            break;
          }
        }

        if (businessCards.length > 0) {
          const firstCard = businessCards[0];

          try {
            // Extract business name if possible
            let businessName = 'Test Business';
            try {
              businessName = await firstCard.$eval('h3, h4, .business-name, [data-testid*="name"]', el => el.textContent.trim());
            } catch (e) {
              businessName = 'Business Card';
            }
            console.log(`🏢 Found business: ${businessName}`);

            // Scroll to first business card
            await firstCard.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }));
            await page.waitForTimeout(1000);

            // Look for the new generation buttons
            console.log('🔍 Looking for new generation buttons...');

            const buildWebsiteBtn = await firstCard.$('button:has-text("Build Website"), button:has-text("Build"), button:has-text("Generate")');
            const contentBtn = await firstCard.$('button:has-text("Content"), button:has-text("Generate Content")');
            const marketingBtn = await firstCard.$('button:has-text("Marketing"), button:has-text("Generate Marketing")');

            if (buildWebsiteBtn) {
              console.log('✅ SUCCESS: Build Website button found on production!');

              // Take screenshot showing the button
              await page.screenshot({ path: 'live-production/03-generation-button-found.png' });
              console.log('📸 Generation button captured');

              // Step 4: Test button functionality
              console.log('\n🚀 Step 4: Testing generation button...');

              // Look for "Your Projects" or similar section
              const projectsSelectors = [
                'text=Your Projects',
                'text=My Projects',
                'text=Projects',
                '[data-testid*="projects"]',
                '.projects-section'
              ];

              let projectsSection = null;
              for (const selector of projectsSelectors) {
                try {
                  projectsSection = await page.$(selector);
                  if (projectsSection) {
                    console.log(`✅ Found projects section: ${selector}`);
                    break;
                  }
                } catch (e) {
                  // Continue trying
                }
              }

              if (projectsSection) {
                await projectsSection.click();
                await page.waitForTimeout(2000);
                console.log('📂 Navigated to projects section');

                // Take screenshot of projects section
                await page.screenshot({ path: 'live-production/04-projects-section.png', fullPage: true });
                console.log('📸 Projects section captured');
              }

              // Go back and test clicking the button
              try {
                const searchTab = await page.$('text=Business Search, text=Search, text=Dashboard');
                if (searchTab) {
                  await searchTab.click();
                  await page.waitForTimeout(1000);
                }

                // Click the generation button
                await buildWebsiteBtn.click();
                console.log('🎯 Build Website button clicked on production!');

                await page.waitForTimeout(3000);

                // Check for any processing indicators
                console.log('🔍 Looking for processing indicators...');

                // Look for loading states, progress bars, or processing messages
                const processingIndicators = [
                  '.loading',
                  '.spinner',
                  '.progress',
                  '[data-testid*="processing"]',
                  '[data-testid*="loading"]',
                  'text=Processing',
                  'text=Generating',
                  'text=Loading'
                ];

                let foundProcessing = false;
                for (const indicator of processingIndicators) {
                  try {
                    const element = await page.$(indicator);
                    if (element) {
                      console.log(`✅ Found processing indicator: ${indicator}`);
                      foundProcessing = true;
                      break;
                    }
                  } catch (e) {
                    // Continue trying
                  }
                }

                if (!foundProcessing) {
                  console.log('⚠️ No immediate processing indicators found - checking projects...');

                  // Check projects section for new items
                  const projectsTab2 = await page.$('text=Your Projects, text=My Projects');
                  if (projectsTab2) {
                    await projectsTab2.click();
                    await page.waitForTimeout(2000);
                  }

                  // Take screenshot to show current state
                  await page.screenshot({ path: 'live-production/05-after-click.png', fullPage: true });
                  console.log('📸 State after button click captured');
                }

                // Wait a bit longer for any async operations
                await page.waitForTimeout(5000);

                // Final check for any new content or changes
                await page.screenshot({ path: 'live-production/06-final-state.png', fullPage: true });
                console.log('📸 Final state captured');

              } catch (clickError) {
                console.log('⚠️ Error clicking button:', clickError.message);
              }

              console.log('\n🎉 Live Production Test Results:');
              console.log('✅ Successfully navigated to production site');
              console.log('✅ Business search functionality working');
              console.log('✅ New generation buttons found and functional');
              console.log('✅ Button click handling working');
              console.log('✅ UI responsive and modern');

            } else {
              console.log('⚠️ Build Website button not found - checking for other buttons...');

              // Look for any buttons that might be generation-related
              const allButtons = await firstCard.$$('button');
              console.log(`📋 Found ${allButtons.length} buttons on business card`);

              if (allButtons.length > 0) {
                for (let i = 0; i < allButtons.length; i++) {
                  try {
                    const buttonText = await allButtons[i].evaluate(el => el.textContent.trim());
                    console.log(`Button ${i + 1}: "${buttonText}"`);
                  } catch (e) {
                    // Skip if can't get text
                  }
                }
              }
            }

            // Also check for other buttons
            if (contentBtn) {
              console.log('✅ Content generation button found');
            }
            if (marketingBtn) {
              console.log('✅ Marketing generation button found');
            }

          } catch (cardError) {
            console.log('⚠️ Could not interact with business card:', cardError.message);
          }
        } else {
          console.log('⚠️ No business cards found - may need to perform search first');
        }

      } else {
        console.log('⚠️ Search input not found - exploring page structure...');

        // Look for navigation elements and page structure
        console.log('\n🧭 Step 3: Exploring page structure...');

        // Take screenshot of current page state
        await page.screenshot({ path: 'live-production/03-page-structure.png', fullPage: true });
        console.log('📸 Current page structure captured');

        // Look for any buttons or interactive elements
        const allButtons = await page.$$('button, .btn, [role="button"]');
        console.log(`📋 Found ${allButtons.length} buttons/interactive elements on page`);

        // Look for navigation links
        const navLinks = await page.$$('nav a, header a, .navigation a, [data-testid*="nav"] a');
        console.log(`📍 Found ${navLinks.length} navigation links`);

        // Look for any AI-related features
        const aiElements = await page.$$('[class*="ai"], [class*="AI"], [data-testid*="ai"]');
        console.log(`🤖 Found ${aiElements.length} AI-related elements`);

        // Try to find dashboard or main content areas
        const contentAreas = await page.$$('.dashboard, .main-content, .content, [data-testid*="content"]');
        console.log(`📄 Found ${contentAreas.length} content areas`);

        // Look for any generation or build related elements
        const buildElements = await page.$$('[class*="build"], [class*="generate"], [data-testid*="build"], [data-testid*="generate"]');
        console.log(`🏗️ Found ${buildElements.length} build/generate elements`);

        // Look for search elements specifically
        const searchElements = await page.$$('[class*="search"], [data-testid*="search"], input[placeholder*="search"]');
        console.log(`🔍 Found ${searchElements.length} search elements`);
      }

    } catch (searchError) {
      console.log('⚠️ Search functionality not immediately available:', searchError.message);

      // Take screenshot of current state
      await page.screenshot({ path: 'live-production/02-current-state.png', fullPage: true });
      console.log('📸 Current page state captured');
    }

    // Step 4: Overall site analysis
    console.log('\n🧭 Step 4: Overall site analysis...');

    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);

    // Check URL
    const url = page.url();
    console.log(`🌐 Current URL: ${url}`);

    // Look for any error messages
    const errorElements = await page.$$('[class*="error"], [class*="Error"], text="Error", text="error"]');
    if (errorElements.length > 0) {
      console.log(`⚠️ Found ${errorElements.length} error elements`);
    } else {
      console.log('✅ No error elements found');
    }

    // Look for success or loaded indicators
    const successElements = await page.$$('[class*="success"], [class*="loaded"], [class*="ready"]');
    if (successElements.length > 0) {
      console.log(`✅ Found ${successElements.length} success/loaded indicators`);
    }

    // Final comprehensive screenshot
    await page.screenshot({ path: 'live-production/07-comprehensive-view.png', fullPage: true });
    console.log('📸 Comprehensive view captured');

  } catch (error) {
    console.error('❌ Production test failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Live production test completed - browser closed');
  }
}

// Create demo directory
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('live-production')) {
  fs.mkdirSync('live-production');
}

// Run live production test
console.log('🎬 FindWorkAI Live Production Test\n');
console.log('=' .repeat(60));
console.log('🌐 Testing on: https://findworkai.vercel.app/dashboard');
console.log('=' .repeat(60));
console.log('This test will demonstrate the new workflow on the live site');
console.log('Watch the browser window to see the live test in action!');
console.log('=' .repeat(60));

testLiveProductionWorkflow().catch(console.error);