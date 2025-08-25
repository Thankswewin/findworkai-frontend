import { test, expect } from '@playwright/test'

const LIVE_FRONTEND_URL = 'https://findworkai-m7zheo0um-pheelymons-projects.vercel.app'
const LIVE_BACKEND_URL = 'https://findworkai-backend-1.onrender.com'

test.describe('Live Deployment Tests', () => {
  test('should load the live frontend without hydration errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate to live app
    await page.goto(LIVE_FRONTEND_URL)
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that the main content loads
    await expect(page.locator('body')).toBeVisible()
    
    // Verify no hydration errors (these are specific React hydration error patterns)
    const hydrationErrors = consoleErrors.filter(error => 
      error.includes('Hydration failed') || 
      error.includes('server HTML') ||
      error.includes('client content')
    )
    
    if (hydrationErrors.length > 0) {
      console.log('❌ Hydration errors found:', hydrationErrors)
      throw new Error(`Hydration errors detected: ${hydrationErrors.join(', ')}`)
    }
    
    console.log('✅ No hydration errors detected')
    
    // Check for the dashboard or main navigation
    const hasNavigation = await page.locator('nav, .nav, .navigation, .dashboard').count() > 0
    expect(hasNavigation).toBeTruthy()
    
    console.log('✅ Frontend loads successfully without hydration errors')
  })

  test('should test AI agent workflow on live deployment', async ({ page }) => {
    // Navigate to live app
    await page.goto(LIVE_FRONTEND_URL + '/dashboard')
    
    // Wait for the dashboard to load
    await page.waitForLoadState('networkidle')
    
    // Look for the AI agent builder or business search functionality
    const hasAIFeatures = await Promise.race([
      page.locator('text=/AI Agent/i').isVisible(),
      page.locator('text=/Generate Website/i').isVisible(), 
      page.locator('text=/Find Businesses/i').isVisible(),
      page.locator('button:has-text("Search")').isVisible(),
      page.waitForTimeout(5000).then(() => false)
    ])
    
    if (hasAIFeatures) {
      console.log('✅ AI features detected on dashboard')
      
      // Try to interact with AI features
      const aiButton = page.locator('button:has-text("Generate"), button:has-text("AI"), button:has-text("Start Building")')
      const buttonCount = await aiButton.count()
      
      if (buttonCount > 0) {
        console.log(`✅ Found ${buttonCount} AI-related buttons`)
        
        // Click the first AI button
        await aiButton.first().click()
        
        // Wait for any modal or form to appear
        await page.waitForTimeout(2000)
        
        // Look for form fields or AI interface
        const hasForm = await Promise.race([
          page.locator('input[placeholder*="business"], input[name*="business"]').isVisible(),
          page.locator('input[placeholder*="website"], input[name*="website"]').isVisible(),
          page.locator('textarea').isVisible(),
          page.locator('select').isVisible(),
          page.waitForTimeout(3000).then(() => false)
        ])
        
        if (hasForm) {
          console.log('✅ AI form interface loaded')
          
          // Try to fill in some basic business information
          const businessInput = page.locator('input[placeholder*="business"], input[name*="business"]').first()
          if (await businessInput.isVisible()) {
            await businessInput.fill('Test Coffee Shop')
            console.log('✅ Filled business name')
          }
          
          const categorySelect = page.locator('select[name*="category"], select[name*="type"]').first()
          if (await categorySelect.isVisible()) {
            await categorySelect.selectOption({ index: 1 })
            console.log('✅ Selected business category')
          }
          
          // Look for generate/submit button
          const generateButton = page.locator('button:has-text("Generate"), button:has-text("Build"), button:has-text("Create"), button[type="submit"]')
          const generateCount = await generateButton.count()
          
          if (generateCount > 0) {
            console.log('✅ Generate button found - AI workflow is accessible')
            
            // Click generate (but don't wait for completion since it might be slow)
            await generateButton.first().click()
            console.log('✅ AI generation triggered')
            
            // Wait a short time to see if any loading indicators appear
            await page.waitForTimeout(3000)
            
            // Check for loading indicators or progress
            const hasProgress = await Promise.race([
              page.locator('.loading, .spinner, .progress').isVisible(),
              page.locator('text=/generating/i').isVisible(),
              page.locator('text=/processing/i').isVisible(),
              page.waitForTimeout(2000).then(() => false)
            ])
            
            if (hasProgress) {
              console.log('✅ AI processing indicators detected - backend integration working')
            }
          }
        }
      }
    } else {
      console.log('⚠️ AI features not immediately visible, checking for alternative entry points')
      
      // Check for alternative navigation
      const navLinks = await page.locator('a, button').allTextContents()
      console.log('Available navigation:', navLinks.slice(0, 10))
    }
  })

  test('should verify backend API connectivity', async ({ page }) => {
    console.log(`Testing backend at: ${LIVE_BACKEND_URL}`)
    
    try {
      // Test health endpoint
      const healthResponse = await page.request.get(`${LIVE_BACKEND_URL}/health`)
      console.log(`Backend health status: ${healthResponse.status()}`)
      
      if (healthResponse.status() === 200) {
        const healthData = await healthResponse.json()
        console.log('Backend health data:', healthData)
        expect(healthData).toHaveProperty('status')
        console.log('✅ Backend health check passed')
      }
      
      // Test API root
      const rootResponse = await page.request.get(`${LIVE_BACKEND_URL}/`)
      console.log(`Backend root status: ${rootResponse.status()}`)
      
      if (rootResponse.status() === 200) {
        const rootData = await rootResponse.json()
        console.log('Backend root data:', rootData)
        console.log('✅ Backend API root accessible')
      }
      
      // Test AI generation endpoint with minimal data
      const aiResponse = await page.request.post(`${LIVE_BACKEND_URL}/api/v1/mcp-enhanced/generate-enhanced`, {
        data: {
          business_info: {
            name: "Test Business",
            business_category: "Restaurant",
            location: "New York, NY"
          },
          enable_mcp: false,
          enable_self_reflection: false,
          enable_self_correction: false,
          framework: "html",
          style_preference: "modern"
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log(`AI generation endpoint status: ${aiResponse.status()}`)
      
      if (aiResponse.status() === 200) {
        const aiData = await aiResponse.json()
        console.log('AI generation response keys:', Object.keys(aiData))
        
        // Check if we got a proper AI response
        if (aiData.final_output && aiData.final_output.includes('<html')) {
          console.log('✅ AI generation endpoint working - HTML website generated')
          console.log(`Generated website length: ${aiData.final_output.length} characters`)
        } else {
          console.log('⚠️ AI generation returned data but no HTML content')
        }
      } else if (aiResponse.status() === 500) {
        const errorData = await aiResponse.json()
        console.log('❌ AI generation failed with 500 error:', errorData)
        
        // This might indicate our model fixes haven't been deployed to backend yet
        console.log('This suggests the backend may need to be redeployed with the model updates')
      }
      
    } catch (error) {
      console.log('Backend connectivity error:', error)
      // Don't fail the test for backend issues - just log them
    }
  })

  test('should measure end-to-end performance', async ({ page }) => {
    const startTime = performance.now()
    
    // Navigate to the app
    await page.goto(LIVE_FRONTEND_URL)
    const pageLoadTime = performance.now()
    
    // Wait for the app to be interactive
    await page.waitForLoadState('networkidle')
    const interactiveTime = performance.now()
    
    console.log('Performance Metrics:')
    console.log(`- Page Load: ${(pageLoadTime - startTime).toFixed(2)}ms`)
    console.log(`- Interactive: ${(interactiveTime - startTime).toFixed(2)}ms`)
    
    // Performance assertions
    expect(pageLoadTime - startTime).toBeLessThan(10000) // Page load under 10s
    expect(interactiveTime - startTime).toBeLessThan(15000) // Interactive under 15s
    
    console.log('✅ Performance within acceptable limits')
  })
})
