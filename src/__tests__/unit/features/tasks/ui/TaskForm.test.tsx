import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '@/features/tasks/ui/TaskForm'

// Mock shared UI components
vi.mock('@shared/ui', () => ({
  Button: ({ children, type, variant, size, className, disabled, onClick }: any) => (
    <button
      type={type}
      data-variant={variant}
      data-size={size}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Input: ({ placeholder, disabled, className, ...props }: any) => (
    <input
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  ),
  Badge: ({ variant, className, children, onClick }: any) => (
    <span
      data-testid={`priority-${variant}`}
      data-variant={variant}
      className={className}
      onClick={onClick}
      role="button"
    >
      {children}
    </span>
  ),
  Label: ({ children, className }: any) => (
    <label className={className}>{children}</label>
  )
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  X: () => <span data-testid="x-icon">✕</span>
}))

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel
  }

  describe('Rendering', () => {
    it('should render form with all elements', () => {
      render(<TaskForm {...defaultProps} />)

      expect(screen.getByPlaceholderText('Enter task name')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByTestId('priority-high')).toBeInTheDocument()
      expect(screen.getByTestId('priority-medium')).toBeInTheDocument()
      expect(screen.getByTestId('priority-low')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /✓/ })).toBeInTheDocument()
    })

    it('should render header when showHeader is true', () => {
      render(<TaskForm {...defaultProps} showHeader={true} />)

      expect(screen.getByText('New Task')).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('should not render header when showHeader is false', () => {
      render(<TaskForm {...defaultProps} showHeader={false} />)

      expect(screen.queryByText('New Task')).not.toBeInTheDocument()
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
    })

    it('should render with different variants', () => {
      const { rerender } = render(<TaskForm {...defaultProps} variant="default" />)
      
      // Check default variant classes are applied
      let form = document.querySelector('form')
      expect(form).toHaveClass('bg-white')

      rerender(<TaskForm {...defaultProps} variant="primary" />)
      
      // Check primary variant classes are applied
      form = document.querySelector('form')
      expect(form).toHaveClass('bg-primary-100', 'text-white')
    })

    it('should apply custom className', () => {
      render(<TaskForm {...defaultProps} className="custom-class" />)

      const form = document.querySelector('form')
      expect(form).toHaveClass('custom-class')
    })
  })

  describe('Form Interaction', () => {
    it('should allow typing in name input', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      await user.type(nameInput, 'New Task')

      expect(nameInput).toHaveValue('New Task')
    })

    it('should allow selecting priority', async () => {
      render(<TaskForm {...defaultProps} />)

      const highPriority = screen.getByTestId('priority-high')
      await user.click(highPriority)

      // Medium should be selected by default, then high after click
      expect(highPriority).toHaveClass('ring-2', 'ring-primary-100', 'shadow-lg')
    })

    it('should have medium priority selected by default', () => {
      render(<TaskForm {...defaultProps} />)

      const mediumPriority = screen.getByTestId('priority-medium')
      expect(mediumPriority).toHaveClass('ring-2', 'ring-primary-100', 'shadow-lg')
    })

    it('should switch between priority levels', async () => {
      render(<TaskForm {...defaultProps} />)

      const lowPriority = screen.getByTestId('priority-low')
      const highPriority = screen.getByTestId('priority-high')

      await user.click(lowPriority)
      expect(lowPriority).toHaveClass('ring-2', 'ring-primary-100', 'shadow-lg')

      await user.click(highPriority)
      expect(highPriority).toHaveClass('ring-2', 'ring-primary-100', 'shadow-lg')
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: 'Test Task',
            priority: 'medium'
          },
          undefined
        )
      })
    })

    it('should submit form with target date when provided', async () => {
      render(<TaskForm {...defaultProps} targetDate="2025-01-15" />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: 'Test Task',
            priority: 'medium'
          },
          '2025-01-15'
        )
      })
    })

    it('should submit form with selected priority', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const highPriority = screen.getByTestId('priority-high')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'High Priority Task')
      await user.click(highPriority)
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: 'High Priority Task',
            priority: 'high'
          },
          undefined
        )
      })
    })

    it('should reset form after successful submission', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(nameInput).toHaveValue('')
      })
    })

    it('should handle async onSubmit', async () => {
      const asyncOnSubmit = vi.fn().mockResolvedValue(undefined)
      render(<TaskForm {...defaultProps} onSubmit={asyncOnSubmit} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Async Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(asyncOnSubmit).toHaveBeenCalled()
      })
    })

    it('should handle onSubmit errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorOnSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'))
      
      render(<TaskForm {...defaultProps} onSubmit={errorOnSubmit} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Error Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to create task:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Form Validation', () => {
    it('should show error for empty name', async () => {
      render(<TaskForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Task name is required')).toBeInTheDocument()
      })
    })

    it('should show error for name that is too long', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const longName = 'a'.repeat(101) // Exceeds 100 character limit
      
      await user.type(nameInput, longName)
      
      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Task name too long')).toBeInTheDocument()
      })
    })

    it('should trim whitespace from name', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      await user.type(nameInput, '  Trimmed Task  ')
      
      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: 'Trimmed Task',
            priority: 'medium'
          },
          undefined
        )
      })
    })

    it('should not submit when validation fails', async () => {
      render(<TaskForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Task name is required')).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      render(<TaskForm {...defaultProps} showHeader={true} />)

      const cancelButton = screen.getByTestId('x-icon').closest('button')
      await user.click(cancelButton!)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should not render cancel button when onCancel is not provided', () => {
      render(<TaskForm onSubmit={mockOnSubmit} showHeader={true} />)

      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should disable all inputs when disabled prop is true', () => {
      render(<TaskForm {...defaultProps} disabled={true} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      expect(nameInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('should disable priority selection when disabled', async () => {
      render(<TaskForm {...defaultProps} disabled={true} />)

      const highPriority = screen.getByTestId('priority-high')
      expect(highPriority).toHaveClass('opacity-50', 'cursor-not-allowed')

      // Should not respond to clicks when disabled
      await user.click(highPriority)
      expect(highPriority).not.toHaveClass('ring-2')
    })

    it('should disable cancel button when disabled', () => {
      render(<TaskForm {...defaultProps} disabled={true} showHeader={true} />)

      const cancelButton = screen.getByTestId('x-icon').closest('button')
      expect(cancelButton).toBeDisabled()
    })

    it('should show loading state during submission', async () => {
      const slowOnSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      render(<TaskForm {...defaultProps} onSubmit={slowOnSubmit} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Loading Task')
      await user.click(submitButton)

      // During submission, form should be disabled
      expect(nameInput).toBeDisabled()
      expect(submitButton).toBeDisabled()

      await waitFor(() => {
        expect(slowOnSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Variant Styling', () => {
    it('should apply primary variant styles', () => {
      render(<TaskForm {...defaultProps} variant="primary" showHeader={true} />)

      const form = document.querySelector('form')
      expect(form).toHaveClass('bg-primary-100', 'text-white')

      const labels = screen.getAllByText(/Name|Priority/)
      labels.forEach(label => {
        expect(label).toHaveClass('text-white')
      })
    })

    it('should apply default variant styles', () => {
      render(<TaskForm {...defaultProps} variant="default" />)

      const form = document.querySelector('form')
      expect(form).toHaveClass('bg-white')
    })

    it('should style priority badges correctly for primary variant', () => {
      render(<TaskForm {...defaultProps} variant="primary" />)

      const mediumPriority = screen.getByTestId('priority-medium')
      expect(mediumPriority).toHaveClass('ring-2', 'ring-white', 'shadow-lg')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<TaskForm {...defaultProps} />)

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()

      const nameInput = screen.getByPlaceholderText('Enter task name')
      expect(nameInput).toBeInTheDocument()

      const submitButton = screen.getByRole('button', { name: /✓/ })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should have proper labels for form fields', () => {
      render(<TaskForm {...defaultProps} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
    })

    it('should have proper button roles for priority selection', () => {
      render(<TaskForm {...defaultProps} />)

      const priorities = ['high', 'medium', 'low']
      priorities.forEach(priority => {
        const badge = screen.getByTestId(`priority-${priority}`)
        expect(badge).toHaveAttribute('role', 'button')
      })
    })

    it('should show validation errors with proper styling', async () => {
      render(<TaskForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText('Task name is required')
        expect(errorMessage).toHaveClass('text-sm', 'text-destructive')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid form submissions', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const submitButton = screen.getByRole('button', { name: /✓/ })

      await user.type(nameInput, 'Rapid Task')
      
      // Click submit multiple times rapidly
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)

      // Should only be called once due to disabled state during submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle special characters in task name', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const specialName = 'Task with émojis 🚀 and symbols @#$%'
      
      await user.type(nameInput, specialName)
      
      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: specialName,
            priority: 'medium'
          },
          undefined
        )
      })
    })

    it('should handle maximum length task name', async () => {
      render(<TaskForm {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Enter task name')
      const maxLengthName = 'a'.repeat(100) // Exactly 100 characters
      
      await user.type(nameInput, maxLengthName)
      
      const submitButton = screen.getByRole('button', { name: /✓/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            name: maxLengthName,
            priority: 'medium'
          },
          undefined
        )
      })
    })
  })
})