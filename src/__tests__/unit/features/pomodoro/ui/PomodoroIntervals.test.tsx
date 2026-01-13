import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroIntervals } from '@/features/pomodoro/ui/PomodoroIntervals'
import { PomodoroTimer } from '@/entities/pomodoro'

describe('PomodoroIntervals', () => {
  const defaultTimer: PomodoroTimer = {
    state: 'work',
    currentRound: 1,
    totalRounds: 4,
    secondsLeft: 1500,
    isWorkSession: true,
  }

  const defaultProps = {
    timer: defaultTimer,
    progress: 25,
  }

  beforeEach(() => {
    // Clean up any existing styles
    const existingStyle = document.getElementById('pomodoro-shimmer-animation')
    if (existingStyle) {
      existingStyle.remove()
    }
  })

  afterEach(() => {
    // Clean up styles after each test
    const existingStyle = document.getElementById('pomodoro-shimmer-animation')
    if (existingStyle) {
      existingStyle.remove()
    }
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        render(<PomodoroIntervals {...defaultProps} />)
      }).not.toThrow()
    })

    it('should render correct number of intervals', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      expect(intervals).toHaveLength(4)
    })

    it('should render intervals for different total rounds', () => {
      const timerWith6Rounds = { ...defaultTimer, totalRounds: 6 }
      const { container } = render(
        <PomodoroIntervals timer={timerWith6Rounds} progress={25} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      expect(intervals).toHaveLength(6)
    })

    it('should create shimmer animation style', () => {
      render(<PomodoroIntervals {...defaultProps} />)
      
      const style = document.getElementById('pomodoro-shimmer-animation')
      expect(style).toBeInTheDocument()
      expect(style?.textContent).toContain('@keyframes pomodoro-shimmer')
    })

    it('should not create duplicate styles', () => {
      render(<PomodoroIntervals {...defaultProps} />)
      render(<PomodoroIntervals {...defaultProps} />)
      
      const styles = document.querySelectorAll('#pomodoro-shimmer-animation')
      expect(styles).toHaveLength(1)
    })
  })

  describe('Interval States', () => {
    it('should show completed intervals correctly', () => {
      const timerOnRound3 = { ...defaultTimer, currentRound: 3 }
      const { container } = render(
        <PomodoroIntervals timer={timerOnRound3} progress={25} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      // First two should be completed (bg-pomodoro-timer)
      expect(intervals[0]).toHaveClass('bg-pomodoro-timer')
      expect(intervals[1]).toHaveClass('bg-pomodoro-timer')
      
      // Third should be current (bg-pomodoro-background)
      expect(intervals[2]).toHaveClass('bg-pomodoro-background')
      
      // Fourth should be inactive (bg-pomodoro-background)
      expect(intervals[3]).toHaveClass('bg-pomodoro-background')
    })

    it('should show current interval with scale transform', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      // First interval should be current and scaled
      expect(intervals[0]).toHaveStyle('transform: scale(1.05)')
      
      // Others should have normal scale
      for (let i = 1; i < intervals.length; i++) {
        expect(intervals[i]).toHaveStyle('transform: scale(1)')
      }
    })

    it('should show inactive intervals correctly', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      // Intervals 2, 3, 4 should be inactive
      for (let i = 1; i < intervals.length; i++) {
        expect(intervals[i]).toHaveClass('bg-pomodoro-background')
      }
    })
  })

  describe('Work Session Progress', () => {
    it('should show progress bar for current work session', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const currentInterval = container.querySelector('.rounded-soft')
      const progressBar = currentInterval?.querySelector('.bg-pomodoro-timer')
      
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveStyle('width: 25%')
    })

    it('should update progress bar width correctly', () => {
      const { container, rerender } = render(
        <PomodoroIntervals {...defaultProps} progress={50} />
      )
      
      let progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 50%')
      
      rerender(<PomodoroIntervals {...defaultProps} progress={75} />)
      
      progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 75%')
    })

    it('should handle 0% progress', () => {
      const { container } = render(
        <PomodoroIntervals {...defaultProps} progress={0} />
      )
      
      const progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 0%')
    })

    it('should handle 100% progress', () => {
      const { container } = render(
        <PomodoroIntervals {...defaultProps} progress={100} />
      )
      
      const progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 100%')
    })

    it('should clamp progress between 0 and 100', () => {
      const { container, rerender } = render(
        <PomodoroIntervals {...defaultProps} progress={-10} />
      )
      
      let progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 0%')
      
      rerender(<PomodoroIntervals {...defaultProps} progress={150} />)
      
      progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 100%')
    })
  })

  describe('Break Session Display', () => {
    it('should show opacity overlay for current break session', () => {
      const breakTimer = { ...defaultTimer, isWorkSession: false, state: 'break' as const }
      const { container } = render(
        <PomodoroIntervals timer={breakTimer} progress={50} />
      )
      
      const currentInterval = container.querySelector('.rounded-soft')
      const overlay = currentInterval?.querySelector('.bg-pomodoro-timer.opacity-60')
      
      expect(overlay).toBeInTheDocument()
    })

    it('should not show progress bar during break session', () => {
      const breakTimer = { ...defaultTimer, isWorkSession: false, state: 'break' as const }
      const { container } = render(
        <PomodoroIntervals timer={breakTimer} progress={50} />
      )
      
      const currentInterval = container.querySelector('.rounded-soft')
      const progressBar = currentInterval?.querySelector('[style*="width"]')
      
      expect(progressBar).not.toBeInTheDocument()
    })
  })

  describe('Timer States', () => {
    it('should handle idle state', () => {
      const idleTimer = { ...defaultTimer, state: 'idle' as const, currentRound: 1 }
      const { container } = render(
        <PomodoroIntervals timer={idleTimer} progress={0} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      // All intervals should be inactive in idle state
      intervals.forEach(interval => {
        expect(interval).toHaveClass('bg-pomodoro-background')
      })
    })

    it('should handle paused state', () => {
      const pausedTimer = { ...defaultTimer, state: 'paused' as const }
      const { container } = render(
        <PomodoroIntervals timer={pausedTimer} progress={30} />
      )
      
      const currentInterval = container.querySelector('.rounded-soft')
      expect(currentInterval).toHaveStyle('transform: scale(1.05)')
    })

    it('should handle work state', () => {
      const workTimer = { ...defaultTimer, state: 'work' as const }
      const { container } = render(
        <PomodoroIntervals timer={workTimer} progress={40} />
      )
      
      const progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('width: 40%')
    })
  })

  describe('Styling and Animation', () => {
    it('should apply correct base classes to intervals', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      intervals.forEach(interval => {
        expect(interval).toHaveClass('relative', 'rounded-soft', 'h-6', 'w-6', 'overflow-hidden')
      })
    })

    it('should apply transition classes', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      intervals.forEach(interval => {
        expect(interval).toHaveClass('transition-all', 'duration-500', 'ease-out')
      })
    })

    it('should apply correct transition to progress bar', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const progressBar = container.querySelector('.bg-pomodoro-timer')
      expect(progressBar).toHaveStyle('transition: width 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)')
      expect(progressBar).toHaveStyle('will-change: width')
    })

    it('should apply shadow to completed intervals', () => {
      const timerOnRound2 = { ...defaultTimer, currentRound: 2 }
      const { container } = render(
        <PomodoroIntervals timer={timerOnRound2} progress={25} />
      )
      
      const completedInterval = container.querySelector('.bg-pomodoro-timer.shadow-sm')
      expect(completedInterval).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('should use flex layout with correct gap', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass('flex', 'flex-row', 'gap-2')
    })

    it('should maintain consistent interval dimensions', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      intervals.forEach(interval => {
        expect(interval).toHaveClass('h-6', 'w-6')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle single round timer', () => {
      const singleRoundTimer = { ...defaultTimer, totalRounds: 1 }
      const { container } = render(
        <PomodoroIntervals timer={singleRoundTimer} progress={50} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      expect(intervals).toHaveLength(1)
    })

    it('should handle many rounds timer', () => {
      const manyRoundsTimer = { ...defaultTimer, totalRounds: 10 }
      const { container } = render(
        <PomodoroIntervals timer={manyRoundsTimer} progress={25} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      expect(intervals).toHaveLength(10)
    })

    it('should handle round number equal to total rounds', () => {
      const lastRoundTimer = { ...defaultTimer, currentRound: 4, totalRounds: 4 }
      const { container } = render(
        <PomodoroIntervals timer={lastRoundTimer} progress={75} />
      )
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      // First 3 should be completed
      for (let i = 0; i < 3; i++) {
        expect(intervals[i]).toHaveClass('bg-pomodoro-timer')
      }
      
      // Last should be current
      expect(intervals[3]).toHaveStyle('transform: scale(1.05)')
    })
  })

  describe('Performance', () => {
    it('should set will-change property for performance optimization', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const progressBar = container.querySelector('[style*="will-change: width"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('should use efficient CSS transitions', () => {
      const { container } = render(<PomodoroIntervals {...defaultProps} />)
      
      const intervals = container.querySelectorAll('.rounded-soft')
      
      intervals.forEach(interval => {
        expect(interval).toHaveStyle('transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      })
    })
  })
})