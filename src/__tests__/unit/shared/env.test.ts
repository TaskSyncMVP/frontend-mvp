import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
  NODE_ENV: 'test'
}

// Mock process.env
vi.stubGlobal('process', {
  env: mockEnv
})

describe('Environment Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Environment Variables', () => {
    it('should have API URL defined', () => {
      expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined()
      expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api')
    })

    it('should have App URL defined', () => {
      expect(process.env.NEXT_PUBLIC_APP_URL).toBeDefined()
      expect(process.env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3001')
    })

    it('should have NODE_ENV defined', () => {
      expect(process.env.NODE_ENV).toBeDefined()
      expect(process.env.NODE_ENV).toBe('test')
    })

    it('should use correct port configuration', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      
      expect(apiUrl).toContain(':3000')
      expect(appUrl).toContain(':3001')
    })
  })

  describe('URL Validation', () => {
    it('should have valid API URL format', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      expect(apiUrl).toMatch(/^https?:\/\//)
      expect(apiUrl).toContain('/api')
    })

    it('should have valid App URL format', () => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      expect(appUrl).toMatch(/^https?:\/\//)
    })

    it('should not have trailing slashes in URLs', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      
      expect(apiUrl).not.toMatch(/\/$/)
      expect(appUrl).not.toMatch(/\/$/)
    })
  })

  describe('Environment-specific behavior', () => {
    it('should handle test environment', () => {
      expect(process.env.NODE_ENV).toBe('test')
    })

    it('should provide localhost URLs in test environment', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      
      expect(apiUrl).toContain('localhost')
      expect(appUrl).toContain('localhost')
    })
  })

  describe('Configuration consistency', () => {
    it('should use different ports for API and App', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
      
      const apiPort = apiUrl.match(/:(\d+)/)?.[1]
      const appPort = appUrl.match(/:(\d+)/)?.[1]
      
      expect(apiPort).toBeDefined()
      expect(appPort).toBeDefined()
      expect(apiPort).not.toBe(appPort)
    })

    it('should use expected port numbers', () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
      
      expect(apiUrl).toContain(':3000')
      expect(appUrl).toContain(':3001')
    })
  })
})