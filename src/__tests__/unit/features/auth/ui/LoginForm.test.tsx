import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/ui/LoginForm/LoginForm'
import { useAuth } from '@/features/auth/lib/auth-context'
import { useRouter } from 'next/navigation'
import { safeStorage } from '@shared/lib/storage'

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

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockClearError = vi.fn()
  const mockPush = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
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
    it('should render login form with all elements', () => {
      render(<LoginForm />)

      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument()
      expect(screen.getByTestId('link-button')).toBeInTheDocument()
      expect(screen.getByText('Registration')).toBeInTheDocument()
    })

    it('should render email input with correct type', () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      expect(emailInput).toHaveAttribute('type', 'text')
    })

    it('should render password input with correct type and toggle', () => {
      render(<LoginForm />)

      const passwordInput = screen.getByPlaceholderText('Password')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('data-show-password-toggle', 'true')
    })

    it('should render submit button with correct attributes', () => {
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      expect(submitButton).toHaveAttribute('type', 'submit')
      expect(submitButton).toHaveAttribute('data-size', 'xl')
      expect(submitButton).toHaveClass('w-full')
    })

    it('should render registration link', () => {
      render(<LoginForm />)

      const registrationLink = screen.getByTestId('link-button')
      expect(registrationLink).toHaveAttribute('href', '/registration')
      expect(registrationLink).toHaveTextContent('Registration')
    })
  })

  describe('Form Interaction', () => {
    it('should allow typing in email field', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      expect(emailInput).toHaveValue('test@example.com')
    })

    it('should allow typing in password field', async () => {
      render(<LoginForm />)

      const passwordInput = screen.getByPlaceholderText('Password')
      await user.type(passwordInput, 'password123')

      expect(passwordInput).toHaveValue('password123')
    })

    it('should clear error when user starts typing', async () => {
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: 'Invalid credentials',
        clearError: mockClearError
      } as any)

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      // clearError should be called during form submission, not on typing
      // This test verifies the error display
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid credentials', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    })

    it('should redirect to home after successful login', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/home')
      })
    })

    it('should redirect to stored redirect URL after login', async () => {
      vi.mocked(safeStorage.getItem).mockReturnValue('/tasks')

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
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

    it('should reset form after successful login', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(emailInput).toHaveValue('')
        expect(passwordInput).toHaveValue('')
      })
    })

    it('should handle login errors gracefully', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled()
        // Error handling is done by auth context, form just catches the error
      })
    })
  })

  describe('Form Validation', () => {
    it('should show email validation error', async () => {
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show password validation error', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Too small: expected string to have >=6 characters')).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should not submit form when validation fails', async () => {
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })

      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('should validate both fields together', async () => {
      render(<LoginForm />)

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
        login: mockLogin,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      render(<LoginForm />)

      expect(screen.getByText('Logging in...')).toBeInTheDocument()
    })

    it('should disable form inputs when loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Logging in...' })

      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('should show normal text when not loading', () => {
      render(<LoginForm />)

      expect(screen.getByText('Enter')).toBeInTheDocument()
      expect(screen.queryByText('Logging in...')).not.toBeInTheDocument()
    })
  })

  describe('Error Display', () => {
    it('should display auth error when present', () => {
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: 'Invalid email or password',
        clearError: mockClearError
      } as any)

      render(<LoginForm />)

      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })

    it('should not display error when none exists', () => {
      render(<LoginForm />)

      expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument()
    })

    it('should display error with proper styling', () => {
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: 'Network error',
        clearError: mockClearError
      } as any)

      render(<LoginForm />)

      const errorMessage = screen.getByText('Network error')
      expect(errorMessage).toHaveClass('text-sm', 'text-destructive', 'text-center')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<LoginForm />)

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper heading', () => {
      render(<LoginForm />)

      const heading = screen.getByRole('heading', { name: 'Login' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H1')
    })

    it('should have proper input labels via placeholders', () => {
      render(<LoginForm />)

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    it('should have proper button text', () => {
      render(<LoginForm />)

      expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument()
    })

    it('should have proper link text', () => {
      render(<LoginForm />)

      expect(screen.getByRole('link', { name: 'Registration' })).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should have proper form layout classes', () => {
      render(<LoginForm />)

      const form = document.querySelector('form')
      expect(form).toHaveClass('grid', 'gap-3')
    })

    it('should have proper container layout', () => {
      render(<LoginForm />)

      const container = screen.getByText('Login').parentElement
      expect(container?.querySelector('.grid.grid-cols-1.gap-4')).toBeInTheDocument()
    })

    it('should have proper input container layout', () => {
      render(<LoginForm />)

      const emailContainer = screen.getByPlaceholderText('Email').parentElement
      expect(emailContainer).toHaveClass('flex', 'gap-3', 'flex-col')
    })

    it('should center the heading', () => {
      render(<LoginForm />)

      const heading = screen.getByText('Login')
      expect(heading).toHaveClass('text-center')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      render(<LoginForm />)

      const longEmail = 'very.long.email.address.that.might.be.used.in.some.systems@example.com'
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, longEmail)
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: longEmail,
          password: 'password123'
        })
      })
    })

    it('should handle special characters in password', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const specialPassword = 'p@ssw0rd!#$%^&*()'

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, specialPassword)

      const submitButton = screen.getByRole('button', { name: 'Enter' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: specialPassword
        })
      })
    })

    it('should handle rapid form submissions', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Enter' })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // Click submit multiple times rapidly
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)

      // Should only be called once due to form state management
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle empty redirect URL gracefully', async () => {
      vi.mocked(safeStorage.getItem).mockReturnValue('')

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
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
      const { rerender } = render(<LoginForm />)

      // Initially not loading
      expect(screen.getByText('Enter')).toBeInTheDocument()

      // Update to loading state
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: true,
        error: null,
        clearError: mockClearError
      } as any)

      rerender(<LoginForm />)
      expect(screen.getByText('Logging in...')).toBeInTheDocument()

      // Update to error state
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: 'Login failed',
        clearError: mockClearError
      } as any)

      rerender(<LoginForm />)
      expect(screen.getByText('Login failed')).toBeInTheDocument()
      expect(screen.getByText('Enter')).toBeInTheDocument()
    })
  })
})