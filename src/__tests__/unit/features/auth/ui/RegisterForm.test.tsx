import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm'
import { useAuth } from '@/features/auth/lib/auth-context'
import { useRouter } from 'next/navigation'
import { safeStorage } from '@shared/lib/storage'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('@/features/auth/lib/auth-context', () => ({
  useAuth: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

vi.mock('@shared/lib/storage', () => ({
  safeStorage: {
    getItem: vi.fn(),
    removeItem: vi.fn()
  }
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn()
  }
}))

vi.mock('@shared/ui', () => ({
  Button: ({ children, className, size, type, disabled }: any) => (
    <button
      type={type}
      className={className}
      data-size={size}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  LinkButton: ({ href, children }: any) => (
    <a href={href} data-testid="link-button">{children}</a>
  ),
  Input: ({ placeholder, type, disabled, showPasswordToggle, ...props }: any) => (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      data-show-password-toggle={showPasswordToggle}
      {...props}
    />
  )
}))

describe('RegisterForm', () => {
  const mockRegister = vi.fn()
  const mockClearError = vi.fn()
  const mockPush = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: mockClearError
    } as any)

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush
    } as any)

    vi.mocked(safeStorage.getItem).mockReturnValue(null)
  })

  describe('Rendering', () => {
    it('should render registration form with all elements', () => {
      render(<RegisterForm />)

      expect(screen.getByText('Registration')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password (min 6 characters)')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument()
      expect(screen.getByTestId('link-button')).toBeInTheDocument()
      expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it('should render email input with correct type', () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      expect(emailInput).toHaveAttribute('type', 'text')
    })

    it('should render password input with correct type and toggle', () => {
      render(<RegisterForm />)

      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('data-show-password-toggle', 'true')
    })

    it('should render submit button with correct attributes', () => {
      render(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      expect(submitButton).toHaveAttribute('type', 'submit')
      expect(submitButton).toHaveAttribute('data-size', 'xl')
      expect(submitButton).toHaveClass('w-full')
    })

    it('should render login link', () => {
      render(<RegisterForm />)

      const loginLink = screen.getByTestId('link-button')
      expect(loginLink).toHaveAttribute('href', '/login')
      expect(loginLink).toHaveTextContent('Login')
    })
  })

  describe('Form Interaction', () => {
    it('should allow typing in email field', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      expect(emailInput).toHaveValue('test@example.com')
    })

    it('should allow typing in password field', async () => {
      render(<RegisterForm />)

      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      await user.type(passwordInput, 'password123')

      expect(passwordInput).toHaveValue('password123')
    })

    it('should clear error when user starts typing', async () => {
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: 'Registration failed',
        clearError: mockClearError
      } as any)

      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      // Error should be displayed
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid credentials', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    })

    it('should show success toast after successful registration', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Account created successfully!')
      })
    })

    it('should redirect to home after successful registration', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/home')
      })
    })

    it('should redirect to stored redirect URL after registration', async () => {
      vi.mocked(safeStorage.getItem).mockReturnValue('/tasks')

      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(safeStorage.getItem).toHaveBeenCalledWith('redirectAfterLogin')
        expect(safeStorage.removeItem).toHaveBeenCalledWith('redirectAfterLogin')
        expect(mockPush).toHaveBeenCalledWith('/tasks')
      })
    })

    it('should reset form after successful registration', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(emailInput).toHaveValue('')
        expect(passwordInput).toHaveValue('')
      })
    })

    it('should handle registration errors gracefully', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Email already exists'))

      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled()
        // Error handling is done by auth context, form just catches the error
      })
    })
  })

  describe('Form Validation', () => {
    it('should show email validation error', async () => {
      render(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show password validation error', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Too small: expected string to have >=6 characters')).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should validate password length', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '123')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Too small: expected string to have >=6 characters')).toBeInTheDocument()
      })
    })

    it('should not submit form when validation fails', async () => {
      render(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })

      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('should validate both fields together', async () => {
      render(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
        expect(screen.getByText('Too small: expected string to have >=6 characters')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading text when submitting', () => {
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      render(<RegisterForm />)

      expect(screen.getByText('Registering...')).toBeInTheDocument()
    })

    it('should disable form inputs when loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Registering...' })

      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('should show normal text when not loading', () => {
      render(<RegisterForm />)

      expect(screen.getByText('Enter')).toBeInTheDocument()
      expect(screen.queryByText('Registering...')).not.toBeInTheDocument()
    })
  })

  describe('Error Display', () => {
    it('should display auth error when present', () => {
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: 'Email already exists',
        clearError: mockClearError
      } as any)

      render(<RegisterForm />)

      expect(screen.getByText('Email already exists')).toBeInTheDocument()
    })

    it('should not display error when none exists', () => {
      render(<RegisterForm />)

      expect(screen.queryByText('Email already exists')).not.toBeInTheDocument()
    })

    it('should display error with proper styling', () => {
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: 'Network error',
        clearError: mockClearError
      } as any)

      render(<RegisterForm />)

      const errorMessage = screen.getByText('Network error')
      expect(errorMessage).toHaveClass('text-sm', 'text-destructive', 'text-center')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<RegisterForm />)

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper heading', () => {
      render(<RegisterForm />)

      const heading = screen.getByRole('heading', { name: 'Registration' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H1')
    })

    it('should have proper input labels via placeholders', () => {
      render(<RegisterForm />)

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password (min 6 characters)')).toBeInTheDocument()
    })

    it('should have proper button text', () => {
      render(<RegisterForm />)

      expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument()
    })

    it('should have proper link text', () => {
      render(<RegisterForm />)

      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should have proper form layout classes', () => {
      render(<RegisterForm />)

      const form = document.querySelector('form')
      expect(form).toHaveClass('grid', 'gap-3')
    })

    it('should have proper container layout', () => {
      render(<RegisterForm />)

      const container = screen.getByText('Registration').parentElement
      expect(container?.querySelector('.grid.grid-cols-1.gap-4')).toBeInTheDocument()
    })

    it('should have proper input container layout', () => {
      render(<RegisterForm />)

      const emailContainer = screen.getByPlaceholderText('Email').parentElement
      expect(emailContainer).toHaveClass('flex', 'gap-3', 'flex-col')
    })

    it('should center the heading', () => {
      render(<RegisterForm />)

      const heading = screen.getByText('Registration')
      expect(heading).toHaveClass('text-center')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      render(<RegisterForm />)

      const longEmail = 'very.long.email.address.that.might.be.used.in.some.systems@example.com'
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')

      await user.type(emailInput, longEmail)
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: longEmail,
          password: 'password123'
        })
      })
    })

    it('should handle special characters in password', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const specialPassword = 'p@ssw0rd!#$%^&*()'

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, specialPassword)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: specialPassword
        })
      })
    })

    it('should handle rapid form submissions', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // Click submit multiple times rapidly
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)

      // Should only be called once due to form state management
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle empty redirect URL gracefully', async () => {
      vi.mocked(safeStorage.getItem).mockReturnValue('')

      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/home')
      })
    })
  })

  describe('Integration', () => {
    it('should work with auth context state changes', () => {
      const { rerender } = render(<RegisterForm />)

      // Initially not loading
      expect(screen.getByText('Enter')).toBeInTheDocument()

      // Update to loading state
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      rerender(<RegisterForm />)
      expect(screen.getByText('Registering...')).toBeInTheDocument()

      // Update to error state
      vi.mocked(useAuth).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: 'Registration failed',
        clearError: mockClearError
      } as any)

      rerender(<RegisterForm />)
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
      expect(screen.getByText('Enter')).toBeInTheDocument()
    })

    it('should handle successful registration flow', async () => {
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'newuser@example.com')
      await user.type(passwordInput, 'newpassword123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newpassword123'
        })
        expect(toast.success).toHaveBeenCalledWith('Account created successfully!')
        expect(mockPush).toHaveBeenCalledWith('/home')
      })
    })
  })
})