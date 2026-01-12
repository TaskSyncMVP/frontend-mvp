import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@features/auth/lib/auth-context'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0
    },
    mutations: {
      retry: false
    }
  }
})

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'

export { customRender as render }

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  workInterval: 25,
  breakInterval: 5,
  intervalsCount: 4,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides
})

export const createMockTask = (overrides = {}) => ({
  id: '1',
  name: 'Test Task',
  priority: 'medium' as const,
  isCompleted: false,
  userId: '1',
  createdAt: '2024-01-01T10:00:00.000Z',
  updatedAt: '2024-01-01T10:00:00.000Z',
  ...overrides
})

export const createMockPomodoroSession = (overrides = {}) => ({
  id: '1',
  isCompleted: false,
  userId: '1',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z',
  ...overrides
})

export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0))

export const mockTimers = () => {
  vi.useFakeTimers()
  return {
    advanceTime: (ms: number) => vi.advanceTimersByTime(ms),
    runAllTimers: () => vi.runAllTimers(),
    restore: () => vi.useRealTimers()
  }
}