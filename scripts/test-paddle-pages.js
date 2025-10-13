const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Paddle.com required pages and navigation entry points
const paddlePages = [
  {
    name: 'Homepage',
    url: 'http://localhost:3003/',
    filename: 'homepage.png',
    description: 'Main landing page with navigation to all Paddle.com pages'
  },
  {
    name: 'Pricing',
    url: 'http://localhost:3003/pricing',
    filename: 'pricing-page.png',
    description: 'Pricing page for Paddle.com verification'
  },
  {
    name: 'Terms of Service',
    url: 'http://localhost:3003/terms',
    filename: 'terms-page.png',
    description: 'Terms of Service page for Paddle.com verification'
  },
  {
    name: 'Privacy Policy',
    url: 'http://localhost:3003/privacy',
    filename: 'privacy-page.png',
    description: 'Privacy Policy page for Paddle.com verification'
  },
  {
    name: 'Refund Policy',
    url: 'http://localhost:3003/refund-policy',
    filename: 'refund-policy-page.png',
    description: 'Refund Policy page for Paddle.com verification'
  }
];

async function testPaddlePages() {
  let browser;
  let results = [];

  try {
    console.log('🚀 Starting Puppeteer test for Paddle.com pages...\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Show browser window for visual verification
      defaultViewport: { width: 1920, height: 1080 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    console.log('📋 Testing Paddle.com required pages:\n');

    // Test each page
    for (let i = 0; i < paddlePages.length; i++) {
      const pageInfo = paddlePages[i];
      console.log(`${i + 1}. Testing: ${pageInfo.name}`);
      console.log(`   URL: ${pageInfo.url}`);

      try {
        // Navigate to page with timeout
        await page.goto(pageInfo.url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if page loaded successfully
        const pageTitle = await page.title();
        const pageContent = await page.content();

        // Check for common error indicators
        const hasError = pageContent.includes('404') ||
                        pageContent.includes('Page not found') ||
                        pageContent.includes('Server Error') ||
                        pageContent.includes('Internal Server Error');

        // Take screenshot
        const screenshotPath = path.join(screenshotDir, pageInfo.filename);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        // Get page dimensions
        const dimensions = await page.evaluate(() => {
          return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
          };
        });

        // Check for key content elements
        let hasRequiredContent = false;
        let contentCheck = '';

        if (pageInfo.name === 'Homepage') {
          hasRequiredContent = await page.evaluate(() => {
            return document.body.textContent.includes('AI-Powered Business Discovery') &&
                   document.body.textContent.includes('View Pricing') &&
                   document.body.textContent.includes('Start Free Trial');
          });
          contentCheck = 'Contains homepage hero section and CTAs';
        } else if (pageInfo.name === 'Pricing') {
          hasRequiredContent = await page.evaluate(() => {
            return document.body.textContent.includes('Pricing') &&
                   document.body.textContent.includes('Professional') &&
                   document.body.textContent.includes('Enterprise');
          });
          contentCheck = 'Contains pricing tiers and plans';
        } else if (pageInfo.name === 'Terms of Service') {
          hasRequiredContent = await page.evaluate(() => {
            return document.body.textContent.includes('Terms of Service') &&
                   document.body.textContent.includes('Terms') &&
                   document.body.textContent.includes('Service');
          });
          contentCheck = 'Contains terms and conditions content';
        } else if (pageInfo.name === 'Privacy Policy') {
          hasRequiredContent = await page.evaluate(() => {
            return document.body.textContent.includes('Privacy Policy') &&
                   document.body.textContent.includes('Privacy') &&
                   document.body.textContent.includes('Data');
          });
          contentCheck = 'Contains privacy policy content';
        } else if (pageInfo.name === 'Refund Policy') {
          hasRequiredContent = await page.evaluate(() => {
            return document.body.textContent.includes('Refund Policy') &&
                   document.body.textContent.includes('Refund') &&
                   document.body.textContent.includes('Money Back');
          });
          contentCheck = 'Contains refund policy and money back guarantee';
        }

        const result = {
          name: pageInfo.name,
          url: pageInfo.url,
          status: hasError ? 'ERROR' : 'SUCCESS',
          title: pageTitle,
          dimensions: dimensions,
          screenshot: screenshotPath,
          hasRequiredContent: hasRequiredContent,
          contentCheck: contentCheck,
          loadTime: new Date().toISOString()
        };

        results.push(result);

        if (hasError) {
          console.log(`   ❌ FAILED: Page has errors`);
        } else if (!hasRequiredContent) {
          console.log(`   ⚠️  WARNING: Missing required content`);
        } else {
          console.log(`   ✅ SUCCESS: Page loaded correctly`);
        }

        console.log(`   📸 Screenshot saved: ${screenshotPath}`);
        console.log(`   📏 Dimensions: ${dimensions.width}x${dimensions.height}`);
        console.log(`   📄 Title: ${pageTitle}`);
        console.log(`   ✅ Content: ${contentCheck}`);
        console.log('');

      } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);

        // Try to take screenshot even if page failed
        try {
          const screenshotPath = path.join(screenshotDir, `error-${pageInfo.filename}`);
          await page.screenshot({
            path: screenshotPath,
            fullPage: true
          });
          console.log(`   📸 Error screenshot saved: ${screenshotPath}`);
        } catch (screenshotError) {
          console.log(`   ❌ Could not take error screenshot`);
        }

        results.push({
          name: pageInfo.name,
          url: pageInfo.url,
          status: 'ERROR',
          error: error.message,
          loadTime: new Date().toISOString()
        });
      }

      // Wait between pages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Close browser
    await browser.close();

    // Generate report
    console.log('\n📊 Test Results Summary:');
    console.log('=' .repeat(50));

    let successCount = 0;
    let errorCount = 0;

    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   URL: ${result.url}`);

      if (result.status === 'SUCCESS') {
        successCount++;
        console.log(`   ✅ Title: ${result.title}`);
        console.log(`   ✅ Content: ${result.contentCheck}`);
        console.log(`   📸 Screenshot: ${result.screenshot}`);
      } else if (result.error) {
        errorCount++;
        console.log(`   ❌ Error: ${result.error}`);
      } else {
        console.log(`   ⚠️  Warning: Missing content`);
      }
    });

    console.log('\n' + '=' .repeat(50));
    console.log(`📈 Summary: ${successCount} successful, ${errorCount} failed out of ${results.length} pages`);

    // Save results to JSON file
    const reportPath = path.join(screenshotDir, 'paddle-pages-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`📋 Full report saved: ${reportPath}`);

    console.log('\n🎉 Paddle.com pages test completed!');
    console.log('📁 All screenshots saved in: ' + screenshotDir);

    return results;

  } catch (error) {
    console.error('❌ Fatal error during testing:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/pricing',
      method: 'GET',
      timeout: 5000
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('🔍 Checking if development server is running...');
    const serverRunning = await checkServer();

    if (!serverRunning) {
      console.log('❌ Development server is not running on http://localhost:3003');
      console.log('Please start the server with: npm run dev');
      process.exit(1);
    }

    console.log('✅ Development server is running\n');
    await testPaddlePages();

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { testPaddlePages };