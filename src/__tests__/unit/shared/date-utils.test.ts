import { describe, it, expect } from 'vitest'
import {
  extractDateFromTaskName,
  formatTaskTime,
  getTodayTasks,
  generateDaysWithTasks,
  getWeekTasks,
  isWithinWeek,
  createDateWithCurrentTime,
  adaptTaskToTaskWithLevel
} from '@shared/lib/date-utils'
import { createMockTask } from '../../utils/test-utils'

describe('Date Utils', () => {
  describe('extractDateFromTaskName', () => {
    it('should extract date from task name with [YYYY-MM-DD] format', () => {
      const taskName = '[2024-01-15] Complete project documentation'
      const result = extractDateFromTaskName(taskName)
      
      expect(result).toEqual({
        date: '2024-01-15',
        cleanName: 'Complete project documentation'
      })
    })

    it('should return null for task without date prefix', () => {
      const taskName = 'Regular task without date'
      const result = extractDateFromTaskName(taskName)
      
      expect(result).toEqual({
        date: null,
        cleanName: 'Regular task without date'
      })
    })

    it('should handle invalid date format', () => {
      const taskName = '[invalid-date] Task with invalid date'
      const result = extractDateFromTaskName(taskName)
      
      expect(result).toEqual({
        date: null,
        cleanName: '[invalid-date] Task with invalid date'
      })
    })

    it('should handle empty task name', () => {
      const result = extractDateFromTaskName('')
      
      expect(result).toEqual({
        date: null,
        cleanName: ''
      })
    })
  })

  describe('formatTaskTime', () => {
    it('should format time correctly for today', () => {
      const today = new Date()
      const result = formatTaskTime(today.toISOString())
      
      expect(result).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)$/)
    })

    it('should format time correctly for past date', () => {
      const pastDate = '2024-01-01T10:30:00.000Z'
      const result = formatTaskTime(pastDate)
      
      expect(result).toMatch(/^[A-Za-z]{3}\s\d{1,2},\s\d{1,2}:\d{2}\s(AM|PM)$/)
    })

    it('should handle invalid date string', () => {
      const result = formatTaskTime('invalid-date')
      
      expect(result).toBe('Invalid Date')
    })
  })

  describe('getTodayTasks', () => {
    it('should filter tasks for today', () => {
      const today = new Date()
      const todayISO = today.toISOString()
      
      const tasks = [
        createMockTask({ id: '1', createdAt: todayISO }),
        createMockTask({ id: '2', createdAt: '2024-01-01T10:00:00.000Z' }),
        createMockTask({ id: '3', name: `[${today.toISOString().split('T')[0]}] Future task` })
      ]
      
      const todayTasks = getTodayTasks(tasks)
      
      expect(todayTasks).toHaveLength(2)
      expect(todayTasks.map(t => t.id)).toEqual(['1', '3'])
    })

    it('should return empty array for no tasks', () => {
      const result = getTodayTasks([])
      
      expect(result).toEqual([])
    })
  })

  describe('generateDaysWithTasks', () => {
    it('should generate days with task counts', () => {
      const tasks = [
        createMockTask({ id: '1', createdAt: '2024-01-01T10:00:00.000Z' }),
        createMockTask({ id: '2', createdAt: '2024-01-01T11:00:00.000Z' }),
        createMockTask({ id: '3', createdAt: '2024-01-02T10:00:00.000Z' })
      ]
      
      const result = generateDaysWithTasks(tasks)
      
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)
      
      const firstDay = result[0]
      expect(firstDay).toHaveProperty('date')
      expect(firstDay).toHaveProperty('tasks')
      expect(firstDay).toHaveProperty('dayName')
      expect(firstDay).toHaveProperty('month')
      expect(firstDay).toHaveProperty('day')
      expect(firstDay).toHaveProperty('weekday')
      expect(Array.isArray(firstDay.tasks)).toBe(true)
    })

    it('should handle empty tasks array', () => {
      const result = generateDaysWithTasks([])
      
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0) // Должны быть дни, но без задач
      
      const firstDay = result[0]
      expect(firstDay.tasks).toEqual([])
    })
  })

  describe('getWeekTasks', () => {
    it('should filter tasks within current week', () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      const tasks = [
        createMockTask({ id: '1', createdAt: today.toISOString() }),
        createMockTask({ id: '2', name: `[${tomorrow.toISOString().split('T')[0]}] Tomorrow task` }),
        createMockTask({ id: '3', createdAt: '2024-01-01T10:00:00.000Z' }) // Old task
      ]
      
      const weekTasks = getWeekTasks(tasks)
      
      expect(weekTasks.length).toBeGreaterThanOrEqual(2)
      expect(weekTasks.map(t => t.id)).toContain('1')
      expect(weekTasks.map(t => t.id)).toContain('2')
    })

    it('should return empty array for no tasks', () => {
      const result = getWeekTasks([])
      
      expect(result).toEqual([])
    })
  })

  describe('isWithinWeek', () => {
    it('should return true for today', () => {
      const today = new Date()
      
      expect(isWithinWeek(today)).toBe(true)
    })

    it('should return true for date within next 6 days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 3)
      
      expect(isWithinWeek(futureDate)).toBe(true)
    })

    it('should return false for date beyond next week', () => {
      const farFutureDate = new Date()
      farFutureDate.setDate(farFutureDate.getDate() + 10)
      
      expect(isWithinWeek(farFutureDate)).toBe(false)
    })

    it('should return false for past dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      
      expect(isWithinWeek(pastDate)).toBe(false)
    })
  })

  describe('createDateWithCurrentTime', () => {
    it('should create date with current time', () => {
      const targetDate = '2024-12-25'
      const result = createDateWithCurrentTime(targetDate)
      
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      
      const resultDate = new Date(result)
      expect(resultDate.getFullYear()).toBe(2024)
      expect(resultDate.getMonth()).toBe(11) // December (0-indexed)
      expect(resultDate.getDate()).toBe(25)
    })

    it('should preserve current time components', () => {
      const now = new Date()
      const targetDate = '2024-01-01'
      const result = createDateWithCurrentTime(targetDate)
      const resultDate = new Date(result)
      
      // Время должно быть близко к текущему (в пределах секунды)
      expect(Math.abs(resultDate.getHours() - now.getHours())).toBeLessThanOrEqual(1)
      expect(Math.abs(resultDate.getMinutes() - now.getMinutes())).toBeLessThanOrEqual(1)
    })
  })

  describe('adaptTaskToTaskWithLevel', () => {
    it('should adapt task to TaskWithLevel format', () => {
      const task = createMockTask({
        id: '1',
        name: 'Test Task',
        priority: 'high',
        isCompleted: false,
        createdAt: '2024-01-01T10:00:00.000Z'
      })
      
      const result = adaptTaskToTaskWithLevel(task)
      
      expect(result).toEqual({
        id: '1',
        title: 'Test Task',
        status: 'pending',
        level: 'high',
        isCompleted: false,
        createdAt: '2024-01-01T10:00:00.000Z'
      })
    })

    it('should handle completed task', () => {
      const task = createMockTask({
        id: '2',
        name: 'Completed Task',
        priority: 'medium',
        isCompleted: true
      })
      
      const result = adaptTaskToTaskWithLevel(task)
      
      expect(result.status).toBe('completed')
      expect(result.isCompleted).toBe(true)
    })

    it('should extract clean name from task with date prefix', () => {
      const task = createMockTask({
        id: '3',
        name: '[2024-01-15] Task with date prefix',
        priority: 'low'
      })
      
      const result = adaptTaskToTaskWithLevel(task)
      
      expect(result.title).toBe('Task with date prefix')
    })
  })
})