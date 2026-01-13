import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { useAuth } from '@/features/auth/lib/auth-context'
import { useRouter } from 'next/navigation'

// Mock dependencies
vi.mock('@/features/auth/lib/auth-context', () => ({
  useAuth: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

describe('AuthGuard', () => {
  const mockReplace = vi.fn()
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace
    } as any)
  })

  describe('Authentication States', () => {
    it('should render children when user is authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should not render children when user is not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should render children when loading and authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: true
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should render children when loading and not yet determined authentication', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('Navigation Behavior', () => {
    it('should redirect to login when user is not authenticated and not loading', async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
    })

    it('should not redirect when user is authenticated', async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Wait a bit to ensure no redirect happens
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(mockReplace).not.toHaveBeenCalled()
    })

    it('should not redirect when still loading', async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      } as any)

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Wait a bit to ensure no redirect happens
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(mockReplace).not.toHaveBeenCalled()
    })

    it('should redirect when loading finishes and user is not authenticated', async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Initially loading
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(mockReplace).not.toHaveBeenCalled()

      // Loading finishes, user not authenticated
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Component Rendering', () => {
    it('should render null when not authenticated and not loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      const { container } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render children wrapped in fragment when authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      const { container } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(container.firstChild).not.toBeNull()
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('should handle multiple children', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      render(
        <AuthGuard>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </AuthGuard>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })

    it('should handle complex nested components', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      const ComplexComponent = () => (
        <div data-testid="complex-component">
          <header>Header</header>
          <main>
            <section>Section Content</section>
          </main>
          <footer>Footer</footer>
        </div>
      )

      render(
        <AuthGuard>
          <ComplexComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('complex-component')).toBeInTheDocument()
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Section Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined children gracefully', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      expect(() => {
        render(
          <AuthGuard>
            {undefined}
          </AuthGuard>
        )
      }).not.toThrow()
    })

    it('should handle null children gracefully', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      expect(() => {
        render(
          <AuthGuard>
            {null}
          </AuthGuard>
        )
      }).not.toThrow()
    })

    it('should handle empty children gracefully', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      expect(() => {
        render(
          <AuthGuard>
            {''}
          </AuthGuard>
        )
      }).not.toThrow()
    })

    it('should handle boolean children gracefully', () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      const { container } = render(
        <AuthGuard>
          {true && <TestComponent />}
          {false && <div>Should not render</div>}
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument()
    })
  })

  describe('State Transitions', () => {
    it('should handle authentication state changes correctly', async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Start with loading state
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(mockReplace).not.toHaveBeenCalled()

      // User becomes authenticated
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(mockReplace).not.toHaveBeenCalled()

      // User logs out
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should handle rapid state changes', async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Rapid state changes
      const states = [
        { isAuthenticated: false, isLoading: true },
        { isAuthenticated: true, isLoading: true },
        { isAuthenticated: true, isLoading: false },
        { isAuthenticated: false, isLoading: false }
      ]

      for (const state of states) {
        vi.mocked(useAuth).mockReturnValue(state as any)
        rerender(
          <AuthGuard>
            <TestComponent />
          </AuthGuard>
        )
      }

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Integration', () => {
    it('should work with real authentication flow simulation', async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Simulate app startup - loading
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()

      // Simulate auth check complete - not authenticated
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should handle router replace errors gracefully', async () => {
      mockReplace.mockRejectedValueOnce(new Error('Navigation failed'))

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      } as any)

      // Should not throw error
      expect(() => {
        render(
          <AuthGuard>
            <TestComponent />
          </AuthGuard>
        )
      }).not.toThrow()

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn()
      
      const SpyComponent = () => {
        renderSpy()
        return <div data-testid="spy-component">Spy Component</div>
      }

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      } as any)

      const { rerender } = render(
        <AuthGuard>
          <SpyComponent />
        </AuthGuard>
      )

      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Re-render with same auth state
      rerender(
        <AuthGuard>
          <SpyComponent />
        </AuthGuard>
      )

      expect(renderSpy).toHaveBeenCalledTimes(2) // Expected re-render
    })

    it('should handle frequent auth state updates efficiently', async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Simulate frequent updates
      for (let i = 0; i < 10; i++) {
        vi.mocked(useAuth).mockReturnValue({
          isAuthenticated: i % 2 === 0,
          isLoading: false
        } as any)

        rerender(
          <AuthGuard>
            <TestComponent />
          </AuthGuard>
        )
      }

      // Should handle all updates without issues
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled()
      })
    })
  })
})