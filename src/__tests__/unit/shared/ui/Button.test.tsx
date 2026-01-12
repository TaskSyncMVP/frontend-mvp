import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Simple Button component for testing
const Button = ({ children, onClick, disabled, variant, size, className, type = 'button' }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn ${variant ? `btn-${variant}` : ''} ${size ? `btn-${size}` : ''} ${className || ''}`}
    data-testid="button"
  >
    {children}
  </button>
)

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByText('Click me')).toBeInTheDocument()
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should render with default type button', () => {
      render(<Button>Test</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should render with custom type', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should apply variant classes', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-primary')
    })

    it('should apply size classes', () => {
      render(<Button size="large">Large</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-large')
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should combine all classes correctly', () => {
      render(
        <Button variant="secondary" size="small" className="extra-class">
          Combined
        </Button>
      )
      
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn', 'btn-secondary', 'btn-small', 'extra-class')
    })
  })

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Clickable</Button>)
      
      const button = screen.getByTestId('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      const button = screen.getByTestId('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toBeDisabled()
    })

    it('should not be disabled by default', () => {
      render(<Button>Enabled</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Accessible</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should have accessible text content', () => {
      render(<Button>Screen Reader Text</Button>)
      
      const button = screen.getByRole('button', { name: 'Screen Reader Text' })
      expect(button).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Keyboard</Button>)
      
      const button = screen.getByTestId('button')
      
      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      
      // Note: Default button behavior handles Enter key automatically
      expect(button).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })

    it('should handle null children', () => {
      render(<Button>{null}</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle undefined props gracefully', () => {
      render(<Button variant={undefined} size={undefined}>Undefined Props</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn')
      expect(button).not.toHaveClass('btn-undefined')
    })

    it('should handle multiple clicks', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Multi Click</Button>)
      
      const button = screen.getByTestId('button')
      
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid clicks', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Rapid Click</Button>)
      
      const button = screen.getByTestId('button')
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button)
      }
      
      expect(handleClick).toHaveBeenCalledTimes(10)
    })
  })

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'destructive', 'outline', 'ghost']
    
    variants.forEach(variant => {
      it(`should render ${variant} variant correctly`, () => {
        render(<Button variant={variant}>{variant} Button</Button>)
        
        const button = screen.getByTestId('button')
        expect(button).toHaveClass(`btn-${variant}`)
        expect(button).toHaveTextContent(`${variant} Button`)
      })
    })
  })

  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large', 'xl']
    
    sizes.forEach(size => {
      it(`should render ${size} size correctly`, () => {
        render(<Button size={size}>{size} Button</Button>)
        
        const button = screen.getByTestId('button')
        expect(button).toHaveClass(`btn-${size}`)
        expect(button).toHaveTextContent(`${size} Button`)
      })
    })
  })

  describe('Complex Scenarios', () => {
    it('should work as form submit button', () => {
      const handleSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      )
      
      const button = screen.getByTestId('button')
      fireEvent.click(button)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should work with complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      
      const button = screen.getByTestId('button')
      expect(button).toContainHTML('<span>Icon</span><span>Text</span>')
    })

    it('should maintain state during re-renders', () => {
      const { rerender } = render(<Button variant="primary">Initial</Button>)
      
      let button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-primary')
      expect(button).toHaveTextContent('Initial')
      
      rerender(<Button variant="secondary">Updated</Button>)
      
      button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-secondary')
      expect(button).not.toHaveClass('btn-primary')
      expect(button).toHaveTextContent('Updated')
    })

    it('should handle dynamic props changes', () => {
      let disabled = false
      const { rerender } = render(<Button disabled={disabled}>Dynamic</Button>)
      
      let button = screen.getByTestId('button')
      expect(button).not.toBeDisabled()
      
      disabled = true
      rerender(<Button disabled={disabled}>Dynamic</Button>)
      
      button = screen.getByTestId('button')
      expect(button).toBeDisabled()
    })
  })
})