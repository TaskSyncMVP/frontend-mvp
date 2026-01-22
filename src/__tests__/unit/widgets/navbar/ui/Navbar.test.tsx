import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/widgets/navbar/ui/Navbar'
import { usePathname, useRouter } from 'next/navigation'

// Mock dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn()
}))

vi.mock('@/widgets/navbar/ui/BarBackground', () => ({
  BarBackground: () => <div data-testid="bar-background">BarBackground</div>
}))

vi.mock('@/widgets/navbar/ui/NavItem', () => ({
  NavItem: ({ iconType, href }: any) => (
    <a href={href} data-testid={`nav-item-${iconType}`}>
      {iconType}
    </a>
  )
}))

vi.mock('@shared/ui', () => ({
  Button: ({ children, onClick, className, size, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  )
}))

vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
  Play: () => <div data-testid="play-icon">Play</div>,
  Pause: () => <div data-testid="pause-icon">Pause</div>
}))

describe('Navbar', () => {
  const mockPush = vi.fn()
  const mockBack = vi.fn()
  const mockOnModalToggle = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockOnPomodoroToggle = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: mockBack
    } as any)
    
    vi.mocked(usePathname).mockReturnValue('/home')

    // Mock window.addEventListener and removeEventListener
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  describe('Rendering', () => {
    it('should render navbar with all nav items', () => {
      render(<Navbar />)

      expect(screen.getByTestId('bar-background')).toBeInTheDocument()
      expect(screen.getByTestId('nav-item-home')).toBeInTheDocument()
      expect(screen.getByTestId('nav-item-calendar')).toBeInTheDocument()
      expect(screen.getByTestId('nav-item-document')).toBeInTheDocument()
      expect(screen.getByTestId('nav-item-profile-2user')).toBeInTheDocument()
    })

    it('should render nav items with correct hrefs', () => {
      render(<Navbar />)

      expect(screen.getByTestId('nav-item-home')).toHaveAttribute('href', '/home')
      expect(screen.getByTestId('nav-item-calendar')).toHaveAttribute('href', '/time-blocking')
      expect(screen.getByTestId('nav-item-document')).toHaveAttribute('href', '/tasks')
      expect(screen.getByTestId('nav-item-profile-2user')).toHaveAttribute('href', '/menu')
    })
  })

  describe('Button Configuration by Route', () => {
    it('should show plus icon on default routes', () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should show X icon when modal is open', () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} isModalOpen={true} />)

      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('should show X icon on menu route', () => {
      vi.mocked(usePathname).mockReturnValue('/menu')
      
      render(<Navbar />)

      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('should show check icon on settings route', () => {
      vi.mocked(usePathname).mockReturnValue('/settings')
      
      render(<Navbar onSubmit={mockOnSubmit} />)

      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })

    it('should show play icon on pomodoro route when not running', () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      expect(screen.getByTestId('play-icon')).toBeInTheDocument()
    })

    it('should show pause icon on pomodoro route when running', () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      const { rerender } = render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      // Simulate pomodoro state change event
      const event = new CustomEvent('pomodoro:state-change', {
        detail: { isRunning: true }
      })
      window.dispatchEvent(event)

      rerender(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      expect(screen.getByTestId('pause-icon')).toBeInTheDocument()
    })
  })

  describe('Button Click Handlers', () => {
    it('should call onModalToggle when plus button is clicked', async () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByTestId('plus-icon').closest('button')!
      await user.click(button)

      expect(mockOnModalToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onModalToggle when X button is clicked (modal open)', async () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} isModalOpen={true} />)

      const button = screen.getByTestId('x-icon').closest('button')!
      await user.click(button)

      expect(mockOnModalToggle).toHaveBeenCalledTimes(1)
    })

    it('should call router.back when X button is clicked on menu route', async () => {
      vi.mocked(usePathname).mockReturnValue('/menu')
      
      render(<Navbar />)

      const button = screen.getByTestId('x-icon').closest('button')!
      await user.click(button)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should call onSubmit when check button is clicked on settings route', async () => {
      vi.mocked(usePathname).mockReturnValue('/settings')
      
      render(<Navbar onSubmit={mockOnSubmit} />)

      const button = screen.getByTestId('check-icon').closest('button')!
      await user.click(button)

      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })

    it('should call onPomodoroToggle when play button is clicked', async () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      const button = screen.getByTestId('play-icon').closest('button')!
      await user.click(button)

      expect(mockOnPomodoroToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onPomodoroToggle when pause button is clicked', async () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      const { rerender } = render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      // Simulate pomodoro running state
      const event = new CustomEvent('pomodoro:state-change', {
        detail: { isRunning: true }
      })
      window.dispatchEvent(event)

      // Re-render to apply state change
      rerender(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      const button = screen.getByTestId('pause-icon').closest('button')!
      await user.click(button)

      expect(mockOnPomodoroToggle).toHaveBeenCalledTimes(1)
    })

    it('should show alert when onSubmit is not provided on settings route', async () => {
      vi.mocked(usePathname).mockReturnValue('/settings')
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<Navbar />)

      const button = screen.getByTestId('check-icon').closest('button')!
      await user.click(button)

      expect(alertSpy).toHaveBeenCalledWith('Settings saved!')
      alertSpy.mockRestore()
    })
  })

  describe('Pomodoro State Management', () => {
    it('should add event listener for pomodoro state changes on mount', () => {
      render(<Navbar />)

      expect(window.addEventListener).toHaveBeenCalledWith(
        'pomodoro:state-change',
        expect.any(Function)
      )
    })

    it('should remove event listener on unmount', () => {
      const { unmount } = render(<Navbar />)
      
      unmount()

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'pomodoro:state-change',
        expect.any(Function)
      )
    })

    it('should update pomodoro state when event is dispatched', () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      const { rerender } = render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      // Initially should show play icon
      expect(screen.getByTestId('play-icon')).toBeInTheDocument()

      // Dispatch state change event
      const event = new CustomEvent('pomodoro:state-change', {
        detail: { isRunning: true }
      })
      window.dispatchEvent(event)

      rerender(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      // Should now show pause icon
      expect(screen.getByTestId('pause-icon')).toBeInTheDocument()
    })

    it('should handle pomodoro state change from running to stopped', () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      const { rerender } = render(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      // Set to running state
      let event = new CustomEvent('pomodoro:state-change', {
        detail: { isRunning: true }
      })
      window.dispatchEvent(event)
      rerender(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      expect(screen.getByTestId('pause-icon')).toBeInTheDocument()

      // Set to stopped state
      event = new CustomEvent('pomodoro:state-change', {
        detail: { isRunning: false }
      })
      window.dispatchEvent(event)
      rerender(<Navbar onPomodoroToggle={mockOnPomodoroToggle} />)

      expect(screen.getByTestId('play-icon')).toBeInTheDocument()
    })
  })

  describe('Button Styling', () => {
    it('should apply primary styling to default button', () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByTestId('plus-icon').closest('button')!
      expect(button).toHaveClass('bg-primary-100', 'text-white')
    })

    it('should apply correct positioning classes', () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByTestId('plus-icon').closest('button')!
      expect(button).toHaveClass(
        'absolute',
        'left-1/2',
        '-translate-x-1/2',
        '-top-6'
      )
    })

    it('should apply icon size attribute', () => {
      vi.mocked(usePathname).mockReturnValue('/home')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByTestId('plus-icon').closest('button')!
      expect(button).toHaveAttribute('data-size', 'icon')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing callbacks gracefully', () => {
      vi.mocked(usePathname).mockReturnValue('/pomodoro')
      
      render(<Navbar />)

      const button = screen.getByTestId('play-icon').closest('button')!
      
      // Should not throw error when clicking without callback
      expect(() => user.click(button)).not.toThrow()
    })

    it('should handle unknown routes with default button', () => {
      vi.mocked(usePathname).mockReturnValue('/unknown-route')
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should handle null pathname', () => {
      vi.mocked(usePathname).mockReturnValue(null as any)
      
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      // Should default to plus icon
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render button with proper structure', () => {
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should render nav items as links', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(4) // home, calendar, document, profile-2user
    })
  })

  describe('Responsive Design', () => {
    it('should apply responsive classes to button', () => {
      render(<Navbar onModalToggle={mockOnModalToggle} />)

      const button = screen.getByTestId('plus-icon').closest('button')!
      expect(button).toHaveClass(
        'sm:w-16',
        'sm:h-16',
        'sm:-top-12',
        'md:w-20',
        'md:h-20',
        'md:-top-16'
      )
    })

    it('should apply responsive classes to nav containers', () => {
      render(<Navbar />)

      const containers = document.querySelectorAll('.sm\\:gap-6')
      expect(containers).toHaveLength(2) // Two nav containers
    })
  })

  describe('Component Props', () => {
    it('should work without any props', () => {
      expect(() => render(<Navbar />)).not.toThrow()
    })

    it('should handle all props provided', () => {
      const props = {
        isModalOpen: true,
        onModalToggle: mockOnModalToggle,
        onSubmit: mockOnSubmit,
        onPomodoroToggle: mockOnPomodoroToggle
      }

      expect(() => render(<Navbar {...props} />)).not.toThrow()
    })

    it('should handle partial props', () => {
      const props = {
        onModalToggle: mockOnModalToggle
      }

      expect(() => render(<Navbar {...props} />)).not.toThrow()
    })
  })
})