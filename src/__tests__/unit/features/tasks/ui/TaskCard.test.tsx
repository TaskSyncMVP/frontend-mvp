import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/__tests__/utils/test-utils'
import { TaskCard } from '@/features/tasks/ui/TaskCard/TaskCard'
import { useUpdateTask } from '@/entities/task'

// Mock the dependencies
vi.mock('@/entities/task', () => ({
  useUpdateTask: vi.fn()
}))

vi.mock('@shared/lib/date-utils', () => ({
  formatTaskTime: vi.fn((time) => time ? '2:30 PM' : '12:00 AM')
}))

// Mock shared UI components
vi.mock('@shared/ui', () => ({
  TaskCheckbox: ({ level, checked, onCheckedChange, disabled }: any) => (
    <input
      type="checkbox"
      data-testid="task-checkbox"
      data-level={level}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
    />
  ),
  Badge: ({ variant, size, children }: any) => (
    <span data-testid="priority-badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  )
}))

describe('TaskCard', () => {
  const mockMutateAsync = vi.fn()
  const mockUpdateTask = {
    mutateAsync: mockMutateAsync,
    isPending: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateTask).mockReturnValue(mockUpdateTask as any)
  })

  const defaultProps = {
    id: '1',
    title: 'Test Task',
    status: 'pending',
    level: 'medium' as const,
    isCompleted: false,
    createdAt: '2025-01-12T14:30:00Z'
  }

  describe('Rendering', () => {
    it('should render task card with all elements', () => {
      render(<TaskCard {...defaultProps} />)

      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.getByText('2:30 PM')).toBeInTheDocument()
      expect(screen.getByTestId('task-checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('priority-badge')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
    })

    it('should render with default time when createdAt is not provided', () => {
      render(<TaskCard {...defaultProps} createdAt={undefined} />)

      expect(screen.getByText('12:00 AM')).toBeInTheDocument()
    })

    it('should render with different priority levels', () => {
      const { rerender } = render(<TaskCard {...defaultProps} level="high" />)
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.getByTestId('priority-badge')).toHaveAttribute('data-variant', 'high')

      rerender(<TaskCard {...defaultProps} level="low" />)
      expect(screen.getByText('Low')).toBeInTheDocument()
      expect(screen.getByTestId('priority-badge')).toHaveAttribute('data-variant', 'low')
    })

    it('should render checkbox with correct level', () => {
      render(<TaskCard {...defaultProps} level="high" />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).toHaveAttribute('data-level', 'high')
    })

    it('should render badge with mini size', () => {
      render(<TaskCard {...defaultProps} />)

      const badge = screen.getByTestId('priority-badge')
      expect(badge).toHaveAttribute('data-size', 'mini')
    })
  })

  describe('Completion State', () => {
    it('should render completed task with line-through style', () => {
      render(<TaskCard {...defaultProps} isCompleted={true} />)

      const title = screen.getByText('Test Task')
      expect(title).toHaveClass('line-through', 'text-muted')
    })

    it('should render incomplete task without line-through style', () => {
      render(<TaskCard {...defaultProps} isCompleted={false} />)

      const title = screen.getByText('Test Task')
      expect(title).toHaveClass('text-foreground')
      expect(title).not.toHaveClass('line-through', 'text-muted')
    })

    it('should render checkbox as checked when task is completed', () => {
      render(<TaskCard {...defaultProps} isCompleted={true} />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should render checkbox as unchecked when task is incomplete', () => {
      render(<TaskCard {...defaultProps} isCompleted={false} />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Toggle Functionality', () => {
    it('should call onToggle prop when provided', async () => {
      const mockOnToggle = vi.fn()
      render(<TaskCard {...defaultProps} onToggle={mockOnToggle} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      expect(mockOnToggle).toHaveBeenCalledWith(true)
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('should call updateTask mutation when onToggle is not provided', async () => {
      render(<TaskCard {...defaultProps} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          id: '1',
          data: { isCompleted: true }
        })
      })
    })

    it('should toggle from false to true', async () => {
      render(<TaskCard {...defaultProps} isCompleted={false} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          id: '1',
          data: { isCompleted: true }
        })
      })
    })

    it('should toggle from true to false', async () => {
      render(<TaskCard {...defaultProps} isCompleted={true} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          id: '1',
          data: { isCompleted: false }
        })
      })
    })

    it('should handle mutation error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))

      render(<TaskCard {...defaultProps} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to update task:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Loading State', () => {
    it('should disable checkbox when mutation is pending', () => {
      vi.mocked(useUpdateTask).mockReturnValue({
        ...mockUpdateTask,
        isPending: true
      } as any)

      render(<TaskCard {...defaultProps} />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('should enable checkbox when mutation is not pending', () => {
      vi.mocked(useUpdateTask).mockReturnValue({
        ...mockUpdateTask,
        isPending: false
      } as any)

      render(<TaskCard {...defaultProps} />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      render(<TaskCard {...defaultProps} />)

      // Task title should be in a heading
      const title = screen.getByText('Test Task')
      expect(title.tagName).toBe('H3')

      // Time should be in a heading
      const time = screen.getByText('2:30 PM')
      expect(time.tagName).toBe('H4')
    })

    it('should have proper alt text for clock icon', () => {
      render(<TaskCard {...defaultProps} />)

      const clockIcon = screen.getByAltText('Clock')
      expect(clockIcon).toBeInTheDocument()
    })

    it('should truncate long task titles', () => {
      const longTitle = 'This is a very long task title that should be truncated to prevent layout issues'
      render(<TaskCard {...defaultProps} title={longTitle} />)

      const title = screen.getByText(longTitle)
      expect(title).toHaveClass('truncate')
    })
  })

  describe('Layout and Styling', () => {
    it('should have proper grid layout', () => {
      render(<TaskCard {...defaultProps} />)

      const container = screen.getByText('Test Task').closest('div')?.parentElement
      expect(container).toHaveClass('grid', 'grid-cols-[1fr_auto]', 'items-center')
    })

    it('should have proper styling classes', () => {
      render(<TaskCard {...defaultProps} />)

      const container = screen.getByText('Test Task').closest('div')?.parentElement
      expect(container).toHaveClass(
        'w-full',
        'bg-white',
        'rounded-large',
        'px-4',
        'py-3',
        'shadow-drop',
        'border-border'
      )
    })

    it('should have proper gap spacing', () => {
      render(<TaskCard {...defaultProps} />)

      const container = screen.getByText('Test Task').closest('div')?.parentElement
      expect(container).toHaveClass('gap-4')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing title gracefully', () => {
      render(<TaskCard {...defaultProps} title="" />)

      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('')
    })

    it('should handle undefined level with default medium', () => {
      render(<TaskCard {...defaultProps} level={undefined} />)

      const checkbox = screen.getByTestId('task-checkbox')
      expect(checkbox).toHaveAttribute('data-level', 'medium')
    })

    it('should handle special characters in title', () => {
      const specialTitle = 'Task with émojis 🚀 and symbols @#$%'
      render(<TaskCard {...defaultProps} title={specialTitle} />)

      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })

    it('should handle very long task IDs', () => {
      const longId = 'very-long-task-id-that-might-be-generated-by-some-systems-12345678901234567890'
      render(<TaskCard {...defaultProps} id={longId} />)

      const checkbox = screen.getByTestId('task-checkbox')
      fireEvent.click(checkbox)

      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: longId,
        data: { isCompleted: true }
      })
    })
  })

  describe('Integration', () => {
    it('should work with all priority levels and completion states', () => {
      const priorities = ['low', 'medium', 'high'] as const
      const completionStates = [true, false]

      priorities.forEach(priority => {
        completionStates.forEach(isCompleted => {
          const { unmount } = render(
            <TaskCard
              {...defaultProps}
              level={priority}
              isCompleted={isCompleted}
            />
          )

          expect(screen.getByText(priority.charAt(0).toUpperCase() + priority.slice(1))).toBeInTheDocument()
          
          const checkbox = screen.getByTestId('task-checkbox')
          expect(checkbox.checked).toBe(isCompleted)

          unmount()
        })
      })
    })

    it('should maintain state consistency between props and UI', () => {
      const { rerender } = render(<TaskCard {...defaultProps} isCompleted={false} />)

      let checkbox = screen.getByTestId('task-checkbox')
      let title = screen.getByText('Test Task')

      expect(checkbox).not.toBeChecked()
      expect(title).not.toHaveClass('line-through')

      rerender(<TaskCard {...defaultProps} isCompleted={true} />)

      checkbox = screen.getByTestId('task-checkbox')
      title = screen.getByText('Test Task')

      expect(checkbox).toBeChecked()
      expect(title).toHaveClass('line-through')
    })
  })
})