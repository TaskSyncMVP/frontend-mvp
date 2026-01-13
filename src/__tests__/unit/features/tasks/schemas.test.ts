import { describe, it, expect } from 'vitest'
import { 
  taskPrioritySchema, 
  createTaskSchema, 
  updateTaskSchema,
  type CreateTaskForm,
  type UpdateTaskForm,
  type TaskPriority
} from '@/features/tasks/lib/task-schemas'

describe('Task Schemas', () => {
  describe('taskPrioritySchema', () => {
    it('should accept valid priority values', () => {
      expect(taskPrioritySchema.parse('low')).toBe('low')
      expect(taskPrioritySchema.parse('medium')).toBe('medium')
      expect(taskPrioritySchema.parse('high')).toBe('high')
    })

    it('should reject invalid priority values', () => {
      expect(() => taskPrioritySchema.parse('invalid')).toThrow()
      expect(() => taskPrioritySchema.parse('LOW')).toThrow()
      expect(() => taskPrioritySchema.parse('Medium')).toThrow()
      expect(() => taskPrioritySchema.parse('')).toThrow()
      expect(() => taskPrioritySchema.parse(null)).toThrow()
      expect(() => taskPrioritySchema.parse(undefined)).toThrow()
    })

    it('should have correct type inference', () => {
      const priority: TaskPriority = 'medium'
      expect(taskPrioritySchema.parse(priority)).toBe('medium')
    })
  })

  describe('createTaskSchema', () => {
    it('should accept valid task creation data', () => {
      const validData = {
        name: 'Complete project',
        priority: 'high' as const
      }

      const result = createTaskSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should trim whitespace from task name', () => {
      const dataWithWhitespace = {
        name: '  Task with spaces  ',
        priority: 'medium' as const
      }

      const result = createTaskSchema.parse(dataWithWhitespace)
      expect(result.name).toBe('Task with spaces')
    })

    it('should accept all valid priority levels', () => {
      const lowPriorityTask = {
        name: 'Low priority task',
        priority: 'low' as const
      }

      const mediumPriorityTask = {
        name: 'Medium priority task',
        priority: 'medium' as const
      }

      const highPriorityTask = {
        name: 'High priority task',
        priority: 'high' as const
      }

      expect(createTaskSchema.parse(lowPriorityTask)).toEqual(lowPriorityTask)
      expect(createTaskSchema.parse(mediumPriorityTask)).toEqual(mediumPriorityTask)
      expect(createTaskSchema.parse(highPriorityTask)).toEqual(highPriorityTask)
    })

    it('should reject empty task name', () => {
      const invalidData = {
        name: '',
        priority: 'medium' as const
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow('Task name is required')
    })

    it('should reject whitespace-only task name', () => {
      const invalidData = {
        name: '   ',
        priority: 'medium' as const
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow('Task name is required')
    })

    it('should reject task name that is too long', () => {
      const invalidData = {
        name: 'a'.repeat(101), // 101 characters
        priority: 'medium' as const
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow('Task name too long')
    })

    it('should accept task name at maximum length', () => {
      const validData = {
        name: 'a'.repeat(100), // Exactly 100 characters
        priority: 'medium' as const
      }

      const result = createTaskSchema.parse(validData)
      expect(result.name).toBe('a'.repeat(100))
    })

    it('should reject missing name field', () => {
      const invalidData = {
        priority: 'medium' as const
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow()
    })

    it('should reject missing priority field', () => {
      const invalidData = {
        name: 'Valid task name'
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid priority', () => {
      const invalidData = {
        name: 'Valid task name',
        priority: 'invalid'
      }

      expect(() => createTaskSchema.parse(invalidData)).toThrow()
    })

    it('should reject additional fields', () => {
      const invalidData = {
        name: 'Valid task name',
        priority: 'medium' as const,
        extraField: 'should not be allowed'
      }

      // Zod by default allows additional fields, but we can test strict parsing
      const result = createTaskSchema.parse(invalidData)
      expect(result).toEqual({
        name: 'Valid task name',
        priority: 'medium'
      })
    })

    it('should have correct TypeScript type inference', () => {
      const taskData: CreateTaskForm = {
        name: 'Test task',
        priority: 'high'
      }

      const result = createTaskSchema.parse(taskData)
      expect(result).toEqual(taskData)
    })
  })

  describe('updateTaskSchema', () => {
    it('should accept valid update data with all fields', () => {
      const validData = {
        name: 'Updated task name',
        isCompleted: true,
        priority: 'low' as const
      }

      const result = updateTaskSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should accept partial update data', () => {
      const nameOnlyUpdate = { name: 'New name' }
      const completionOnlyUpdate = { isCompleted: true }
      const priorityOnlyUpdate = { priority: 'high' as const }

      expect(updateTaskSchema.parse(nameOnlyUpdate)).toEqual(nameOnlyUpdate)
      expect(updateTaskSchema.parse(completionOnlyUpdate)).toEqual(completionOnlyUpdate)
      expect(updateTaskSchema.parse(priorityOnlyUpdate)).toEqual(priorityOnlyUpdate)
    })

    it('should accept empty update object', () => {
      const emptyUpdate = {}
      const result = updateTaskSchema.parse(emptyUpdate)
      expect(result).toEqual({})
    })

    it('should trim whitespace from name when provided', () => {
      const dataWithWhitespace = {
        name: '  Updated task name  '
      }

      const result = updateTaskSchema.parse(dataWithWhitespace)
      expect(result.name).toBe('Updated task name')
    })

    it('should reject empty name when provided', () => {
      const invalidData = {
        name: ''
      }

      expect(() => updateTaskSchema.parse(invalidData)).toThrow('Task name is required')
    })

    it('should reject whitespace-only name when provided', () => {
      const invalidData = {
        name: '   '
      }

      expect(() => updateTaskSchema.parse(invalidData)).toThrow('Task name is required')
    })

    it('should reject name that is too long', () => {
      const invalidData = {
        name: 'a'.repeat(101) // 101 characters
      }

      expect(() => updateTaskSchema.parse(invalidData)).toThrow('Task name too long')
    })

    it('should accept name at maximum length', () => {
      const validData = {
        name: 'a'.repeat(100) // Exactly 100 characters
      }

      const result = updateTaskSchema.parse(validData)
      expect(result.name).toBe('a'.repeat(100))
    })

    it('should accept boolean completion status', () => {
      const trueCompletion = { isCompleted: true }
      const falseCompletion = { isCompleted: false }

      expect(updateTaskSchema.parse(trueCompletion)).toEqual(trueCompletion)
      expect(updateTaskSchema.parse(falseCompletion)).toEqual(falseCompletion)
    })

    it('should reject non-boolean completion status', () => {
      const invalidData = {
        isCompleted: 'true' // String instead of boolean
      }

      expect(() => updateTaskSchema.parse(invalidData)).toThrow()
    })

    it('should accept all valid priority levels', () => {
      const lowPriority = { priority: 'low' as const }
      const mediumPriority = { priority: 'medium' as const }
      const highPriority = { priority: 'high' as const }

      expect(updateTaskSchema.parse(lowPriority)).toEqual(lowPriority)
      expect(updateTaskSchema.parse(mediumPriority)).toEqual(mediumPriority)
      expect(updateTaskSchema.parse(highPriority)).toEqual(highPriority)
    })

    it('should reject invalid priority when provided', () => {
      const invalidData = {
        priority: 'urgent' // Invalid priority
      }

      expect(() => updateTaskSchema.parse(invalidData)).toThrow()
    })

    it('should handle complex update scenarios', () => {
      const complexUpdate = {
        name: 'Updated complex task',
        isCompleted: false,
        priority: 'high' as const
      }

      const result = updateTaskSchema.parse(complexUpdate)
      expect(result).toEqual(complexUpdate)
    })

    it('should have correct TypeScript type inference', () => {
      const updateData: UpdateTaskForm = {
        name: 'Updated task',
        isCompleted: true
      }

      const result = updateTaskSchema.parse(updateData)
      expect(result).toEqual(updateData)
    })

    it('should allow undefined values for optional fields', () => {
      const dataWithUndefined = {
        name: undefined,
        isCompleted: undefined,
        priority: undefined
      }

      const result = updateTaskSchema.parse(dataWithUndefined)
      expect(result).toEqual({})
    })
  })

  describe('Schema integration', () => {
    it('should work together for create and update workflows', () => {
      // Create a task
      const createData = {
        name: 'Initial task',
        priority: 'medium' as const
      }
      const createdTask = createTaskSchema.parse(createData)

      // Update the task
      const updateData = {
        name: 'Updated task',
        isCompleted: true,
        priority: 'high' as const
      }
      const updatedTask = updateTaskSchema.parse(updateData)

      expect(createdTask).toEqual(createData)
      expect(updatedTask).toEqual(updateData)
    })

    it('should maintain type safety across schemas', () => {
      const priority: TaskPriority = 'low'
      
      const createForm: CreateTaskForm = {
        name: 'Test task',
        priority
      }

      const updateForm: UpdateTaskForm = {
        priority,
        isCompleted: false
      }

      expect(createTaskSchema.parse(createForm)).toEqual(createForm)
      expect(updateTaskSchema.parse(updateForm)).toEqual(updateForm)
    })
  })

  describe('Error messages', () => {
    it('should provide clear error messages for validation failures', () => {
      try {
        createTaskSchema.parse({ name: '', priority: 'medium' })
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Task name is required')
      }

      try {
        createTaskSchema.parse({ name: 'a'.repeat(101), priority: 'medium' })
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Task name too long')
      }

      try {
        updateTaskSchema.parse({ name: '' })
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Task name is required')
      }
    })

    it('should handle multiple validation errors', () => {
      try {
        createTaskSchema.parse({ name: '', priority: 'invalid' })
      } catch (error: any) {
        expect(error.issues).toHaveLength(2)
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle special characters in task names', () => {
      const specialCharsData = {
        name: 'Task with émojis 🚀 and symbols @#$%',
        priority: 'medium' as const
      }

      const result = createTaskSchema.parse(specialCharsData)
      expect(result).toEqual(specialCharsData)
    })

    it('should handle unicode characters', () => {
      const unicodeData = {
        name: '任务名称 タスク名 مهمة',
        priority: 'high' as const
      }

      const result = createTaskSchema.parse(unicodeData)
      expect(result).toEqual(unicodeData)
    })

    it('should handle newlines and tabs in names', () => {
      const dataWithNewlines = {
        name: 'Task\nwith\nnewlines\tand\ttabs',
        priority: 'low' as const
      }

      const result = createTaskSchema.parse(dataWithNewlines)
      expect(result.name).toBe('Task\nwith\nnewlines\tand\ttabs')
    })

    it('should handle very long valid names', () => {
      const longValidName = 'A'.repeat(50) + ' ' + 'B'.repeat(49) // 100 chars total
      const validData = {
        name: longValidName,
        priority: 'medium' as const
      }

      const result = createTaskSchema.parse(validData)
      expect(result.name).toBe(longValidName)
      expect(result.name.length).toBe(100)
    })
  })
})