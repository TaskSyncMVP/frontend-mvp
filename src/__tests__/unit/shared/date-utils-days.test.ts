import { describe, it, expect } from 'vitest'
import { 
  groupTasksByDays, 
  generateDaysWithTasks, 
  getTodayTasks,
  extractDateFromTaskName,
  adaptTaskToTaskWithLevel,
  type DayData 
} from '@/shared/lib/date-utils'
import { Task } from '@/entities/task'

describe('Date Utils - Days Functionality', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Task 1',
      priority: 'high',
      isCompleted: false,
      createdAt: '2026-01-12T10:00:00Z',
      updatedAt: '2026-01-12T10:00:00Z'
    },
    {
      id: '2', 
      name: '[2026-01-13] Task for tomorrow',
      priority: 'medium',
      isCompleted: true,
      createdAt: '2026-01-12T11:00:00Z',
      updatedAt: '2026-01-12T11:00:00Z'
    },
    {
      id: '3',
      name: 'Another task today',
      priority: 'low',
      isCompleted: false,
      createdAt: '2026-01-12T12:00:00Z',
      updatedAt: '2026-01-12T12:00:00Z'
    }
  ]

  describe('extractDateFromTaskName', () => {
    it('should extract date from task name with date prefix', () => {
      const result = extractDateFromTaskName('[2026-01-13] Task for tomorrow')
      
      expect(result.date).toBe('2026-01-13')
      expect(result.cleanName).toBe('Task for tomorrow')
    })

    it('should return null date for task without date prefix', () => {
      const result = extractDateFromTaskName('Regular task name')
      
      expect(result.date).toBeNull()
      expect(result.cleanName).toBe('Regular task name')
    })

    it('should handle empty task name', () => {
      const result = extractDateFromTaskName('')
      
      expect(result.date).toBeNull()
      expect(result.cleanName).toBe('')
    })
  })

  describe('adaptTaskToTaskWithLevel', () => {
    it('should adapt task to TaskWithLevel format', () => {
      const task = mockTasks[0]
      const result = adaptTaskToTaskWithLevel(task)

      expect(result).toEqual({
        id: '1',
        title: 'Task 1',
        status: 'pending',
        level: 'high',
        isCompleted: false,
        createdAt: '2026-01-12T10:00:00Z'
      })
    })

    it('should adapt completed task correctly', () => {
      const task = mockTasks[1]
      const result = adaptTaskToTaskWithLevel(task)

      expect(result).toEqual({
        id: '2',
        title: 'Task for tomorrow',
        status: 'completed',
        level: 'medium',
        isCompleted: true,
        createdAt: '2026-01-12T11:00:00Z'
      })
    })

    it('should clean task name from date prefix', () => {
      const task = mockTasks[1]
      const result = adaptTaskToTaskWithLevel(task)

      expect(result.title).toBe('Task for tomorrow')
      expect(result.title).not.toContain('[2026-01-13]')
    })
  })

  describe('groupTasksByDays', () => {
    it('should group tasks by their target dates', () => {
      const result = groupTasksByDays(mockTasks)

      expect(result).toHaveLength(2) // 2 different dates
      
      // Check that days are sorted
      expect(result[0].date).toBe('2026-01-12')
      expect(result[1].date).toBe('2026-01-13')
    })

    it('should include correct tasks for each day', () => {
      const result = groupTasksByDays(mockTasks)

      // Day 1 (2026-01-12) should have 2 tasks
      expect(result[0].tasks).toHaveLength(2)
      expect(result[0].tasks.map(t => t.id)).toContain('1')
      expect(result[0].tasks.map(t => t.id)).toContain('3')

      // Day 2 (2026-01-13) should have 1 task
      expect(result[1].tasks).toHaveLength(1)
      expect(result[1].tasks[0].id).toBe('2')
    })

    it('should format day data correctly', () => {
      const result = groupTasksByDays(mockTasks)
      const firstDay = result[0]

      expect(firstDay).toHaveProperty('date')
      expect(firstDay).toHaveProperty('dayName')
      expect(firstDay).toHaveProperty('month')
      expect(firstDay).toHaveProperty('day')
      expect(firstDay).toHaveProperty('weekday')
      expect(firstDay).toHaveProperty('tasks')

      expect(typeof firstDay.date).toBe('string')
      expect(typeof firstDay.dayName).toBe('string')
      expect(typeof firstDay.month).toBe('string')
      expect(typeof firstDay.day).toBe('number')
      expect(typeof firstDay.weekday).toBe('string')
      expect(Array.isArray(firstDay.tasks)).toBe(true)
    })

    it('should handle empty tasks array', () => {
      const result = groupTasksByDays([])

      expect(result).toEqual([])
    })
  })

  describe('generateDaysWithTasks', () => {
    it('should generate days within specified range', () => {
      const result = generateDaysWithTasks(mockTasks)

      // Should generate days based on APP_CONSTANTS.CALENDAR_DAYS_RANGE
      // Default range is usually 7 days back and 7 days forward = 15 days total
      expect(result.length).toBeGreaterThan(10)
      expect(result.length).toBeLessThan(20)
    })

    it('should include today in the generated days', () => {
      const result = generateDaysWithTasks(mockTasks)
      const today = new Date().toISOString().split('T')[0]

      const todayDay = result.find(day => day.date === today)
      expect(todayDay).toBeDefined()
    })

    it('should distribute tasks to correct days', () => {
      const result = generateDaysWithTasks(mockTasks)

      // Find day with date 2026-01-12
      const day1 = result.find(day => day.date === '2026-01-12')
      expect(day1?.tasks).toHaveLength(2)

      // Find day with date 2026-01-13  
      const day2 = result.find(day => day.date === '2026-01-13')
      expect(day2?.tasks).toHaveLength(1)
    })

    it('should generate days with empty tasks for dates without tasks', () => {
      const result = generateDaysWithTasks([])

      result.forEach(day => {
        expect(day.tasks).toEqual([])
      })
    })
  })

  describe('getTodayTasks', () => {
    it('should return tasks for today only', () => {
      // Mock today's date to match our test data
      const today = '2026-01-12'
      const todayTasks = mockTasks.filter(task => {
        const { date } = extractDateFromTaskName(task.name)
        const targetDate = date || task.createdAt.split('T')[0]
        return targetDate === today
      })

      const result = getTodayTasks(mockTasks)

      expect(result).toHaveLength(2) // Tasks 1 and 3 are for today
      expect(result.map(t => t.id)).toContain('1')
      expect(result.map(t => t.id)).toContain('3')
      expect(result.map(t => t.id)).not.toContain('2') // Task 2 is for tomorrow
    })

    it('should return empty array when no tasks for today', () => {
      const futureTasks: Task[] = [{
        id: '1',
        name: '[2026-12-31] Future task',
        priority: 'high',
        isCompleted: false,
        createdAt: '2026-12-31T10:00:00Z',
        updatedAt: '2026-12-31T10:00:00Z'
      }]

      const result = getTodayTasks(futureTasks)
      expect(result).toEqual([])
    })

    it('should adapt tasks to TaskWithLevel format', () => {
      const result = getTodayTasks(mockTasks)

      result.forEach(task => {
        expect(task).toHaveProperty('id')
        expect(task).toHaveProperty('title')
        expect(task).toHaveProperty('status')
        expect(task).toHaveProperty('level')
        expect(task).toHaveProperty('isCompleted')
        expect(task).toHaveProperty('createdAt')
      })
    })
  })

  describe('DayData interface compliance', () => {
    it('should create DayData objects with correct structure', () => {
      const result = groupTasksByDays(mockTasks)

      result.forEach((day: DayData) => {
        // Required string properties
        expect(typeof day.date).toBe('string')
        expect(typeof day.dayName).toBe('string')
        expect(typeof day.month).toBe('string')
        expect(typeof day.weekday).toBe('string')

        // Required number property
        expect(typeof day.day).toBe('number')
        expect(day.day).toBeGreaterThan(0)
        expect(day.day).toBeLessThanOrEqual(31)

        // Required array property
        expect(Array.isArray(day.tasks)).toBe(true)

        // Validate task structure
        day.tasks.forEach(task => {
          expect(typeof task.id).toBe('string')
          expect(typeof task.title).toBe('string')
          expect(typeof task.status).toBe('string')
          expect(typeof task.level).toBe('string')
          expect(typeof task.isCompleted).toBe('boolean')
          expect(typeof task.createdAt).toBe('string')
        })
      })
    })

    it('should have valid date format', () => {
      const result = groupTasksByDays(mockTasks)

      result.forEach(day => {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it('should have valid day names', () => {
      const result = groupTasksByDays(mockTasks)
      const validDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

      result.forEach(day => {
        expect(validDayNames).toContain(day.dayName)
      })
    })

    it('should have valid weekday abbreviations', () => {
      const result = groupTasksByDays(mockTasks)
      const validWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      result.forEach(day => {
        expect(validWeekdays).toContain(day.weekday)
      })
    })

    it('should have valid month abbreviations', () => {
      const result = groupTasksByDays(mockTasks)
      const validMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      result.forEach(day => {
        expect(validMonths).toContain(day.month)
      })
    })
  })
})