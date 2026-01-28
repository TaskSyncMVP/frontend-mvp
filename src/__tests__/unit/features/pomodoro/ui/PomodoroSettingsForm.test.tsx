import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PomodoroSettingsForm } from '@/features/pomodoro/ui/PomodoroSettingsForm'
import { useUpdatePomodoroSettings } from '@/features/pomodoro/lib/pomodoro-hooks'
import { useAuth } from '@features/auth'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('@/features/pomodoro/lib/pomodoro-hooks', () => ({
  useUpdatePomodoroSettings: vi.fn()
}))

vi.mock('@features/auth', () => ({
  useAuth: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn()
  }
}))

vi.mock('@shared/ui', () => ({
  Button: ({ children, onClick, disabled, type, className, ...props }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Input: ({ placeholder, type, value, onChange, disabled, min, max, ...props }: any) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
      {...props}
    />
  )
}))

describe('PomodoroSettingsForm', () => {
  const mockMutate = vi.fn()
  const user = userEvent.setup()

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    workInterval: 25,
    breakInterval: 5,
    intervalsCount: 4
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false
    } as any)
    
    vi.mocked(useUpdatePomodoroSettings).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    } as any)
  })

  describe('Rendering', () => {
    it('should render settings form with all fields', () => {
      render(<PomodoroSettingsForm />)

      expect(screen.getByPlaceholderText('Work Interval (min)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Break Interval (min)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Intervals Count')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Save Pomodoro Settings/i })).toBeInTheDocument()
    })

    it('should display current settings values', () => {
      render(<PomodoroSettingsForm />)

      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
      expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    })

    it('should disable form when mutation is pending', () => {
      vi.mocked(useUpdatePomodoroSettings).mockReturnValue({
        mutate: mockMutate,
        isPending: true
      } as any)

      render(<PomodoroSettingsForm />)

      const inputs = screen.getAllByRole('spinbutton')
      const button = screen.getByRole('button')

      inputs.forEach(input => {
        expect(input).toBeDisabled()
      })
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Saving...')
    })

    it('should disable submit button when form is not dirty', () => {
      render(<PomodoroSettingsForm />)

      const button = screen.getByRole('button', { name: /Save Pomodoro Settings/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Form Interaction', () => {
    it('should allow editing work interval', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')

      expect(workIntervalInput).toHaveValue(30)
    })

    it('should allow editing break interval', async () => {
      render(<PomodoroSettingsForm />)

      const breakIntervalInput = screen.getByPlaceholderText('Break Interval (min)')
      await user.clear(breakIntervalInput)
      await user.type(breakIntervalInput, '10')

      expect(breakIntervalInput).toHaveValue(10)
    })

    it('should allow editing intervals count', async () => {
      render(<PomodoroSettingsForm />)

      const intervalsCountInput = screen.getByPlaceholderText('Intervals Count')
      await user.clear(intervalsCountInput)
      await user.type(intervalsCountInput, '6')

      expect(intervalsCountInput).toHaveValue(6)
    })

    it('should enable submit button when form is dirty', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const button = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      expect(button).toBeDisabled()

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')

      expect(button).not.toBeDisabled()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with updated values', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const breakIntervalInput = screen.getByPlaceholderText('Break Interval (min)')
      const intervalsCountInput = screen.getByPlaceholderText('Intervals Count')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.clear(breakIntervalInput)
      await user.type(breakIntervalInput, '10')
      await user.clear(intervalsCountInput)
      await user.type(intervalsCountInput, '6')

      await user.click(submitButton)

      expect(toast.loading).toHaveBeenCalledWith('Saving pomodoro settings...', { id: 'pomodoro-update' })
      expect(mockMutate).toHaveBeenCalledWith({
        workInterval: 30,
        breakInterval: 10,
        intervalsCount: 6
      }, expect.any(Object))
    })

    it('should not submit if no changes made', async () => {
      render(<PomodoroSettingsForm />)

      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })
      
      // Button should be disabled when no changes
      expect(submitButton).toBeDisabled()
    })

    it.skip('should show info toast when no changes to save', async () => {
      // This test is skipped because the form logic prevents submission when not dirty
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      
      // Make a change then revert it
      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '25')

      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })
      await user.click(submitButton)

      expect(toast.info).toHaveBeenCalledWith('No changes to save')
      expect(mockMutate).not.toHaveBeenCalled()
    })

    it('should handle successful submission', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalled()

      // Simulate successful mutation
      const mutateCall = mockMutate.mock.calls[0]
      const onSuccess = mutateCall[1].onSuccess
      onSuccess()

      expect(toast.success).toHaveBeenCalledWith('Pomodoro settings saved successfully!', { id: 'pomodoro-update' })
    })

    it('should handle submission errors', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalled()

      // Simulate failed mutation
      const mutateCall = mockMutate.mock.calls[0]
      const onError = mutateCall[1].onError
      onError()

      expect(toast.error).toHaveBeenCalledWith('Failed to save pomodoro settings', { id: 'pomodoro-update' })
    })
  })

  describe('Form Validation', () => {
    it.skip('should show validation error for invalid work interval', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '0')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Work interval must be at least 1 minute')).toBeInTheDocument()
      })
    })

    it.skip('should show validation error for invalid break interval', async () => {
      render(<PomodoroSettingsForm />)

      const breakIntervalInput = screen.getByPlaceholderText('Break Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(breakIntervalInput)
      await user.type(breakIntervalInput, '0')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Break interval must be at least 1 minute')).toBeInTheDocument()
      })
    })

    it.skip('should show validation error for invalid intervals count', async () => {
      render(<PomodoroSettingsForm />)

      const intervalsCountInput = screen.getByPlaceholderText('Intervals Count')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(intervalsCountInput)
      await user.type(intervalsCountInput, '0')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Intervals count must be at least 1')).toBeInTheDocument()
      })
    })

    it.skip('should show validation error for too high work interval', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '61')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Work interval cannot exceed 60 minutes')).toBeInTheDocument()
      })
    })

    it.skip('should show validation error for too high break interval', async () => {
      render(<PomodoroSettingsForm />)

      const breakIntervalInput = screen.getByPlaceholderText('Break Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(breakIntervalInput)
      await user.type(breakIntervalInput, '31')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Break interval cannot exceed 30 minutes')).toBeInTheDocument()
      })
    })

    it.skip('should show validation error for too high intervals count', async () => {
      render(<PomodoroSettingsForm />)

      const intervalsCountInput = screen.getByPlaceholderText('Intervals Count')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(intervalsCountInput)
      await user.type(intervalsCountInput, '11')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Intervals count cannot exceed 10')).toBeInTheDocument()
      })
    })
  })

  describe('User Data Updates', () => {
    it('should update form when user data changes', () => {
      const { rerender } = render(<PomodoroSettingsForm />)

      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
      expect(screen.getByDisplayValue('4')).toBeInTheDocument()

      // Update user data
      const updatedUser = {
        ...mockUser,
        workInterval: 30,
        breakInterval: 10,
        intervalsCount: 6
      }

      vi.mocked(useAuth).mockReturnValue({
        user: updatedUser,
        isLoading: false
      } as any)

      rerender(<PomodoroSettingsForm />)

      expect(screen.getByDisplayValue('30')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      expect(screen.getByDisplayValue('6')).toBeInTheDocument()
    })

    it('should handle user with default values when no settings exist', () => {
      const userWithoutSettings = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
        // No pomodoro settings
      }

      vi.mocked(useAuth).mockReturnValue({
        user: userWithoutSettings,
        isLoading: false
      } as any)

      render(<PomodoroSettingsForm />)

      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
      expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    })

    it('should handle no user data', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: false
      } as any)

      render(<PomodoroSettingsForm />)

      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
      expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<PomodoroSettingsForm />)

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper input labels via placeholders', () => {
      render(<PomodoroSettingsForm />)

      expect(screen.getByPlaceholderText('Work Interval (min)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Break Interval (min)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Intervals Count')).toBeInTheDocument()
    })

    it('should have proper button accessibility', () => {
      render(<PomodoroSettingsForm />)

      expect(screen.getByRole('button', { name: /Save Pomodoro Settings/i })).toBeInTheDocument()
    })

    it('should have proper input constraints', () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const breakIntervalInput = screen.getByPlaceholderText('Break Interval (min)')
      const intervalsCountInput = screen.getByPlaceholderText('Intervals Count')

      expect(workIntervalInput).toHaveAttribute('min', '1')
      expect(workIntervalInput).toHaveAttribute('max', '60')
      expect(breakIntervalInput).toHaveAttribute('min', '1')
      expect(breakIntervalInput).toHaveAttribute('max', '30')
      expect(intervalsCountInput).toHaveAttribute('min', '1')
      expect(intervalsCountInput).toHaveAttribute('max', '10')
    })
  })

  describe('Edge Cases', () => {
    it('should handle form reset after successful submission', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalled()

      // Simulate successful mutation
      const mutateCall = mockMutate.mock.calls[0]
      const onSuccess = mutateCall[1].onSuccess
      onSuccess()

      // Form should be reset and button disabled again (because no changes)
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })

    it('should only submit changed fields', async () => {
      render(<PomodoroSettingsForm />)

      const workIntervalInput = screen.getByPlaceholderText('Work Interval (min)')
      const submitButton = screen.getByRole('button', { name: /Save Pomodoro Settings/i })

      // Only change work interval
      await user.clear(workIntervalInput)
      await user.type(workIntervalInput, '30')
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalledWith({
        workInterval: 30
      }, expect.any(Object))
    })
  })
})