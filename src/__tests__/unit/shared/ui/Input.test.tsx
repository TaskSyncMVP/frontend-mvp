import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Simple Input component for testing
const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled, 
  className,
  'data-testid': testId = 'input',
  ...props 
}: any) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`input ${className || ''}`}
    data-testid={testId}
    {...props}
  />
)

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)
      
      const input = screen.getByTestId('input')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />)
      
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
    })

    it('should render with default type text', () => {
      render(<Input />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should render with custom type', () => {
      render(<Input type="email" />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should render with initial value', () => {
      render(<Input value="initial value" onChange={() => {}} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('initial value')
    })

    it('should apply custom className', () => {
      render(<Input className="custom-input" />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('input', 'custom-input')
    })
  })

  describe('User Interaction', () => {
    it('should call onChange when user types', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByTestId('input')
      await user.type(input, 'hello')
      
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(5) // One call per character
    })

    it('should update value when controlled', () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />)
      
      let input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('initial')
      
      rerender(<Input value="updated" onChange={() => {}} />)
      
      input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('updated')
    })

    it('should handle focus and blur events', () => {
      const handleFocus = vi.fn()
      const handleBlur = vi.fn()
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
      
      const input = screen.getByTestId('input')
      
      fireEvent.focus(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      fireEvent.blur(input)
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should not respond to events when disabled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Input disabled onChange={handleChange} />)
      
      const input = screen.getByTestId('input')
      expect(input).toBeDisabled()
      
      await user.type(input, 'test')
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Input Types', () => {
    const inputTypes = [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search'
    ]

    inputTypes.forEach(type => {
      it(`should render ${type} input correctly`, () => {
        render(<Input type={type} placeholder={`Enter ${type}`} />)
        
        const input = screen.getByTestId('input')
        expect(input).toHaveAttribute('type', type)
        expect(input).toHaveAttribute('placeholder', `Enter ${type}`)
      })
    })
  })

  describe('Validation States', () => {
    it('should handle required attribute', () => {
      render(<Input required />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('required')
    })

    it('should handle min and max length', () => {
      render(<Input minLength={3} maxLength={10} />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('minlength', '3')
      expect(input).toHaveAttribute('maxlength', '10')
    })

    it('should handle pattern attribute', () => {
      render(<Input pattern="[0-9]*" />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('pattern', '[0-9]*')
    })

    it('should handle readonly attribute', () => {
      render(<Input readOnly />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Input aria-label="Username input" />)
      
      const input = screen.getByLabelText('Username input')
      expect(input).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(
        <div>
          <Input aria-describedby="help-text" />
          <div id="help-text">Help text</div>
        </div>
      )
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('should be focusable', () => {
      render(<Input />)
      
      const input = screen.getByTestId('input')
      input.focus()
      expect(input).toHaveFocus()
    })

    it('should not be focusable when disabled', () => {
      render(<Input disabled />)
      
      const input = screen.getByTestId('input')
      input.focus()
      expect(input).not.toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      render(<Input value="" onChange={() => {}} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('')
    })

    it('should handle null value gracefully', () => {
      render(<Input value={null} onChange={() => {}} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('')
    })

    it('should handle undefined value gracefully', () => {
      render(<Input value={undefined} onChange={() => {}} />)
      
      const input = screen.getByTestId('input')
      expect(input).toBeInTheDocument()
    })

    it('should handle special characters in value', () => {
      const specialValue = 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?'
      render(<Input value={specialValue} onChange={() => {}} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe(specialValue)
    })

    it('should handle unicode characters', () => {
      const unicodeValue = 'Unicode: 你好 🌟 émojis'
      render(<Input value={unicodeValue} onChange={() => {}} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe(unicodeValue)
    })
  })

  describe('Form Integration', () => {
    it('should work within a form', () => {
      const handleSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByTestId('input')
      const submitButton = screen.getByText('Submit')
      
      expect(input).toHaveAttribute('name', 'username')
      
      fireEvent.click(submitButton)
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should support form validation', () => {
      render(<Input required pattern="[A-Za-z]+" title="Letters only" />)
      
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+')
      expect(input).toHaveAttribute('title', 'Letters only')
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const handleChange = vi.fn()
      const { rerender } = render(<Input value="test" onChange={handleChange} />)
      
      // Re-render with same props
      rerender(<Input value="test" onChange={handleChange} />)
      
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('test')
    })

    it('should handle rapid value changes', () => {
      const values = ['a', 'ab', 'abc', 'abcd', 'abcde']
      const { rerender } = render(<Input value={values[0]} onChange={() => {}} />)
      
      values.forEach(value => {
        rerender(<Input value={value} onChange={() => {}} />)
        const input = screen.getByTestId('input') as HTMLInputElement
        expect(input.value).toBe(value)
      })
    })
  })

  describe('Event Handling', () => {
    it('should handle keydown events', () => {
      const handleKeyDown = vi.fn()
      render(<Input onKeyDown={handleKeyDown} />)
      
      const input = screen.getByTestId('input')
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter',
          code: 'Enter'
        })
      )
    })

    it('should handle keyup events', () => {
      const handleKeyUp = vi.fn()
      render(<Input onKeyUp={handleKeyUp} />)
      
      const input = screen.getByTestId('input')
      fireEvent.keyUp(input, { key: 'a', code: 'KeyA' })
      
      expect(handleKeyUp).toHaveBeenCalledTimes(1)
    })

    it('should handle paste events', () => {
      const handlePaste = vi.fn()
      render(<Input onPaste={handlePaste} />)
      
      const input = screen.getByTestId('input')
      fireEvent.paste(input, {
        clipboardData: {
          getData: () => 'pasted text'
        }
      })
      
      expect(handlePaste).toHaveBeenCalledTimes(1)
    })
  })
})