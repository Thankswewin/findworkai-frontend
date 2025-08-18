import { test, expect } from '@playwright/test'

// Test business data
const testBusinessData = {
  name: "Joe's Coffee Roasters",
  category: "Restaurant",
  location: "San Francisco, CA",
  phone: "(555) 123-4567",
  email: "joe@coffeeroasters.com",
  description: "Premium artisanal coffee roasting company serving the Bay Area with ethically sourced beans",
  rating: 4.7,
  reviews: 234
}

const mockApiKey = "sk-or-v1-test-key-12345"

// Helper to setup test environment
async function setupAIAgentTest(page) {
  // Mock all necessary API endpoints
  await page.route('**/api/v1/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'test_token',
        user: { id: 'test-user', subscription_plan: 'professional' }
      })
    })
  })

  // Mock OpenRouter API calls
  await page.route('**/api/openrouter/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        choices: [{ message: { content: 'AI Generated Website Content' } }]
      })
    })
  })

  // Start from login
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  // Wait for dashboard
  await page.waitForURL(/dashboard/)
}

test.describe('AI Agent Canvas - Website Generation Tests', () => {
  
  test('should navigate to AI agents and generate a complete website', async ({ page }) => {
    await setupAIAgentTest(page)
    
    // Navigate to AI Agents section
    await page.click('a[href*="ai-agents"], nav a:has-text("AI Agents")')
    await expect(page).toHaveURL(/ai-agents/)
    
    // Verify AI Agents dashboard loaded
    await expect(page.locator('h1:has-text("AI Agents")')).toBeVisible()
    await expect(page.locator('text=/Autonomous agents.*create websites/i')).toBeVisible()

    // Setup business information first
    await page.click('text="Business Setup"')
    await page.fill('input#business-name', testBusinessData.name)
    await page.fill('input#business-category', testBusinessData.category)
    await page.fill('input#business-location', testBusinessData.location)
    await page.fill('input#business-phone', testBusinessData.phone)
    await page.fill('input#business-email', testBusinessData.email)
    await page.fill('textarea#business-description', testBusinessData.description)
    
    // Set design style
    await page.click('button[role="combobox"]:has-text("Select a design style")')
    await page.click('text="Modern & Minimal"')

    // Configure API settings
    await page.click('text="Configuration"')
    await page.fill('input#api-key', mockApiKey)
    await page.click('button:has-text("Save")')
    
    // Verify API key was saved
    await expect(page.locator('text=/API key saved/i')).toBeVisible()

    // Go back to Agents tab
    await page.click('text="Agents"')
    
    // Find and test the Website Generator Agent
    const websiteAgentCard = page.locator('.hover\\:shadow-lg:has(h3:has-text("Website Creator"))')
    await expect(websiteAgentCard).toBeVisible()
    
    // Verify agent capabilities are shown
    await expect(websiteAgentCard.locator('text=/Responsive web design/i')).toBeVisible()
    await expect(websiteAgentCard.locator('text=/SEO optimization/i')).toBeVisible()
    
    // Start the website generation process
    await websiteAgentCard.locator('button:has-text("Run Agent")').click()
    
    // Verify the progress is shown
    await expect(page.locator('text=/Processing.*%/i')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.progress, [role="progressbar"]')).toBeVisible()
    
    // Wait for completion (with longer timeout for AI processing)
    await expect(page.locator('text=/Completed|Re-run/i')).toBeVisible({ timeout: 60000 })
    
    // Click to view the generated website
    const viewButton = websiteAgentCard.locator('button:has([data-testid="eye-icon"], .lucide-eye)')
    await viewButton.click()
    
    // Verify the canvas/viewer opened
    await expect(page.locator('[role="dialog"]:has-text("Results")')).toBeVisible()
  })

  test('should test the visual canvas artifact viewer', async ({ page }) => {
    await setupAIAgentTest(page)
    
    // Navigate to AI demo page directly (if available)
    await page.goto('/ai-demo')
    
    // Configure the demo
    await page.fill('input[type="password"][placeholder*="sk-or-v1"]', mockApiKey)
    await page.selectOption('select', 'openai/gpt-4-turbo-preview')
    await page.click('button:has-text("Start AI Agent Demo")')
    
    // Verify demo business is shown
    await expect(page.locator('text=/Joe\'s Coffee Shop/i')).toBeVisible()
    await expect(page.locator('text=/No Website/i')).toBeVisible()
    
    // Interact with the AI Agent Dashboard
    await expect(page.locator('.ai-agent-dashboard, [data-testid="ai-dashboard"]')).toBeVisible()
    
    // Start website building process
    await page.click('button:has-text("Build Website"), button:has-text("Generate Website")')
    
    // Verify building process starts
    await expect(page.locator('text=/Building.*website/i')).toBeVisible()
    await expect(page.locator('text=/Analyzing.*business/i')).toBeVisible()
    
    // Wait for completion
    await expect(page.locator('text=/Website.*complete|ready/i')).toBeVisible({ timeout: 60000 })
    
    // Click to open the canvas viewer
    await page.click('button:has-text("View Website"), button:has-text("Open Canvas")')
    
    // Test the canvas artifact viewer
    await expect(page.locator('[role="dialog"] .artifact-viewer, .canvas-viewer')).toBeVisible()
    
    // Verify canvas controls
    await expect(page.locator('button:has([data-testid="monitor-icon"])')).toBeVisible() // Desktop view
    await expect(page.locator('button:has([data-testid="smartphone-icon"])')).toBeVisible() // Mobile view
    await expect(page.locator('button:has([data-testid="eye-icon"])')).toBeVisible() // Preview mode
    await expect(page.locator('button:has([data-testid="code-icon"])')).toBeVisible() // Code view
    
    // Test device preview switching
    await page.click('button:has([data-testid="smartphone-icon"])') // Switch to mobile
    await page.waitForTimeout(500)
    await page.click('button:has([data-testid="monitor-icon"])') // Back to desktop
    
    // Test code view
    await page.click('button:has([data-testid="code-icon"])')
    await expect(page.locator('pre code, .code-editor')).toBeVisible()
    await expect(page.locator('text=/DOCTYPE html/i')).toBeVisible()
    await expect(page.locator('text=/Joe\'s Coffee/i')).toBeVisible() // Business name in code
    
    // Test preview mode
    await page.click('button:has([data-testid="eye-icon"])')
    
    // Verify the generated website content in iframe
    const iframe = page.frameLocator('iframe')
    await expect(iframe.locator('text=/Joe\'s Coffee Shop/i')).toBeVisible()
    await expect(iframe.locator('text=/Restaurant/i')).toBeVisible()
    
    // Test canvas actions
    await page.click('button:has([data-testid="copy-icon"]), button:has-text("Copy")')
    await expect(page.locator('text=/Copied.*clipboard/i')).toBeVisible()
    
    await page.click('button:has([data-testid="download-icon"]), button:has-text("Download")')
    await expect(page.locator('text=/Downloaded.*successfully/i')).toBeVisible()
  })

  test('should test business AI agent builder with different business types', async ({ page }) => {
    await setupAIAgentTest(page)
    
    const businessTypes = [
      { name: "Tech Solutions Inc", category: "Technology", location: "Austin, TX" },
      { name: "Bella's Beauty Salon", category: "Beauty", location: "Miami, FL" },
      { name: "Downtown Law Firm", category: "Law", location: "Chicago, IL" }
    ]
    
    for (const business of businessTypes) {
      await page.goto('/ai-demo')
      
      // Configure API
      await page.fill('input[type="password"]', mockApiKey)
      await page.click('button:has-text("Start AI Agent Demo")')
      
      // Simulate different business data
      await page.evaluate((bizData) => {
        // Override the sample business data
        window.testBusiness = bizData
      }, business)
      
      // Look for AI agent builder interface
      await expect(page.locator('.ai-agent-dashboard, [data-testid="ai-dashboard"]')).toBeVisible()
      
      // Test multiple agent types
      const agentTypes = ['website', 'marketing', 'content']
      
      for (const agentType of agentTypes) {
        const agentButton = page.locator(`button:has-text("${agentType}"), button[data-agent-type="${agentType}"]`)
        
        if (await agentButton.isVisible()) {
          await agentButton.click()
          
          // Verify agent configuration dialog
          await expect(page.locator(`[role="dialog"]:has-text("${agentType}")`)).toBeVisible()
          
          // Start building
          await page.click('button:has-text("Start Building"), button:has-text("Generate")')
          
          // Verify progress
          await expect(page.locator('text=/Building|Generating|Processing/i')).toBeVisible()
          
          // Close dialog for next test
          await page.click('button:has-text("Cancel"), button:has([data-testid="x-icon"])')
        }
      }
    }
  })

  test('should test canvas real-time editing features', async ({ page }) => {
    await setupAIAgentTest(page)
    await page.goto('/ai-demo')
    
    // Setup and generate website
    await page.fill('input[type="password"]', mockApiKey)
    await page.click('button:has-text("Start AI Agent Demo")')
    
    // Generate website
    await page.click('button:has-text("Build Website")')
    await expect(page.locator('text=/complete|ready/i')).toBeVisible({ timeout: 60000 })
    
    // Open canvas
    await page.click('button:has-text("View Website")')
    await expect(page.locator('.artifact-viewer, .canvas-viewer')).toBeVisible()
    
    // Switch to code editing mode
    await page.click('button:has([data-testid="code-icon"])')
    await page.click('button:has-text("Edit")')
    
    // Verify code editor is editable
    const codeEditor = page.locator('textarea.font-mono, .code-editor textarea')
    await expect(codeEditor).toBeVisible()
    
    // Make an edit
    await codeEditor.fill('<!DOCTYPE html><html><head><title>Edited Website</title></head><body><h1>Custom Edit Test</h1></body></html>')
    
    // Save changes
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=/Changes.*saved/i')).toBeVisible()
    
    // Switch to preview to see changes
    await page.click('button:has([data-testid="eye-icon"])')
    
    // Verify the edit appears in preview
    const iframe = page.frameLocator('iframe')
    await expect(iframe.locator('text=/Custom Edit Test/i')).toBeVisible()
    
    // Test zoom functionality
    const zoomSlider = page.locator('input[type="range"], .slider')
    if (await zoomSlider.isVisible()) {
      await zoomSlider.fill('75') // Set to 75% zoom
      await page.waitForTimeout(500)
      await zoomSlider.fill('125') // Set to 125% zoom
    }
    
    // Test fullscreen mode
    await page.click('button:has([data-testid="maximize2-icon"]), button:has-text("Fullscreen")')
    await expect(page.locator('.max-w-full.h-screen')).toBeVisible()
    
    // Exit fullscreen
    await page.click('button:has([data-testid="minimize2-icon"]), button:has-text("Exit Fullscreen")')
  })

  test('should test deployment simulation from canvas', async ({ page }) => {
    await setupAIAgentTest(page)
    await page.goto('/ai-demo')
    
    // Generate website
    await page.fill('input[type="password"]', mockApiKey)
    await page.click('button:has-text("Start AI Agent Demo")')
    await page.click('button:has-text("Build Website")')
    await expect(page.locator('text=/complete/i')).toBeVisible({ timeout: 60000 })
    
    // Open canvas
    await page.click('button:has-text("View Website")')
    
    // Test deployment feature
    const deployButton = page.locator('button:has-text("Deploy"), button:has([data-testid="send-icon"])')
    
    if (await deployButton.isVisible()) {
      await deployButton.click()
      
      // Verify deployment process starts
      await expect(page.locator('text=/Deploying|Deployment/i')).toBeVisible()
      
      // Wait for deployment completion
      await expect(page.locator('text=/Deployed.*successfully|live/i')).toBeVisible({ timeout: 30000 })
    }
  })

  test('should test canvas performance with large websites', async ({ page }) => {
    await setupAIAgentTest(page)
    
    // Create a complex business scenario
    const complexBusiness = {
      name: "Enterprise Solutions Corp",
      category: "Technology",
      location: "New York, NY",
      description: "Large enterprise technology company with multiple services, products, and complex requirements including e-commerce, blog, portfolio, team pages, and extensive service offerings"
    }
    
    await page.goto('/ai-demo')
    await page.fill('input[type="password"]', mockApiKey)
    await page.click('button:has-text("Start AI Agent Demo")')
    
    // Simulate complex business data
    await page.evaluate((bizData) => {
      window.complexBusiness = bizData
    }, complexBusiness)
    
    // Generate complex website
    await page.click('button:has-text("Build Website")')
    
    // Monitor performance during generation
    const startTime = Date.now()
    await expect(page.locator('text=/complete/i')).toBeVisible({ timeout: 90000 })
    const generationTime = Date.now() - startTime
    
    console.log(`Website generation took: ${generationTime}ms`)
    expect(generationTime).toBeLessThan(90000) // Should complete within 90 seconds
    
    // Open canvas and test performance
    const canvasStartTime = Date.now()
    await page.click('button:has-text("View Website")')
    await expect(page.locator('.artifact-viewer')).toBeVisible()
    const canvasLoadTime = Date.now() - canvasStartTime
    
    console.log(`Canvas load time: ${canvasLoadTime}ms`)
    expect(canvasLoadTime).toBeLessThan(5000) // Canvas should load within 5 seconds
    
    // Test switching between views quickly
    for (let i = 0; i < 5; i++) {
      await page.click('button:has([data-testid="code-icon"])')
      await page.waitForTimeout(200)
      await page.click('button:has([data-testid="eye-icon"])')
      await page.waitForTimeout(200)
    }
    
    // Verify canvas is still responsive
    await expect(page.locator('iframe')).toBeVisible()
  })

  test('should validate generated website quality and content', async ({ page }) => {
    await setupAIAgentTest(page)
    await page.goto('/ai-demo')
    
    await page.fill('input[type="password"]', mockApiKey)
    await page.click('button:has-text("Start AI Agent Demo")')
    
    // Generate website
    await page.click('button:has-text("Build Website")')
    await expect(page.locator('text=/complete/i')).toBeVisible({ timeout: 60000 })
    
    // Open canvas and examine generated code
    await page.click('button:has-text("View Website")')
    await page.click('button:has([data-testid="code-icon"])')
    
    // Verify HTML structure quality
    const codeContent = await page.locator('pre code, .code-editor').textContent()
    
    // Check for essential HTML elements
    expect(codeContent).toContain('<!DOCTYPE html>')
    expect(codeContent).toContain('<meta charset="UTF-8">')
    expect(codeContent).toContain('<meta name="viewport"')
    expect(codeContent).toContain('Joe\'s Coffee') // Business name
    expect(codeContent).toContain('Restaurant') // Category
    
    // Check for responsive design
    expect(codeContent).toContain('tailwindcss') // CSS framework
    expect(codeContent).toContain('responsive') // Responsive elements
    
    // Switch to preview and validate visual elements
    await page.click('button:has([data-testid="eye-icon"])')
    
    const iframe = page.frameLocator('iframe')
    
    // Verify key website sections are present
    await expect(iframe.locator('h1, h2')).toBeVisible() // Headings
    await expect(iframe.locator('nav, .nav')).toBeVisible() // Navigation
    await expect(iframe.locator('footer')).toBeVisible() // Footer
    
    // Verify business information is displayed
    await expect(iframe.locator(`text=/${testBusinessData.name}/i`)).toBeVisible()
    await expect(iframe.locator(`text=/${testBusinessData.category}/i`)).toBeVisible()
    
    // Test responsive behavior by switching device views
    await page.click('button:has([data-testid="smartphone-icon"])')
    await page.waitForTimeout(1000)
    
    // Verify mobile layout
    const mobileFrame = page.frameLocator('iframe')
    await expect(mobileFrame.locator('body')).toBeVisible()
  })

})
