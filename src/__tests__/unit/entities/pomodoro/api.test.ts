import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { pomodoroSessionApi } from '@/entities/pomodoro/model/api'
import { PomodoroSession, UpdatePomodoroSessionDto } from '@/entities/pomodoro/model/types'
import { server } from '@/__tests__/mocks/server'

const API_URL = 'http://localhost:3000/api'

// Mock data
const mockPomodoroSession: PomodoroSession = {
  id: '1',
  isCompleted: false,
  userId: 'user1',
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z'
}

const mockCompletedSession: PomodoroSession = {
  ...mockPomodoroSession,
  id: '2',
  isCompleted: true,
  updatedAt: '2024-01-01T13:00:00Z'
}

describe('Pomodoro Session API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      server.use(
        http.get(`${API_URL}/user/timer/today`, () => {
          return HttpResponse.json(mockPomodoroSession)
        })
      )

      const result = await pomodoroSessionApi.getCurrentSession()

      expect(result).toEqual(mockPomodoroSession)
    })

    it('should return null when no session exists (404)', async () => {
      server.use(
        http.get(`${API_URL}/user/timer/today`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const result = await pomodoroSessionApi.getCurrentSession()

      expect(result).toBeNull()
    })

    it('should throw error for other HTTP errors', async () => {
      server.use(
        http.get(`${API_URL}/user/timer/today`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(pomodoroSessionApi.getCurrentSession()).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      server.use(
        http.get(`${API_URL}/user/timer/today`, () => {
          return HttpResponse.error()
        })
      )

      await expect(pomodoroSessionApi.getCurrentSession()).rejects.toThrow()
    })
  })

  describe('createSession', () => {
    it('should create session successfully', async () => {
      server.use(
        http.post(`${API_URL}/user/timer`, () => {
          return HttpResponse.json(mockPomodoroSession)
        })
      )

      const result = await pomodoroSessionApi.createSession()

      expect(result).toEqual(mockPomodoroSession)
    })

    it('should handle creation errors', async () => {
      server.use(
        http.post(`${API_URL}/user/timer`, () => {
          return new HttpResponse(null, { status: 400 })
        })
      )

      await expect(pomodoroSessionApi.createSession()).rejects.toThrow()
    })

    it('should send empty object in request body', async () => {
      let requestBody: any = null

      server.use(
        http.post(`${API_URL}/user/timer`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json(mockPomodoroSession)
        })
      )

      await pomodoroSessionApi.createSession()

      expect(requestBody).toEqual({})
    })

    it('should handle server errors', async () => {
      server.use(
        http.post(`${API_URL}/user/timer`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(pomodoroSessionApi.createSession()).rejects.toThrow()
    })
  })

  describe('updateSession', () => {
    const sessionId = '1'
    const updateData: UpdatePomodoroSessionDto = {
      isCompleted: true,
      totalSeconds: 1500
    }

    it('should update session successfully', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, () => {
          return HttpResponse.json(mockCompletedSession)
        })
      )

      const result = await pomodoroSessionApi.updateSession(sessionId, updateData)

      expect(result).toEqual(mockCompletedSession)
    })

    it('should send correct data in request body', async () => {
      let requestBody: any = null

      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json(mockCompletedSession)
        })
      )

      await pomodoroSessionApi.updateSession(sessionId, updateData)

      expect(requestBody).toEqual(updateData)
    })

    it('should handle partial updates', async () => {
      const partialUpdate = { isCompleted: true }
      let requestBody: any = null

      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({ ...mockPomodoroSession, isCompleted: true })
        })
      )

      const result = await pomodoroSessionApi.updateSession(sessionId, partialUpdate)

      expect(requestBody).toEqual(partialUpdate)
      expect(result.isCompleted).toBe(true)
    })

    it('should handle update errors', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(pomodoroSessionApi.updateSession(sessionId, updateData)).rejects.toThrow()
    })

    it('should handle validation errors', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, () => {
          return HttpResponse.json(
            { message: 'Invalid data', errors: { totalSeconds: ['Must be positive'] } },
            { status: 400 }
          )
        })
      )

      await expect(pomodoroSessionApi.updateSession(sessionId, updateData)).rejects.toThrow()
    })

    it('should handle server errors', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/${sessionId}`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(pomodoroSessionApi.updateSession(sessionId, updateData)).rejects.toThrow()
    })
  })

  describe('deleteSession', () => {
    const sessionId = '1'

    it('should delete session successfully', async () => {
      server.use(
        http.delete(`${API_URL}/user/timer/${sessionId}`, () => {
          return new HttpResponse(null, { status: 204 })
        })
      )

      await expect(pomodoroSessionApi.deleteSession(sessionId)).resolves.toBeUndefined()
    })

    it('should handle delete errors', async () => {
      server.use(
        http.delete(`${API_URL}/user/timer/${sessionId}`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(pomodoroSessionApi.deleteSession(sessionId)).rejects.toThrow()
    })

    it('should handle server errors', async () => {
      server.use(
        http.delete(`${API_URL}/user/timer/${sessionId}`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(pomodoroSessionApi.deleteSession(sessionId)).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      server.use(
        http.delete(`${API_URL}/user/timer/${sessionId}`, () => {
          return HttpResponse.error()
        })
      )

      await expect(pomodoroSessionApi.deleteSession(sessionId)).rejects.toThrow()
    })
  })

  describe('updateRound', () => {
    const roundId = 'round1'
    const roundData = {
      totalSeconds: 1500,
      isCompleted: true
    }

    it('should update round successfully', async () => {
      const mockRoundResponse = {
        id: roundId,
        ...roundData,
        sessionId: '1',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:25:00Z'
      }

      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, () => {
          return HttpResponse.json(mockRoundResponse)
        })
      )

      const result = await pomodoroSessionApi.updateRound(roundId, roundData)

      expect(result).toEqual(mockRoundResponse)
    })

    it('should send correct data in request body', async () => {
      let requestBody: any = null

      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({ id: roundId, ...roundData })
        })
      )

      await pomodoroSessionApi.updateRound(roundId, roundData)

      expect(requestBody).toEqual(roundData)
    })

    it('should handle partial round updates', async () => {
      const partialData = { isCompleted: true }
      let requestBody: any = null

      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({ id: roundId, isCompleted: true })
        })
      )

      await pomodoroSessionApi.updateRound(roundId, partialData)

      expect(requestBody).toEqual(partialData)
    })

    it('should handle round update errors', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(pomodoroSessionApi.updateRound(roundId, roundData)).rejects.toThrow()
    })

    it('should handle validation errors for rounds', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, () => {
          return HttpResponse.json(
            { message: 'Invalid round data', errors: { totalSeconds: ['Must be positive'] } },
            { status: 400 }
          )
        })
      )

      await expect(pomodoroSessionApi.updateRound(roundId, roundData)).rejects.toThrow()
    })

    it('should handle server errors for rounds', async () => {
      server.use(
        http.put(`${API_URL}/user/timer/round/${roundId}`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(pomodoroSessionApi.updateRound(roundId, roundData)).rejects.toThrow()
    })
  })
})