import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock console.error to avoid noise in test output
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Should show error message
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/reload the page/i)).toBeInTheDocument()
  })

  it('should catch errors in nested components', () => {
    render(
      <ErrorBoundary>
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should log error details to console in development', () => {
    const consoleErrorSpy = console.error as jest.Mock
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should not propagate error to parent', () => {
    const ParentComponent = () => {
      const [hasError, setHasError] = React.useState(false)
      
      React.useEffect(() => {
        const handleError = () => setHasError(true)
        window.addEventListener('error', handleError)
        return () => window.removeEventListener('error', handleError)
      }, [])
      
      return (
        <div>
          {hasError && <div>Parent caught error</div>}
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </div>
      )
    }
    
    render(<ParentComponent />)
    
    // Error should be caught by ErrorBoundary, not parent
    expect(screen.queryByText('Parent caught error')).not.toBeInTheDocument()
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should render custom fallback if provided', () => {
    const CustomFallback = () => <div>Custom error message</div>
    
    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('should reset error state when children change', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    
    // Re-render with working component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    expect(screen.getByText('No error')).toBeInTheDocument()
  })
})
