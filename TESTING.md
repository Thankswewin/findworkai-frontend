# Testing Guide for FindWorkAI Frontend

This guide provides comprehensive documentation on testing practices, tools, and infrastructure for the FindWorkAI frontend project.

## Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Writing Tests](#writing-tests)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [E2E Tests](#e2e-tests)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

Our testing strategy includes:
- **Unit Tests**: Testing individual components, utilities, and functions
- **Integration Tests**: Testing component interactions and API integrations
- **E2E Tests**: Testing complete user workflows with Playwright

### Testing Stack
- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing framework
- **MSW (Mock Service Worker)**: API mocking for tests

## Test Infrastructure

### Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── __tests__/          # Component unit tests
│   ├── lib/
│   │   └── __tests__/          # Utility tests
│   └── hooks/
│       └── __tests__/          # Hook tests
├── tests/
│   ├── e2e/                    # E2E tests
│   │   ├── auth/               # Authentication workflows
│   │   ├── search/             # Search functionality
│   │   └── fixtures/           # Test data and fixtures
│   └── integration/            # Integration tests
├── scripts/
│   └── test-all.js            # Comprehensive test runner
└── mocks/                      # Global mocks
```

### Configuration Files
- `jest.config.js`: Jest configuration
- `jest.setup.js`: Test environment setup
- `playwright.config.ts`: Playwright configuration
- `.env.test`: Test environment variables

## Writing Tests

### Unit Tests

Unit tests focus on testing individual components and utilities in isolation.

#### Component Testing Example

```typescript
// src/components/ui/__tests__/button.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### Utility Testing Example

```typescript
// src/lib/__tests__/utils.test.ts
import { cn, formatNumber, validateEmail } from '../utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
      expect(cn('text-sm', { 'font-bold': true })).toBe('text-sm font-bold')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })
  })
})
```

#### Hook Testing Example

```typescript
// src/hooks/__tests__/use-debounce.test.ts
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  jest.useFakeTimers()

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('updated')
  })
})
```

### Integration Tests

Integration tests verify that multiple components work together correctly.

#### API Integration Example

```typescript
// tests/integration/api-client.test.ts
import { apiClient } from '@/lib/api-client'
import { server } from '@/mocks/server'
import { rest } from 'msw'

describe('API Client Integration', () => {
  it('should handle authentication flow', async () => {
    // Mock successful login
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(
          ctx.json({ 
            token: 'test-token',
            user: { id: 1, email: 'test@example.com' }
          })
        )
      })
    )

    const result = await apiClient.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.token).toBe('test-token')
    expect(result.user.email).toBe('test@example.com')
  })

  it('should retry failed requests', async () => {
    let attempts = 0
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        attempts++
        if (attempts < 3) {
          return res(ctx.status(500))
        }
        return res(ctx.json({ success: true }))
      })
    )

    const result = await apiClient.get('/data')
    expect(result.success).toBe(true)
    expect(attempts).toBe(3)
  })
})
```

### E2E Tests

End-to-end tests simulate real user interactions across the entire application.

#### Playwright Test Example

```typescript
// tests/e2e/search/business-search.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Business Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should search for businesses', async ({ page }) => {
    // Enter search query
    await page.fill('[data-testid="search-input"]', 'restaurants in New York')
    await page.click('[data-testid="search-button"]')

    // Wait for results
    await page.waitForSelector('[data-testid="business-card"]')

    // Verify results
    const results = await page.locator('[data-testid="business-card"]').count()
    expect(results).toBeGreaterThan(0)

    // Click on first result
    await page.click('[data-testid="business-card"]:first-child')
    
    // Verify detail view
    await expect(page.locator('[data-testid="business-detail"]')).toBeVisible()
  })

  test('should filter search results', async ({ page }) => {
    // Perform search
    await page.fill('[data-testid="search-input"]', 'coffee shops')
    await page.click('[data-testid="search-button"]')

    // Apply filter
    await page.click('[data-testid="filter-button"]')
    await page.selectOption('[data-testid="rating-filter"]', '4')
    await page.click('[data-testid="apply-filters"]')

    // Verify filtered results
    const ratings = await page.locator('[data-testid="business-rating"]').allTextContents()
    ratings.forEach(rating => {
      expect(parseFloat(rating)).toBeGreaterThanOrEqual(4)
    })
  })
})
```

#### Authentication E2E Example

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // Verify redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('[data-testid="email-input"]', 'wrong@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials')
  })
})
```

## Running Tests

### All Tests
```bash
# Run all tests (linting, type checking, unit tests, E2E)
npm run test:all

# Or use the script directly
node scripts/test-all.js
```

### Unit Tests
```bash
# Run unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test business-search.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### Type Checking
```bash
# Check TypeScript types
npm run type-check
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## Test Coverage

### Viewing Coverage Reports

After running tests with coverage:
```bash
npm run test:coverage
```

Coverage reports are generated in multiple formats:
- **Terminal output**: Summary in the console
- **HTML report**: Open `coverage/lcov-report/index.html` in browser
- **LCOV**: For CI integration at `coverage/lcov.info`

### Coverage Thresholds

Configure minimum coverage in `jest.config.js`:
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  }
}
```

