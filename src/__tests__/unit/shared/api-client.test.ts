import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '@shared/api/client'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

vi.mock('@shared/lib/cookies', () => ({
  cookies: {
    get: vi.fn(() => 'mock-token'),
    set: vi.fn(),
    remove: vi.fn()
  }
}))

describe('API Client', () => {
  beforeEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })

  describe('request interceptors', () => {
    it('should add authorization header when token exists', async () => {
      server.use(
        http.get(`${API_URL}/test`, ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          return HttpResponse.json({ 
            hasAuth: !!authHeader,
            authHeader 
          })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data.hasAuth).toBe(true)
      expect(response.data.authHeader).toBe('Bearer mock-token')
    })

    it('should make request without auth header when no token', async () => {
      const { cookies } = await import('@shared/lib/cookies')
      vi.mocked(cookies.get).mockReturnValue(null)

      server.use(
        http.get(`${API_URL}/test`, ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          return HttpResponse.json({ 
            hasAuth: !!authHeader,
            authHeader 
          })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data.hasAuth).toBe(false)
    })
  })

  describe('response interceptors', () => {
    it('should handle successful response', async () => {
      server.use(
        http.get(`${API_URL}/test`, () => {
          return HttpResponse.json({ message: 'success' })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data).toEqual({ message: 'success' })
    })

    it('should handle 401 error and attempt token refresh', async () => {
      let callCount = 0
      
      server.use(
        http.get(`${API_URL}/test`, () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.json(
              { message: 'Unauthorized' },
              { status: 401 }
            )
          }
          return HttpResponse.json({ message: 'success after refresh' })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data).toEqual({ message: 'success after refresh' })
      expect(callCount).toBe(2)
    })

    it('should handle network errors', async () => {
      server.use(
        http.get(`${API_URL}/test`, () => {
          return HttpResponse.error()
        })
      )

      await expect(apiClient.get('/test')).rejects.toThrow()
    })

    it('should handle 4xx client errors', async () => {
      server.use(
        http.get(`${API_URL}/test`, () => {
          return HttpResponse.json(
            { message: 'Bad Request' },
            { status: 400 }
          )
        })
      )

      await expect(apiClient.get('/test')).rejects.toThrow()
    })

    it('should handle 5xx server errors', async () => {
      server.use(
        http.get(`${API_URL}/test`, () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      await expect(apiClient.get('/test')).rejects.toThrow()
    })
  })

  describe('HTTP methods', () => {
    it('should make GET request', async () => {
      server.use(
        http.get(`${API_URL}/test`, () => {
          return HttpResponse.json({ method: 'GET' })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data).toEqual({ method: 'GET' })
    })

    it('should make POST request with data', async () => {
      server.use(
        http.post(`${API_URL}/test`, async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json({ method: 'POST', body })
        })
      )

      const testData = { name: 'test' }
      const response = await apiClient.post('/test', testData)
      
      expect(response.data).toEqual({ 
        method: 'POST', 
        body: testData 
      })
    })

    it('should make PUT request with data', async () => {
      server.use(
        http.put(`${API_URL}/test`, async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json({ method: 'PUT', body })
        })
      )

      const testData = { name: 'updated' }
      const response = await apiClient.put('/test', testData)
      
      expect(response.data).toEqual({ 
        method: 'PUT', 
        body: testData 
      })
    })

    it('should make DELETE request', async () => {
      server.use(
        http.delete(`${API_URL}/test`, () => {
          return HttpResponse.json({ method: 'DELETE' })
        })
      )

      const response = await apiClient.delete('/test')
      
      expect(response.data).toEqual({ method: 'DELETE' })
    })
  })

  describe('retry logic', () => {
    it('should retry on 5xx error', async () => {
      let callCount = 0
      
      server.use(
        http.get(`${API_URL}/test`, () => {
          callCount++
          if (callCount < 2) {
            return HttpResponse.json(
              { message: 'Server Error' },
              { status: 500 }
            )
          }
          return HttpResponse.json({ message: 'success after retry' })
        })
      )

      const response = await apiClient.get('/test')
      
      expect(response.data).toEqual({ message: 'success after retry' })
      expect(callCount).toBe(2)
    })
  })
})