module.exports = {
  ci: {
    collect: {
      // Static site testing
      staticDistDir: './.next',
      
      // Or URL testing
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/login',
      ],
      
      numberOfRuns: 3,
      
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
        
        // Custom Chrome flags
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage',
      },
    },
    
    assert: {
      preset: 'lighthouse:recommended',
      
      assertions: {
        // Performance
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // SEO
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // PWA
        'categories:pwa': 'off',
        
        // Specific audits
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'uses-text-compression': 'error',
        'uses-rel-preconnect': 'warn',
        'time-to-interactive': ['warn', { maxNumericValue: 5000 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 2000 }],
        'bootup-time': ['warn', { maxNumericValue: 2000 }],
        'uses-long-cache-ttl': 'warn',
        'offscreen-images': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'dom-size': ['warn', { maxNumericValue: 1500 }],
        'no-document-write': 'error',
        'non-composited-animations': 'warn',
      },
    },
    
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