### What to Test

**High Priority (aim for 80%+ coverage):**
- Utility functions and helpers
- Custom hooks
- Business logic and calculations
- API client and error handling
- Critical user flows

**Medium Priority (aim for 60%+ coverage):**
- UI components with logic
- Form validation
- State management
- Integration points

**Lower Priority:**
- Pure presentational components
- Third-party library wrappers
- Configuration files

## Debugging

### Jest Tests

#### Using VS Code Debugger
1. Add breakpoint in test file
2. Open VS Code's JavaScript Debug Terminal
3. Run: `npm test -- --runInBand button.test.tsx`

#### Using console.log
```typescript
it('should debug component', () => {
  const { container } = render(<MyComponent />)
  console.log(container.innerHTML)
  screen.debug() // Prints the DOM tree
})
```

### Playwright Tests

#### UI Mode
```bash
# Launch Playwright UI for interactive debugging
npx playwright test --ui
```

#### Debug Mode
```bash
# Pause at each step
npx playwright test --debug

# Or add in test
await page.pause()
```

#### Trace Viewer
```bash
# Record traces
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Common Debugging Tips

1. **Async Issues**: Use `waitFor` for async operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

2. **Query Debugging**: Use specific queries
```typescript
// Instead of: getByText
screen.getByRole('button', { name: /submit/i })
```

3. **Mock Verification**: Check mock calls
```typescript
expect(mockFn).toHaveBeenCalledWith(
  expect.objectContaining({ id: 1 })
)
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Best Practices

### 1. Test Organization
- **One test file per component/module**
- **Group related tests with `describe` blocks**
- **Use descriptive test names** that explain what is being tested

### 2. Test Data
- **Use factories for complex test data**
```typescript
import { createMockBusiness } from '@/test-utils/factories'

const business = createMockBusiness({
  name: 'Test Restaurant',
  rating: 4.5
})
```

- **Keep test data close to tests**
- **Use fixtures for E2E tests**

### 3. Mocking
- **Mock at the boundary** (API calls, external services)
- **Avoid mocking internal implementations**
- **Use MSW for API mocking**
```typescript
server.use(
  rest.get('/api/businesses', (req, res, ctx) => {
    return res(ctx.json({ businesses: [] }))
  })
)
```

### 4. Assertions
- **Test behavior, not implementation**
- **Use semantic queries** (getByRole, getByLabelText)
- **Avoid testing internal state**

### 5. Performance
- **Keep tests fast** (< 100ms for unit tests)
- **Use `beforeAll` for expensive setup**
- **Run tests in parallel** when possible

### 6. Maintenance
- **Update tests when requirements change**
- **Remove obsolete tests**
- **Refactor tests alongside code**
- **Document complex test scenarios**

### 7. Environment Setup
- **Use `.env.test` for test configuration**
```env
# .env.test
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key
```

- **Mock external services**
- **Use test databases for integration tests**

### 8. Common Patterns

#### Testing Loading States
```typescript
it('should show loading state', async () => {
  render(<MyComponent />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
```

#### Testing Error States
```typescript
it('should handle errors', async () => {
  server.use(
    rest.get('/api/data', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
  })
})
```

#### Testing Form Submission
```typescript
it('should submit form', async () => {
  const handleSubmit = jest.fn()
  render(<Form onSubmit={handleSubmit} />)
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com'
  })
})
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Test Timeout
**Problem**: Test exceeds default timeout
**Solution**: Increase timeout for specific tests
```typescript
test('long running test', async () => {
  // Test code
}, 10000) // 10 second timeout
```

#### 2. Act Warnings
**Problem**: "Warning: An update was not wrapped in act(...)"
**Solution**: Use `waitFor` or `act` for state updates
```typescript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

#### 3. Module Not Found
**Problem**: Cannot resolve module paths
**Solution**: Check `jest.config.js` moduleNameMapper
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

#### 4. Async Test Issues
**Problem**: Test completes before async operations
**Solution**: Always await async operations
```typescript
it('should load data', async () => {
  render(<MyComponent />)
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})
```

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/)

### Tools
- [Testing Playground](https://testing-playground.com/) - Find the best queries
- [Jest Preview](https://www.jest-preview.com/) - Debug Jest tests visually
- [Playwright Inspector](https://playwright.dev/docs/inspector) - Debug E2E tests

### Best Practices Guides
- [Kent C. Dodds Testing Articles](https://kentcdodds.com/blog?q=testing)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Conclusion

This testing infrastructure provides a solid foundation for maintaining code quality and preventing regressions. Remember:

1. **Write tests as you develop** - TDD when possible
2. **Focus on user behavior** - Test what users do, not implementation details
3. **Keep tests maintainable** - Clear, simple, and well-organized
4. **Run tests frequently** - Catch issues early
5. **Monitor coverage** - But don't chase 100%

When adding new features:
1. Write E2E tests for critical user paths
2. Add unit tests for business logic
3. Update existing tests if behavior changes
4. Document any special testing requirements

Happy testing! 🧪
