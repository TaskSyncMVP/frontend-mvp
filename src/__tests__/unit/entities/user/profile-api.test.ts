import { describe, it, expect, beforeEach } from 'vitest'
import { profileApi } from '@entities/user/api'
import { server } from '../../../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

describe('Profile API', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        workInterval: 30,
        breakInterval: 10,
        intervalsCount: 6
      }

      const result = await profileApi.updateProfile(updateData)

      expect(result).toMatchObject({
        id: '1',
        name: 'Updated Name',
        workInterval: 30,
        breakInterval: 10,
        intervalsCount: 6
      })
    })

    it('should handle validation error', async () => {
      server.use(
        http.put(`${API_URL}/user/profile`, () => {
          return HttpResponse.json(
            { message: 'Validation failed', errors: ['Name is required'] },
            { status: 400 }
          )
        })
      )

      const updateData = {
        name: '',
        workInterval: 0
      }

      await expect(profileApi.updateProfile(updateData)).rejects.toThrow()
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.put(`${API_URL}/user/profile`, () => {
          return HttpResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
          )
        })
      )

      const updateData = {
        name: 'New Name'
      }

      await expect(profileApi.updateProfile(updateData)).rejects.toThrow()
    })

    it('should handle network error', async () => {
      server.use(
        http.put(`${API_URL}/user/profile`, () => {
          return HttpResponse.error()
        })
      )

      const updateData = {
        name: 'New Name'
      }

      await expect(profileApi.updateProfile(updateData)).rejects.toThrow()
    })
  })

  describe('getProfile', () => {
    it('should get profile successfully', async () => {
      const result = await profileApi.getProfile()

      expect(result).toMatchObject({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          workInterval: 25,
          breakInterval: 5,
          intervalsCount: 4
        }
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

      await expect(profileApi.getProfile()).rejects.toThrow()
    })

    it('should handle server error', async () => {
      server.use(
        http.get(`${API_URL}/user/profile`, () => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      await expect(profileApi.getProfile()).rejects.toThrow()
    })
  })
})