import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroCircle } from '@/features/pomodoro/ui/PomodoroCircle'

describe('PomodoroCircle', () => {
  const defaultProps = {
    progress: 50,
    timeDisplay: '12:30',
    isWorkSession: true,
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        render(<PomodoroCircle {...defaultProps} />)
      }).not.toThrow()
    })

    it('should display the time correctly', () => {
      render(<PomodoroCircle {...defaultProps} />)
      
      expect(screen.getByText('12:30')).toBeInTheDocument()
    })

    it('should render SVG circle elements', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '224')
      expect(svg).toHaveAttribute('height', '224')
    })

    it('should render two circle elements', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const circles = container.querySelectorAll('circle')
      expect(circles).toHaveLength(2)
    })

    it('should apply correct radius to circles', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const circles = container.querySelectorAll('circle')
      circles.forEach(circle => {
        expect(circle).toHaveAttribute('r', '95')
      })
    })
  })

  describe('Progress Visualization', () => {
    it('should set stroke-dasharray attribute correctly', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={0} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      const circumference = 2 * Math.PI * 95
      expect(progressCircle).toHaveAttribute('stroke-dasharray', circumference.toString())
    })

    it('should set stroke-dashoffset attribute for 50% progress', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={50} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      const circumference = 2 * Math.PI * 95
      const expectedOffset = circumference - (50 / 100) * circumference
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString())
    })

    it('should set stroke-dashoffset attribute for 100% progress', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={100} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', '0')
    })

    it('should set stroke-dashoffset attribute for 0% progress', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={0} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      const circumference = 2 * Math.PI * 95
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', circumference.toString())
    })
  })

  describe('Work Session Styling', () => {
    it('should use work colors for work session', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} isWorkSession={true} />
      )
      
      const [backgroundCircle, progressCircle] = container.querySelectorAll('circle')
      
      expect(backgroundCircle).toHaveAttribute('stroke', 'rgba(244, 120, 184, 0.15)')
      expect(progressCircle).toHaveAttribute('stroke', 'rgba(244, 120, 184, 1)')
    })

    it('should use break colors for break session', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} isWorkSession={false} />
      )
      
      const [backgroundCircle, progressCircle] = container.querySelectorAll('circle')
      
      expect(backgroundCircle).toHaveAttribute('stroke', 'rgba(120, 244, 184, 0.15)')
      expect(progressCircle).toHaveAttribute('stroke', 'rgba(120, 244, 184, 1)')
    })
  })

  describe('Time Display', () => {
    it('should display different time formats correctly', () => {
      const timeFormats = ['00:00', '25:00', '05:30', '99:59']
      
      timeFormats.forEach(time => {
        const { rerender } = render(
          <PomodoroCircle {...defaultProps} timeDisplay={time} />
        )
        
        expect(screen.getByText(time)).toBeInTheDocument()
        
        rerender(<PomodoroCircle {...defaultProps} timeDisplay="00:00" />)
      })
    })

    it('should center the time display', () => {
      render(<PomodoroCircle {...defaultProps} />)
      
      const timeElement = screen.getByText('12:30')
      const container = timeElement.closest('div')
      
      expect(container).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center')
    })

    it('should apply correct typography classes', () => {
      render(<PomodoroCircle {...defaultProps} />)
      
      const timeElement = screen.getByText('12:30')
      expect(timeElement).toHaveClass('text-4xl', 'font-black', 'text-text-main', 'nunito-font')
    })
  })

  describe('Styling and Animation', () => {
    it('should apply rotation transform to SVG', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('transform', '-rotate-90')
    })

    it('should apply stroke properties to progress circle', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round')
      expect(progressCircle).toHaveAttribute('stroke-width', '12')
      expect(progressCircle).toHaveAttribute('fill', 'none')
    })

    it('should apply transition styles', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const [backgroundCircle, progressCircle] = container.querySelectorAll('circle')
      
      expect(backgroundCircle).toHaveStyle('transition: stroke 0.8s cubic-bezier(0.4, 0, 0.2, 1)')
      expect(progressCircle).toHaveStyle('transition: stroke-dashoffset 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), stroke 0.8s cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should set will-change property for performance', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveStyle('will-change: stroke-dashoffset')
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative progress values', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={-10} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      const circumference = 2 * Math.PI * 95
      const expectedOffset = circumference - (-10 / 100) * circumference
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString())
    })

    it('should handle progress values over 100', () => {
      const { container } = render(
        <PomodoroCircle {...defaultProps} progress={150} />
      )
      
      const progressCircle = container.querySelectorAll('circle')[1]
      const circumference = 2 * Math.PI * 95
      const expectedOffset = circumference - (150 / 100) * circumference
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString())
    })

    it('should handle empty time display', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} timeDisplay="" />)
      
      const timeElement = container.querySelector('span')
      expect(timeElement).toBeInTheDocument()
      expect(timeElement).toHaveTextContent('')
    })

    it('should handle very long time display', () => {
      const longTime = '999:59'
      render(<PomodoroCircle {...defaultProps} timeDisplay={longTime} />)
      
      expect(screen.getByText(longTime)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper container structure', () => {
      const { container } = render(<PomodoroCircle {...defaultProps} />)
      
      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass('relative')
    })

    it('should have readable text contrast', () => {
      render(<PomodoroCircle {...defaultProps} />)
      
      const timeElement = screen.getByText('12:30')
      expect(timeElement).toHaveClass('text-text-main')
    })

    it('should maintain proper z-index for text', () => {
      render(<PomodoroCircle {...defaultProps} />)
      
      const timeElement = screen.getByText('12:30')
      expect(timeElement).toHaveClass('z-10')
    })
  })

  describe('Component Props Validation', () => {
    it('should accept all required props', () => {
      const props = {
        progress: 75,
        timeDisplay: '15:45',
        isWorkSession: false,
      }
      
      expect(() => {
        render(<PomodoroCircle {...props} />)
      }).not.toThrow()
    })

    it('should render with minimal props', () => {
      const minimalProps = {
        progress: 0,
        timeDisplay: '00:00',
        isWorkSession: true,
      }
      
      expect(() => {
        render(<PomodoroCircle {...minimalProps} />)
      }).not.toThrow()
    })
  })
})