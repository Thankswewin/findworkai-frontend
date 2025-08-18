# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core Commands

### Development Server
```bash
# Start development server on http://localhost:3000
npm run dev
```

### Building & Production
```bash
# Build for production
npm run build

# Start production server
npm run start

# Analyze bundle size with visual report
npm run build:analyze
```

### Testing
```bash
# Run unit tests in watch mode
npm run test

# Run unit tests once (CI mode)
npm run test:ci

# Generate coverage report
npm run test -- --coverage

# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests with UI mode for debugging
npx playwright test --ui

# Run a specific test file
npm test -- src/lib/__tests__/utils.test.ts
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# TypeScript type checking
npm run type-check
```

### Maintenance
```bash
# Clean build cache and artifacts
npm run clean
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with custom wrappers
- **State Management**: Zustand for client state, React Query for server state
- **Authentication**: Supabase Auth with custom hooks
- **API Client**: Axios with centralized error handling
- **Testing**: Jest for unit tests, Playwright for E2E

### Directory Structure

The codebase follows Next.js 14 App Router conventions:

- `src/app/` - Next.js app router pages and API routes
  - `(auth)/` - Authentication pages (login, register)
  - `dashboard/` - Protected dashboard routes
  - `api/` - API route handlers
- `src/components/` - React components organized by feature
  - `ui/` - Base UI components (Radix UI wrappers)
  - `layout/` - Layout components
  - Feature-specific folders (ai-agent, analytics, etc.)
- `src/lib/` - Core utilities and configurations
  - `supabase/` - Supabase client setup
  - Authentication, API client, error handling
- `src/hooks/` - Custom React hooks
- `src/services/` - External service integrations
- `src/types/` - TypeScript type definitions

### Key Architectural Patterns

#### Authentication Flow
The app uses Supabase for authentication with custom hooks:
- `use-supabase-auth.ts` - Primary auth hook
- `use-auth.ts` - Auth context wrapper
- Protected routes handled at layout level

#### API Integration
Centralized API client in `src/lib/api-client.ts`:
- Base URL configuration from environment
- Automatic error handling
- Request/response interceptors

#### Component Architecture
- Server Components by default (Next.js 14)
- Client Components marked with "use client"
- Compound component pattern for complex UIs
- Radix UI primitives wrapped in `src/components/ui/`

#### State Management Strategy
- **Server State**: React Query for API data caching
- **Client State**: Zustand for UI state
- **Form State**: React Hook Form with Zod validation

## Environment Configuration

Required environment variables (see `.env.example`):

```bash
# Core API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_KEY=<required for maps features>

# AI Features
OPENAI_API_KEY=<required for AI agent features>

# Supabase (Required for auth)
NEXT_PUBLIC_SUPABASE_URL=<your_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_key>
DATABASE_URL=<supabase_database_url>

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

## Key Features & Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration

### Protected Dashboard Routes
- `/dashboard` - Main dashboard
- `/dashboard/ai-agent` - AI agent builder
- `/dashboard/analytics` - Analytics dashboard
- `/dashboard/campaigns` - Campaign management
- `/dashboard/advanced-search` - Advanced search features
- `/dashboard/analysis` - Business analysis tools

### API Routes
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/ai-agent` - AI agent operations
- `/api/places` - Google Places integration
- `/api/hubspot` - HubSpot CRM integration

## Performance Optimizations

The app includes several performance optimizations configured in `next.config.js`:

- **Bundle Splitting**: Separate chunks for vendor, common, Recharts, and Radix UI
- **Image Optimization**: AVIF and WebP formats with Next.js Image
- **SWC Minification**: Faster builds and smaller bundles
- **Security Headers**: HSTS, CSP, XSS protection configured
- **Code Removal**: Console logs removed in production

## Testing Strategy

### Unit Testing
- **Framework**: Jest with React Testing Library
- **Coverage threshold**: 60% minimum for all metrics
- **Test files**: Located in `src/**/__tests__/` or `*.test.ts(x)` files
- **Mocking**: Supabase, Next.js router, and fetch are pre-mocked in `jest.setup.js`

### E2E Testing  
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Test files**: Located in `e2e/` directory
- **Features tested**:
  - Authentication flows
  - Dashboard navigation
  - Follow-up management
  - Responsive design
  - Accessibility
  - Performance metrics
  - Error handling

### Running Tests

```bash
# Unit tests only
npm run test                # Watch mode
npm run test:ci            # Single run
npm run test:ci -- --coverage  # With coverage

# E2E tests only  
npm run test:e2e           # Headless mode
npx playwright test --ui   # UI mode for debugging
npx playwright show-report # View test report

# Run all tests
node scripts/test-all.js   # Comprehensive test suite
```

### Test Coverage Areas
- **Unit Tests**: Utils, error handling, API client (partial)
- **E2E Tests**: Auth, dashboard, follow-ups, responsive design
- **Coverage gaps**: Component tests, integration tests, API routes

### Known Testing Issues
- API client tests need refactoring to use Supabase instead of NextAuth
- Some auth E2E tests fail due to incomplete auth implementation
- Follow-up page tests have timing issues on mobile viewport

## Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Implement in appropriate directory
   - Write tests (aim for 60%+ coverage)
   - Run type checking and linting

2. **Before Committing**:
   ```bash
   npm run type-check
   npm run lint:fix
   npm run format
   npm run test:ci
   ```

3. **Bundle Analysis**:
   - Run `npm run build:analyze` to check bundle size
   - Lazy load heavy components when identified

## Common Tasks

### Adding a New Dashboard Page
1. Create page in `src/app/dashboard/[feature]/page.tsx`
2. Add navigation in `src/components/layout/MainNavigation.tsx`
3. Implement authentication check at layout level

### Creating a New API Route
1. Add route handler in `src/app/api/[endpoint]/route.ts`
2. Use centralized error handling from `src/lib/error-handler.ts`
3. Add types in `src/types/`

### Adding UI Components
1. Check if Radix UI primitive exists in `src/components/ui/`
2. Create feature-specific wrapper if needed
3. Use Tailwind classes with `cn()` utility for styling

### Integrating External Services
1. Create service file in `src/services/`
2. Add environment variables to `.env.local`
3. Update `.env.example` with placeholders
4. Use `src/lib/api-client.ts` for HTTP requests

## Debugging Tips

- Use Chrome DevTools with React Developer Tools extension
- Check Network tab for API calls and responses
- Verify environment variables are loaded correctly
- Check browser console for client-side errors
- Review server logs in terminal for SSR issues
- Use Playwright UI mode for E2E test debugging

## Production Deployment

The app is optimized for Vercel deployment but supports multiple platforms:

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t findworkai-frontend .
docker run -p 3000:3000 findworkai-frontend
```

### Traditional Node.js
```bash
npm run build
npm run start
```
