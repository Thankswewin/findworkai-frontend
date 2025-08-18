import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // Allow 1 retry for flaky AI tests
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video recording for AI workflow tests */
    video: process.env.CI ? 'retain-on-failure' : 'off',
    /* Timeout for individual actions (AI operations might be slow) */
    actionTimeout: 30000,
    /* Navigation timeout for page loads */
    navigationTimeout: 60000,
  },

  /* Global test timeout for complex AI workflows */
  timeout: 120000,

  /* Test categories */
  projects: [
    // Fast smoke tests
    {
      name: 'smoke-tests',
      testMatch: ['**/*auth.spec.ts', '**/*dashboard.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    // Main AI workflow tests
    {
      name: 'ai-workflow',
      testMatch: ['**/ai-agent-workflow.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
      timeout: 180000, // Extended timeout for complex AI workflows
    },
    // Performance tests
    {
      name: 'performance',
      testMatch: ['**/ai-performance.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'],
        // Performance testing specific settings
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox']
        }
      },
      timeout: 300000, // Very long timeout for stress tests
    },
    // Main browser tests
    {
      name: 'chromium',
      testIgnore: ['**/ai-performance.spec.ts'], // Skip perf tests in main run
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: ['**/ai-performance.spec.ts', '**/ai-agent-workflow.spec.ts'], // Focus on Chrome for AI tests
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: ['**/ai-performance.spec.ts', '**/ai-agent-workflow.spec.ts'],
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      testIgnore: ['**/ai-performance.spec.ts'],
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari', 
      testIgnore: ['**/ai-performance.spec.ts', '**/ai-agent-workflow.spec.ts'],
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Servers are manually started - no need for webServer */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  //   timeout: 120 * 1000,
  // },
})
