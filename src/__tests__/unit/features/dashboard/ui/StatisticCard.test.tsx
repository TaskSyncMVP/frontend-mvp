import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatisticCard } from '@/features/dashboard/ui/StatisticCard'

describe('StatisticCard', () => {
  describe('Rendering', () => {
    it('should render with title and value', () => {
      render(<StatisticCard title="Total Tasks" value={42} />)

      expect(screen.getByText('Total Tasks')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should render with custom children', () => {
      render(
        <StatisticCard>
          <div data-testid="custom-content">Custom Content</div>
        </StatisticCard>
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })

    it('should render without title when not provided', () => {
      render(<StatisticCard value={100} />)

      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('should render without value when not provided', () => {
      render(<StatisticCard title="Empty Card" />)

      expect(screen.getByText('Empty Card')).toBeInTheDocument()
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })

    it('should render with value 0', () => {
      render(<StatisticCard title="Zero Tasks" value={0} />)

      expect(screen.getByText('Zero Tasks')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should render with primary variant', () => {
      render(<StatisticCard title="Primary Card" value={123} variant="primary" />)

      const card = screen.getByText('Primary Card').closest('div')
      expect(card).toHaveClass('bg-primary-100', 'text-white')
    })

    it('should render with secondary variant by default', () => {
      render(<StatisticCard title="Default Card" value={456} />)

      const card = screen.getByText('Default Card').closest('div')
      expect(card).toHaveClass('bg-white', 'text-text-main')
    })

    it('should render with secondary variant explicitly', () => {
      render(<StatisticCard title="Secondary Card" value={789} variant="secondary" />)

      const card = screen.getByText('Secondary Card').closest('div')
      expect(card).toHaveClass('bg-white', 'text-text-main')
    })
  })

  describe('Styling', () => {
    it('should apply base classes', () => {
      render(<StatisticCard title="Styled Card" value={999} />)

      const card = screen.getByText('Styled Card').closest('div')
      expect(card).toHaveClass('p-3', 'rounded-lg', '2xl:p-6', 'xl:p-4', 'shadow')
    })

    it('should apply custom className', () => {
      render(<StatisticCard title="Custom Class" value={111} className="custom-class" />)

      const card = screen.getByText('Custom Class').closest('div')
      expect(card).toHaveClass('custom-class')
    })

    it('should apply correct text colors for primary variant', () => {
      render(<StatisticCard title="Primary Text" value={222} variant="primary" />)

      const title = screen.getByText('Primary Text')
      const value = screen.getByText('222')

      expect(title).toHaveClass('text-white')
      expect(value).toHaveClass('text-white')
    })

    it('should apply correct text colors for secondary variant', () => {
      render(<StatisticCard title="Secondary Text" value={333} variant="secondary" />)

      const title = screen.getByText('Secondary Text')
      const value = screen.getByText('333')

      expect(title).toHaveClass('text-text-main')
      expect(value).toHaveClass('text-text-main')
    })
  })

  describe('Typography', () => {
    it('should apply correct title typography classes', () => {
      render(<StatisticCard title="Typography Test" value={444} />)

      const title = screen.getByText('Typography Test')
      expect(title).toHaveClass('text-sm', '2xl:text-lg', 'xl:text-base', 'font-regular')
    })

    it('should apply correct value typography classes', () => {
      render(<StatisticCard title="Value Typography" value={555} />)

      const value = screen.getByText('555')
      expect(value).toHaveClass('text-xl', '2xl:text-6xl', 'xl:text-5xl', 'font-semibold')
    })

    it('should render title as h3 element', () => {
      render(<StatisticCard title="Heading Test" value={666} />)

      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toHaveTextContent('Heading Test')
    })

    it('should render value as paragraph element', () => {
      render(<StatisticCard title="Paragraph Test" value={777} />)

      const value = screen.getByText('777')
      expect(value.tagName).toBe('P')
    })
  })

  describe('Content Priority', () => {
    it('should prioritize children over title and value', () => {
      render(
        <StatisticCard title="Should Not Show" value={888}>
          <div data-testid="priority-content">Priority Content</div>
        </StatisticCard>
      )

      expect(screen.getByTestId('priority-content')).toBeInTheDocument()
      expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument()
      expect(screen.queryByText('888')).not.toBeInTheDocument()
    })

    it('should render complex children content', () => {
      render(
        <StatisticCard>
          <div>
            <h4 data-testid="custom-title">Custom Title</h4>
            <span data-testid="custom-value">Custom Value</span>
            <button data-testid="custom-button">Action</button>
          </div>
        </StatisticCard>
      )

      expect(screen.getByTestId('custom-title')).toBeInTheDocument()
      expect(screen.getByTestId('custom-value')).toBeInTheDocument()
      expect(screen.getByTestId('custom-button')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      render(<StatisticCard title="Large Number" value={999999999} />)

      expect(screen.getByText('999999999')).toBeInTheDocument()
    })

    it('should handle negative numbers', () => {
      render(<StatisticCard title="Negative Number" value={-42} />)

      expect(screen.getByText('-42')).toBeInTheDocument()
    })

    it('should handle decimal numbers', () => {
      render(<StatisticCard title="Decimal Number" value={3.14} />)

      expect(screen.getByText('3.14')).toBeInTheDocument()
    })

    it('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines in the card'
      render(<StatisticCard title={longTitle} value={123} />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle empty string title', () => {
      render(<StatisticCard title="" value={456} />)

      // Empty title should still render h3 element but with empty content
      const title = screen.queryByRole('heading', { level: 3 })
      if (title) {
        expect(title).toHaveTextContent('')
      }
      expect(screen.getByText('456')).toBeInTheDocument()
    })

    it('should handle undefined value gracefully', () => {
      render(<StatisticCard title="Undefined Value" value={undefined} />)

      expect(screen.getByText('Undefined Value')).toBeInTheDocument()
      expect(screen.queryByText('undefined')).not.toBeInTheDocument()
    })

    it('should handle null value gracefully', () => {
      render(<StatisticCard title="Null Value" value={null as any} />)

      expect(screen.getByText('Null Value')).toBeInTheDocument()
      expect(screen.queryByText('null')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<StatisticCard title="Accessibility Test" value={789} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('should be keyboard accessible when interactive', () => {
      render(
        <StatisticCard>
          <button data-testid="interactive-button">Click me</button>
        </StatisticCard>
      )

      const button = screen.getByTestId('interactive-button')
      expect(button).toBeInTheDocument()
      
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should maintain proper contrast with variant styles', () => {
      const { container: primaryContainer } = render(
        <StatisticCard title="Primary Contrast" value={111} variant="primary" />
      )
      
      const { container: secondaryContainer } = render(
        <StatisticCard title="Secondary Contrast" value={222} variant="secondary" />
      )

      const primaryCard = primaryContainer.querySelector('.bg-primary-100')
      const secondaryCard = secondaryContainer.querySelector('.bg-white')

      expect(primaryCard).toBeInTheDocument()
      expect(secondaryCard).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should apply responsive padding classes', () => {
      render(<StatisticCard title="Responsive Test" value={999} />)

      const card = screen.getByText('Responsive Test').closest('div')
      expect(card).toHaveClass('p-3', '2xl:p-6', 'xl:p-4')
    })

    it('should apply responsive typography classes for title', () => {
      render(<StatisticCard title="Responsive Title" value={111} />)

      const title = screen.getByText('Responsive Title')
      expect(title).toHaveClass('text-sm', '2xl:text-lg', 'xl:text-base')
    })

    it('should apply responsive typography classes for value', () => {
      render(<StatisticCard title="Responsive Value" value={222} />)

      const value = screen.getByText('222')
      expect(value).toHaveClass('text-xl', '2xl:text-6xl', 'xl:text-5xl')
    })
  })
})