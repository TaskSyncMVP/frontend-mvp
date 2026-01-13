import { describe, it, expect, beforeEach } from 'vitest'
import { authApi } from '@entities/user/api'
import { server } from '../../../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

describe('Auth API', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await authApi.login(credentials)

      expect(result).toMatchObject({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    })

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }

      await expect(authApi.login(credentials)).rejects.toThrow()
    })

    it('should handle network error', async () => {
      server.use(
        http.post(`${API_URL}/auth/login`, () => {
          return HttpResponse.error()
        })
      )

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      await expect(authApi.login(credentials)).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123'
      }

      const result = await authApi.register(registerData)

      expect(result).toMatchObject({
        user: {
          email: 'newuser@example.com'
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    })

    it('should handle existing user error', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123'
      }

      await expect(authApi.register(registerData)).rejects.toThrow()
    })

    it('should handle validation error', async () => {
      server.use(
        http.post(`${API_URL}/auth/register`, () => {
          return HttpResponse.json(
            { message: 'Validation failed' },
            { status: 400 }
          )
        })
      )

      const registerData = {
        email: 'invalid-email',
        password: '123'
      }

      await expect(authApi.register(registerData)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      await expect(authApi.logout()).resolves.not.toThrow()
    })

    it('should handle logout error', async () => {
      server.use(
        http.post(`${API_URL}/auth/logout`, () => {
          return HttpResponse.json(
            { message: 'Logout failed' },
            { status: 500 }
          )
        })
      )

      await expect(authApi.logout()).rejects.toThrow()
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const result = await authApi.refreshToken()

      expect(result).toMatchObject({
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token'
      })
    })

    it('should handle refresh token error', async () => {
      server.use(
        http.post(`${API_URL}/auth/login/access-token`, () => {
          return HttpResponse.json(
            { message: 'Invalid refresh token' },
            { status: 401 }
          )
        })
      )

      await expect(authApi.refreshToken()).rejects.toThrow()
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const result = await authApi.getCurrentUser()

      expect(result).toMatchObject({
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      })
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.get(`${API_URL}/user/profile`, () => {
          return HttpResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
          )
        })
      )

      await expect(authApi.getCurrentUser()).rejects.toThrow()
    })
  })
})