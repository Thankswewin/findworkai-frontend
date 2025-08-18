# Testing Best Practices - FindWorkAI Frontend

## Table of Contents
- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Writing Good Tests](#writing-good-tests)
- [Testing Patterns](#testing-patterns)
- [Common Pitfalls](#common-pitfalls)
- [Debugging Tests](#debugging-tests)

## Testing Philosophy

Our testing strategy follows these core principles:

1. **Test behavior, not implementation** - Tests should verify what the code does, not how it does it
2. **Keep tests simple and readable** - A test should be understandable at a glance
3. **Fast feedback loop** - Unit tests should run in milliseconds, E2E tests in seconds
4. **Test the critical path** - Focus on user journeys and business logic
5. **Maintain test coverage** - Aim for 60%+ coverage, but prioritize quality over quantity

## Test Types

### Unit Tests
Tests for individual functions, utilities, and components in isolation.

**When to use:**
- Testing pure functions
- Testing component rendering
- Testing hooks
- Testing utilities and helpers

**Example:**
```typescript
// Good unit test
describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(-500)).toBe('-$500.00')
  })
})
```

### Integration Tests
Tests that verify multiple components work together correctly.

**When to use:**
- Testing API client with error handling
- Testing form submission flows
- Testing state management

**Example:**
```typescript
// Good integration test
describe('Login Flow', () => {
  it('should handle successful login', async () => {
    const { user } = renderWithProviders(<LoginForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })
})
```

### End-to-End Tests
Tests that simulate real user interactions across the entire application.

**When to use:**
- Testing critical user journeys
- Testing cross-browser compatibility
- Testing responsive design
- Smoke testing before deployment

**Example:**
```typescript
// Good E2E test
test('user can search and view business details', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Search for a business
  await page.fill('[placeholder="Search businesses..."]', 'Coffee Shop')
  await page.click('button[type="submit"]')
  
  // Click on first result
  await page.click('.business-card:first-child')
  
  // Verify business details are shown
  await expect(page.locator('h1')).toContainText('Coffee Shop')
  await expect(page.locator('.business-details')).toBeVisible()
})
```

## Writing Good Tests

### 1. Use Descriptive Test Names
```typescript
// ❌ Bad
it('should work', () => {})
it('test 1', () => {})

// ✅ Good
it('should display error message when email is invalid', () => {})
it('should disable submit button while form is submitting', () => {})
```

### 2. Follow AAA Pattern
Arrange, Act, Assert - structure your tests clearly:

```typescript
it('should calculate discount correctly', () => {
  // Arrange
  const originalPrice = 100
  const discountPercentage = 20
  
  // Act
  const finalPrice = calculateDiscount(originalPrice, discountPercentage)
  
  // Assert
  expect(finalPrice).toBe(80)
})
```

### 3. Use Test Data Builders
Create reusable test data factories:

```typescript
// test-utils/builders.ts
export const buildUser = (overrides = {}) => ({
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  ...overrides
})

// In tests
const adminUser = buildUser({ role: 'admin' })
```

### 4. Mock External Dependencies
```typescript
// Mock API calls
jest.mock('@/lib/api-client')

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = 'http://test.api'
})

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}))
```

### 5. Test Error States
Always test both success and failure paths:

```typescript
describe('BusinessList', () => {
  it('should display businesses when loaded', async () => {
    // Test success state
  })
  
  it('should display error message when loading fails', async () => {
    // Mock API to return error
    mockApi.get.mockRejectedValueOnce(new Error('Network error'))
    
    render(<BusinessList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading businesses/i)).toBeInTheDocument()
    })
  })
})
```

## Testing Patterns

### Testing Async Code
```typescript
// Using waitFor for async operations
it('should load data asynchronously', async () => {
  render(<DataComponent />)
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument()
  })
})
```

### Testing User Interactions
```typescript
import { userEvent } from '@testing-library/user-event'

it('should handle user input', async () => {
  const user = userEvent.setup()
  render(<SearchForm />)
  
  const input = screen.getByRole('textbox')
  await user.type(input, 'search query')
  
  expect(input).toHaveValue('search query')
})
```

### Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react'

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

### Testing with React Context
```typescript
const renderWithAuth = (ui, { user = null } = {}) => {
  return render(
    <AuthContext.Provider value={{ user, login: jest.fn(), logout: jest.fn() }}>
      {ui}
    </AuthContext.Provider>
  )
}

it('should show user menu when authenticated', () => {
  renderWithAuth(<Header />, { user: buildUser() })
  expect(screen.getByText(/profile/i)).toBeInTheDocument()
})
```

## Common Pitfalls

### 1. Testing Implementation Details
```typescript
// ❌ Bad - Testing state variable name
expect(component.state.isLoading).toBe(true)

// ✅ Good - Testing visible behavior
expect(screen.getByText(/loading/i)).toBeInTheDocument()
```

### 2. Not Cleaning Up
```typescript
// ✅ Always clean up after tests
afterEach(() => {
  jest.clearAllMocks()
  cleanup() // RTL cleanup
})
```

### 3. Using Wrong Queries
```typescript
// ❌ Bad - Using test IDs when not necessary
screen.getByTestId('submit-button')

// ✅ Good - Using semantic queries
screen.getByRole('button', { name: /submit/i })
```

### 4. Not Waiting for Async Operations
```typescript
// ❌ Bad - Not waiting
fireEvent.click(submitButton)
expect(screen.getByText(/success/i)).toBeInTheDocument()

// ✅ Good - Waiting for async update
fireEvent.click(submitButton)
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

## Debugging Tests

### 1. Use Debug Utilities
```typescript
import { screen, debug } from '@testing-library/react'

// Print the entire DOM
debug()

// Print specific element
debug(screen.getByRole('button'))

// Use screen.debug() for prettier output
screen.debug()
```

### 2. Use Playwright UI Mode
```bash
# Run tests with UI for debugging
npx playwright test --ui

# Run specific test file
npx playwright test auth.spec.ts --debug
```

### 3. Take Screenshots in E2E Tests
```typescript
test('visual debugging', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'debug-dashboard.png' })
  
  // Take screenshot on failure automatically
  test.info().attachments.push({
    name: 'screenshot',
    path: 'debug-dashboard.png',
    contentType: 'image/png'
  })
})
```

### 4. Use Verbose Logging
```typescript
// Add console logs in tests
it('should process data', () => {
  const input = { value: 10 }
  console.log('Input:', input)
  
  const result = processData(input)
  console.log('Result:', result)
  
  expect(result).toEqual({ processed: true })
})
```

### 5. Check Test Environment
```bash
# Run tests with specific environment
NODE_ENV=test npm run test

# Check what's being mocked
console.log('Mocked modules:', jest.mock.calls)
```

## Test Coverage Guidelines

### Minimum Coverage Requirements
- Statements: 60%
- Branches: 60%
- Functions: 60%
- Lines: 60%

### Priority Areas for Testing
1. **Business Logic** - Lead scoring, search algorithms
2. **User Authentication** - Login, logout, session management
3. **Data Transformations** - API response parsing, formatting
4. **Error Handling** - Network errors, validation errors
5. **Critical User Paths** - Sign up, search, campaign creation

### What NOT to Test
- Third-party library internals
- Simple prop passing
- Style/CSS classes (unless critical)
- Configuration files
- Generated code

## Continuous Integration

Tests run automatically on:
- Every push to main/develop branches
- Every pull request
- Scheduled nightly runs

### Pre-commit Checklist
```bash
# Run before committing
npm run type-check
npm run lint:fix
npm run test:ci
npm run test:e2e -- --project=chromium
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Questions?

For questions about testing, reach out to the development team or check our internal wiki for more specific examples and patterns used in the FindWorkAI codebase.
