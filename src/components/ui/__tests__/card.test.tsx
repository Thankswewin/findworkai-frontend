import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      )
      
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Card className="custom-card">Content</Card>
      )
      
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('border')
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Card with ref</Card>)
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('Card with ref')
    })
  })

  describe('CardHeader', () => {
    it('should render header with correct styles', () => {
      const { container } = render(
        <CardHeader>
          <div>Header content</div>
        </CardHeader>
      )
      
      const header = container.firstChild
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('space-y-1.5')
      expect(header).toHaveClass('p-6')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <CardHeader className="custom-header">Header</CardHeader>
      )
      
      expect(container.firstChild).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('should render title as h3', () => {
      render(<CardTitle>Card Title</CardTitle>)
      
      const title = screen.getByText('Card Title')
      expect(title.tagName).toBe('H3')
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveClass('leading-none')
      expect(title).toHaveClass('tracking-tight')
    })

    it('should apply custom className', () => {
      render(<CardTitle className="text-xl">Custom Title</CardTitle>)
      
      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('text-xl')
    })
  })

  describe('CardDescription', () => {
    it('should render description with correct styles', () => {
      render(<CardDescription>Card description text</CardDescription>)
      
      const description = screen.getByText('Card description text')
      expect(description.tagName).toBe('P')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render content with padding', () => {
      const { container } = render(
        <CardContent>
          <div>Main content</div>
        </CardContent>
      )
      
      const content = container.firstChild
      expect(content).toHaveClass('p-6')
      expect(content).toHaveClass('pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render footer with flex layout', () => {
      const { container } = render(
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      )
      
      const footer = container.firstChild
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('p-6')
      expect(footer).toHaveClass('pt-0')
    })
  })

  describe('Complete Card Composition', () => {
    it('should render a complete card with all subcomponents', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Save</button>
            <button>Cancel</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is a test card')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should maintain proper hierarchy', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      
      const card = container.querySelector('.rounded-xl')
      const header = card?.querySelector('.flex.flex-col.space-y-1\\.5')
      const title = header?.querySelector('h3')
      
      expect(card).toBeInTheDocument()
      expect(header).toBeInTheDocument()
      expect(title).toHaveTextContent('Title')
    })
  })
})
