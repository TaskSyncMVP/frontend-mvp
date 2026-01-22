import { describe, it, expect, beforeEach } from 'vitest'
import { taskApi } from '@entities/task/model/api'
import { server } from '../../../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

describe('Task API', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const tasks = await taskApi.getTasks()
      
      expect(tasks).toHaveLength(2)
      expect(tasks[0]).toMatchObject({
        id: '1',
        name: 'Test Task 1',
        priority: 'high',
        isCompleted: false,
        userId: '1'
      })
    })

    it('should handle network error', async () => {
      server.use(
        http.get(`${API_URL}/user/tasks`, () => {
          return HttpResponse.error()
        })
      )

      await expect(taskApi.getTasks()).rejects.toThrow()
    })

    it('should handle server error', async () => {
      server.use(
        http.get(`${API_URL}/user/tasks`, () => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      await expect(taskApi.getTasks()).rejects.toThrow()
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        name: 'New Test Task',
        priority: 'medium' as const
      }

      const createdTask = await taskApi.createTask(taskData)
      
      expect(createdTask).toMatchObject({
        name: 'New Test Task',
        priority: 'medium',
        isCompleted: false,
        userId: '1'
      })
      expect(createdTask.id).toBeDefined()
      expect(createdTask.createdAt).toBeDefined()
    })

    it('should handle validation error', async () => {
      server.use(
        http.post(`${API_URL}/user/tasks`, () => {
          return HttpResponse.json(
            { message: 'Validation failed', errors: ['Name is required'] },
            { status: 400 }
          )
        })
      )

      const taskData = {
        name: '',
        priority: 'medium' as const
      }

      await expect(taskApi.createTask(taskData)).rejects.toThrow()
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = {
        name: 'Updated Task Name',
        isCompleted: true
      }

      const updatedTask = await taskApi.updateTask('1', updateData)
      
      expect(updatedTask).toMatchObject({
        id: '1',
        name: 'Updated Task Name',
        isCompleted: true
      })
      expect(updatedTask.updatedAt).toBeDefined()
    })

    it('should handle task not found', async () => {
      server.use(
        http.put(`${API_URL}/user/tasks/:id`, () => {
          return HttpResponse.json(
            { message: 'Task not found' },
            { status: 404 }
          )
        })
      )

      await expect(taskApi.updateTask('999', { name: 'Updated' })).rejects.toThrow()
    })
  })

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      await expect(taskApi.deleteTask('1')).resolves.not.toThrow()
    })

    it('should handle task not found', async () => {
      server.use(
        http.delete(`${API_URL}/user/tasks/:id`, () => {
          return HttpResponse.json(
            { message: 'Task not found' },
            { status: 404 }
          )
        })
      )

      await expect(taskApi.deleteTask('999')).rejects.toThrow()
    })
  })

  describe('deleteAllTasks', () => {
    it('should delete all tasks successfully', async () => {
      await expect(taskApi.deleteAllTasks()).resolves.not.toThrow()
    })

    it('should handle server error', async () => {
      server.use(
        http.get(`${API_URL}/user/tasks`, () => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      await expect(taskApi.deleteAllTasks()).rejects.toThrow()
    })
  })
})