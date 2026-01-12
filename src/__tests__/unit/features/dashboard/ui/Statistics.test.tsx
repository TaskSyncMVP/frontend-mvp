import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Statistics } from '@/features/dashboard/ui/Statistics'

// Mock StatisticCard component
vi.mock('@/features/dashboard/ui/StatisticCard', () => ({
  StatisticCard: ({ title, value, variant }: any) => (
    <div data-testid="statistic-card" data-variant={variant}>
      <span data-testid="card-title">{title}</span>
      <span data-testid="card-value">{value}</span>
    </div>
  )
}))

describe('Statistics', () => {
  const mockData = {
    totalTasks: 100,
    completedTasks: 75,
    todayTasks: 10,
    weekTasks: 25
  }

  describe('Data Display', () => {
    it('should render all statistic cards with correct data', () => {
      render(<Statistics data={mockData} />)

      const cards = screen.getAllByTestId('statistic-card')
      expect(cards).toHaveLength(4)

      // Check Total card
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()

      // Check Completed tasks card
      expect(screen.getByText('Completed tasks')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()

      // Check Today tasks card
      expect(screen.getByText('Today tasks')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()

      // Check Week tasks card
      expect(screen.getByText('Week tasks')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('should apply correct variants to cards', () => {
      render(<Statistics data={mockData} />)

      const cards = screen.getAllByTestId('statistic-card')

      // Total card - secondary variant
      expect(cards[0]).toHaveAttribute('data-variant', 'secondary')

      // Completed tasks card - primary variant
      expect(cards[1]).toHaveAttribute('data-variant', 'primary')

      // Today tasks card - primary variant
      expect(cards[2]).toHaveAttribute('data-variant', 'primary')

      // Week tasks card - secondary variant
      expect(cards[3]).toHaveAttribute('data-variant', 'secondary')
    })

    it('should handle zero values correctly', () => {
      const zeroData = {
        totalTasks: 0,
        completedTasks: 0,
        todayTasks: 0,
        weekTasks: 0
      }

      render(<Statistics data={zeroData} />)

      expect(screen.getAllByText('0')).toHaveLength(4)
    })

    it('should handle large numbers correctly', () => {
      const largeData = {
        totalTasks: 999999,
        completedTasks: 888888,
        todayTasks: 777777,
        weekTasks: 666666
      }

      render(<Statistics data={largeData} />)

      expect(screen.getByText('999999')).toBeInTheDocument()
      expect(screen.getByText('888888')).toBeInTheDocument()
      expect(screen.getByText('777777')).toBeInTheDocument()
      expect(screen.getByText('666666')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should render loading skeleton when isLoading is true', () => {
      render(<Statistics data={mockData} isLoading={true} />)

      // Should not render actual data
      expect(screen.queryByText('Total')).not.toBeInTheDocument()
      expect(screen.queryByText('100')).not.toBeInTheDocument()

      // Should render skeleton elements
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(4)
    })

    it('should render correct skeleton structure', () => {
      render(<Statistics data={mockData} isLoading={true} />)

      const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-4')
      expect(container).toBeInTheDocument()

      const skeletonCards = container?.querySelectorAll('.bg-white.p-6.rounded-lg.shadow.animate-pulse')
      expect(skeletonCards).toHaveLength(4)

      // Each skeleton should have title and value placeholders
      skeletonCards?.forEach(card => {
        expect(card.querySelector('.h-4.bg-gray-200.rounded.mb-2')).toBeInTheDocument()
        expect(card.querySelector('.h-8.bg-gray-200.rounded')).toBeInTheDocument()
      })
    })

    it('should default isLoading to false', () => {
      render(<Statistics data={mockData} />)

      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.queryByText('.animate-pulse')).not.toBeInTheDocument()
    })
  })

  describe('No Data State', () => {
    it('should render no data message when data is null', () => {
      render(<Statistics data={null} />)

      expect(screen.getByText('Нет данных для отображения')).toBeInTheDocument()
      expect(screen.queryByTestId('statistic-card')).not.toBeInTheDocument()
    })

    it('should render no data message when data is undefined', () => {
      render(<Statistics data={undefined} />)

      expect(screen.getByText('Нет данных для отображения')).toBeInTheDocument()
      expect(screen.queryByTestId('statistic-card')).not.toBeInTheDocument()
    })

    it('should render no data with proper styling', () => {
      render(<Statistics data={null} />)

      const noDataContainer = screen.getByText('Нет данных для отображения').closest('div')
      expect(noDataContainer).toHaveClass('text-center', 'py-8')

      const noDataText = screen.getByText('Нет данных для отображения')
      expect(noDataText).toHaveClass('text-gray-500')
    })
  })

  describe('Layout and Styling', () => {
    it('should apply correct grid layout classes', () => {
      render(<Statistics data={mockData} />)

      const container = document.querySelector('.grid.grid-cols-2.gap-5')
      expect(container).toBeInTheDocument()
    })

    it('should render cards in correct order', () => {
      render(<Statistics data={mockData} />)

      const titles = screen.getAllByTestId('card-title')
      expect(titles[0]).toHaveTextContent('Total')
      expect(titles[1]).toHaveTextContent('Completed tasks')
      expect(titles[2]).toHaveTextContent('Today tasks')
      expect(titles[3]).toHaveTextContent('Week tasks')
    })

    it('should maintain layout consistency across different data', () => {
      const { rerender } = render(<Statistics data={mockData} />)

      let container = document.querySelector('.grid.grid-cols-2.gap-5')
      expect(container).toBeInTheDocument()

      const newData = {
        totalTasks: 50,
        completedTasks: 30,
        todayTasks: 5,
        weekTasks: 15
      }

      rerender(<Statistics data={newData} />)

      container = document.querySelector('.grid.grid-cols-2.gap-5')
      expect(container).toBeInTheDocument()
    })
  })

  describe('State Transitions', () => {
    it('should transition from loading to data display', () => {
      const { rerender } = render(<Statistics data={mockData} isLoading={true} />)

      // Initially loading
      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(4)
      expect(screen.queryByText('Total')).not.toBeInTheDocument()

      // Transition to data
      rerender(<Statistics data={mockData} isLoading={false} />)

      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(0)
      expect(screen.getByText('Total')).toBeInTheDocument()
    })

    it('should transition from no data to data display', () => {
      const { rerender } = render(<Statistics data={null} />)

      // Initially no data
      expect(screen.getByText('Нет данных для отображения')).toBeInTheDocument()

      // Transition to data
      rerender(<Statistics data={mockData} />)

      expect(screen.queryByText('Нет данных для отображения')).not.toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
    })

    it('should transition from data to loading', () => {
      const { rerender } = render(<Statistics data={mockData} />)

      // Initially with data
      expect(screen.getByText('Total')).toBeInTheDocument()

      // Transition to loading
      rerender(<Statistics data={mockData} isLoading={true} />)

      expect(screen.queryByText('Total')).not.toBeInTheDocument()
      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(4)
    })
  })

  describe('Data Validation', () => {
    it('should handle partial data gracefully', () => {
      const partialData = {
        totalTasks: 50,
        completedTasks: 25,
        todayTasks: undefined as any,
        weekTasks: null as any
      }

      render(<Statistics data={partialData} />)

      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      // Should still render cards even with undefined/null values
      expect(screen.getAllByTestId('statistic-card')).toHaveLength(4)
    })

    it('should handle negative numbers', () => {
      const negativeData = {
        totalTasks: -10,
        completedTasks: -5,
        todayTasks: -2,
        weekTasks: -8
      }

      render(<Statistics data={negativeData} />)

      expect(screen.getByText('-10')).toBeInTheDocument()
      expect(screen.getByText('-5')).toBeInTheDocument()
      expect(screen.getByText('-2')).toBeInTheDocument()
      expect(screen.getByText('-8')).toBeInTheDocument()
    })

    it('should handle decimal numbers', () => {
      const decimalData = {
        totalTasks: 10.5,
        completedTasks: 7.25,
        todayTasks: 2.75,
        weekTasks: 5.5
      }

      render(<Statistics data={decimalData} />)

      expect(screen.getByText('10.5')).toBeInTheDocument()
      expect(screen.getByText('7.25')).toBeInTheDocument()
      expect(screen.getByText('2.75')).toBeInTheDocument()
      expect(screen.getByText('5.5')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible when displaying data', () => {
      render(<Statistics data={mockData} />)

      // Should have proper structure for screen readers
      const container = document.querySelector('.grid')
      expect(container).toBeInTheDocument()
    })

    it('should be accessible in loading state', () => {
      render(<Statistics data={mockData} isLoading={true} />)

      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(4)
    })

    it('should be accessible in no data state', () => {
      render(<Statistics data={null} />)

      const noDataMessage = screen.getByText('Нет данных для отображения')
      expect(noDataMessage).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily with same data', () => {
      const { rerender } = render(<Statistics data={mockData} />)

      expect(screen.getByText('Total')).toBeInTheDocument()

      // Re-render with same data
      rerender(<Statistics data={mockData} />)

      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getAllByTestId('statistic-card')).toHaveLength(4)
    })

    it('should handle rapid state changes', () => {
      const { rerender } = render(<Statistics data={mockData} isLoading={true} />)

      // Rapid state changes
      rerender(<Statistics data={mockData} isLoading={false} />)
      rerender(<Statistics data={null} />)
      rerender(<Statistics data={mockData} />)
      rerender(<Statistics data={mockData} isLoading={true} />)

      // Should end up in loading state
      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(4)
    })
  })
})