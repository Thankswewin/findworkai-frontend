import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-input')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
    
    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-primary')
  })

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')
    
    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
    
    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'w-9')
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should apply custom className', () => {
    render(
      <Button className="custom-class extra-class">
        Custom Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class', 'extra-class')
  })

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Button with ref</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Button with ref')
  })

  it('should handle loading state', () => {
    render(
      <Button disabled>
        <span className="animate-spin">⟳</span> Loading...
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render with icon', () => {
    const Icon = () => <svg data-testid="icon" />
    
    render(
      <Button>
        <Icon />
        <span>With Icon</span>
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('should handle keyboard navigation', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard Button</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    expect(button).toHaveFocus()
    
    // Simulate Enter key press
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <Button aria-label="Custom label" aria-pressed="true">
        Accessible Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })
})
