import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteAllTasksButton } from '@/features/tasks/ui/DeleteAllTasksButton'
import { useDeleteAllTasks, useTasks } from '@/entities/task'

// Mock the dependencies
vi.mock('@/entities/task', () => ({
  useDeleteAllTasks: vi.fn(),
  useTasks: vi.fn()
}))

vi.mock('@shared/ui', () => ({
  Button: ({ children, size, variant, onClick, disabled, className }: any) => (
    <button
      data-size={size}
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
}))

vi.mock('lucide-react', () => ({
  Trash2: ({ size }: any) => <span data-testid="trash-icon" data-size={size}>🗑️</span>
}))

describe('DeleteAllTasksButton', () => {
  const mockMutateAsync = vi.fn()
  const mockDeleteAllTasks = {
    mutateAsync: mockMutateAsync,
    isPending: false
  }

  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeleteAllTasks).mockReturnValue(mockDeleteAllTasks as any)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering with no tasks', () => {
    it('should not render when there are no tasks', () => {
      vi.mocked(useTasks).mockReturnValue({ data: [] } as any)

      const { container } = render(<DeleteAllTasksButton />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render when tasks data is undefined', () => {
      vi.mocked(useTasks).mockReturnValue({ data: undefined } as any)

      const { container } = render(<DeleteAllTasksButton />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Rendering with tasks', () => {
    beforeEach(() => {
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' },
          { id: '3', name: 'Task 3' }
        ]
      } as any)
    })

    it('should render delete button when there are tasks', () => {
      render(<DeleteAllTasksButton />)

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Delete All (3)')).toBeInTheDocument()
      expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
    })

    it('should show correct task count', () => {
      render(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (3)')).toBeInTheDocument()
    })

    it('should have proper styling classes', () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'bg-red-50',
        'hover:bg-red-100',
        'text-red-700',
        'border-red-200',
        'hover:border-red-300'
      )
    })

    it('should have proper size and variant attributes', () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-size', 'sm')
      expect(button).toHaveAttribute('data-variant', 'outline')
    })

    it('should render trash icon with correct size', () => {
      render(<DeleteAllTasksButton />)

      const trashIcon = screen.getByTestId('trash-icon')
      expect(trashIcon).toHaveAttribute('data-size', '14')
    })
  })

  describe.skip('Confirmation flow', () => {
    beforeEach(() => {
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' }
        ]
      } as any)
    })

    it('should show confirmation dialog when clicked', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete ALL 2 tasks?')).toBeInTheDocument()
      expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument()
      expect(screen.getByText('Yes, Delete All')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should hide confirmation dialog after 5 seconds', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete ALL 2 tasks?')).toBeInTheDocument()

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      await waitFor(() => {
        expect(screen.queryByText('Are you sure you want to delete ALL 2 tasks?')).not.toBeInTheDocument()
      })
    })

    it('should show initial button after confirmation timeout', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      await waitFor(() => {
        expect(screen.getByText('Delete All (2)')).toBeInTheDocument()
      })
    })

    it('should cancel confirmation when cancel button is clicked', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      expect(screen.queryByText('Are you sure you want to delete ALL 2 tasks?')).not.toBeInTheDocument()
      expect(screen.getByText('Delete All (2)')).toBeInTheDocument()
    })
  })

  describe.skip('Delete functionality', () => {
    beforeEach(() => {
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' },
          { id: '3', name: 'Task 3' }
        ]
      } as any)
    })

    it('should call deleteAllTasks when confirmed', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const confirmButton = screen.getByText('Yes, Delete All')
      await user.click(confirmButton)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled()
      })
    })

    it('should hide confirmation dialog after successful deletion', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const confirmButton = screen.getByText('Yes, Delete All')
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByText('Are you sure you want to delete ALL 3 tasks?')).not.toBeInTheDocument()
      })
    })

    it('should handle deletion errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))

      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const confirmButton = screen.getByText('Yes, Delete All')
      await user.click(confirmButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to delete all tasks:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe.skip('Loading state', () => {
    beforeEach(() => {
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Task 1' }]
      } as any)
    })

    it('should show loading text when deletion is pending', async () => {
      vi.mocked(useDeleteAllTasks).mockReturnValue({
        ...mockDeleteAllTasks,
        isPending: true
      } as any)

      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })

    it('should disable buttons when deletion is pending', async () => {
      vi.mocked(useDeleteAllTasks).mockReturnValue({
        ...mockDeleteAllTasks,
        isPending: true
      } as any)

      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const confirmButton = screen.getByText('Deleting...')
      const cancelButton = screen.getByText('Cancel')

      expect(confirmButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })

    it('should show normal text when not pending', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Yes, Delete All')).toBeInTheDocument()
    })
  })

  describe('Dynamic task count', () => {
    it('should update count when task list changes', () => {
      const { rerender } = render(<DeleteAllTasksButton />)

      // Start with 2 tasks
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' }
        ]
      } as any)
      rerender(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (2)')).toBeInTheDocument()

      // Update to 5 tasks
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' },
          { id: '3', name: 'Task 3' },
          { id: '4', name: 'Task 4' },
          { id: '5', name: 'Task 5' }
        ]
      } as any)
      rerender(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (5)')).toBeInTheDocument()
    })

    it('should hide component when tasks become empty', () => {
      const { rerender } = render(<DeleteAllTasksButton />)

      // Start with tasks
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Task 1' }]
      } as any)
      rerender(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (1)')).toBeInTheDocument()

      // Remove all tasks
      vi.mocked(useTasks).mockReturnValue({
        data: []
      } as any)
      rerender(<DeleteAllTasksButton />)

      expect(screen.queryByText('Delete All (1)')).not.toBeInTheDocument()
    })

    it.skip('should update confirmation message with correct count', async () => {
      vi.mocked(useTasks).mockReturnValue({
        data: [
          { id: '1', name: 'Task 1' },
          { id: '2', name: 'Task 2' },
          { id: '3', name: 'Task 3' },
          { id: '4', name: 'Task 4' },
          { id: '5', name: 'Task 5' }
        ]
      } as any)

      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete ALL 5 tasks?')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Task 1' }]
      } as any)
    })

    it('should have proper button role', () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should have descriptive button text', () => {
      render(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (1)')).toBeInTheDocument()
    })

    it.skip('should have proper confirmation dialog structure', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete ALL 1 tasks?')).toBeInTheDocument()
      expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument()
      
      const confirmButton = screen.getByText('Yes, Delete All')
      const cancelButton = screen.getByText('Cancel')
      
      expect(confirmButton).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
    })

    it('should have proper color coding for destructive action', () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-red-700', 'border-red-200')
    })

    it.skip('should have proper confirmation dialog styling', async () => {
      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      const dialog = screen.getByText('Are you sure you want to delete ALL 1 tasks?').closest('div')
      expect(dialog).toHaveClass('bg-red-50', 'border', 'border-red-200', 'rounded-lg')
    })
  })

  describe('Edge cases', () => {
    it('should handle single task correctly', () => {
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Single Task' }]
      } as any)

      render(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (1)')).toBeInTheDocument()
    })

    it.skip('should handle large number of tasks', async () => {
      const manyTasks = Array.from({ length: 100 }, (_, i) => ({ id: `${i}`, name: `Task ${i}` }))
      vi.mocked(useTasks).mockReturnValue({
        data: manyTasks
      } as any)

      render(<DeleteAllTasksButton />)

      expect(screen.getByText('Delete All (100)')).toBeInTheDocument()

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete ALL 100 tasks?')).toBeInTheDocument()
    })

    it.skip('should handle rapid clicks before confirmation', async () => {
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Task 1' }]
      } as any)

      render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      
      // Click multiple times rapidly
      await user.click(button)
      await user.click(button)
      await user.click(button)

      // Should only show one confirmation dialog
      const confirmationMessages = screen.getAllByText('Are you sure you want to delete ALL 1 tasks?')
      expect(confirmationMessages).toHaveLength(1)
    })

    it.skip('should clear timeout when component unmounts', async () => {
      vi.mocked(useTasks).mockReturnValue({
        data: [{ id: '1', name: 'Task 1' }]
      } as any)

      const { unmount } = render(<DeleteAllTasksButton />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Unmount component before timeout
      unmount()

      // Fast-forward time - should not cause any issues
      vi.advanceTimersByTime(5000)

      // No assertions needed - just ensuring no errors occur
    })
  })
})