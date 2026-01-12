import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Define settings schemas for testing
const userSettingsSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name too long'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long'),
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .optional(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .optional(),
  confirmPassword: z.string()
    .optional()
}).refine((data) => {
  if (data.newPassword && !data.confirmPassword) {
    return false
  }
  if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const pomodoroSettingsSchema = z.object({
  workDuration: z.number()
    .min(1, 'Work duration must be at least 1 minute')
    .max(120, 'Work duration cannot exceed 120 minutes'),
  shortBreakDuration: z.number()
    .min(1, 'Short break must be at least 1 minute')
    .max(60, 'Short break cannot exceed 60 minutes'),
  longBreakDuration: z.number()
    .min(1, 'Long break must be at least 1 minute')
    .max(120, 'Long break cannot exceed 120 minutes'),
  roundsUntilLongBreak: z.number()
    .min(2, 'Must have at least 2 rounds until long break')
    .max(10, 'Cannot exceed 10 rounds until long break'),
  autoStartBreaks: z.boolean(),
  autoStartPomodoros: z.boolean(),
  enableNotifications: z.boolean()
})

type UserSettingsForm = z.infer<typeof userSettingsSchema>
type PomodoroSettingsForm = z.infer<typeof pomodoroSettingsSchema>

describe('Settings Schemas', () => {
  describe('userSettingsSchema', () => {
    it('should accept valid user settings', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const result = userSettingsSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should trim whitespace from name', () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: 'john@example.com'
      }

      const result = userSettingsSchema.parse(dataWithWhitespace)
      expect(result.name).toBe('John Doe')
    })

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com'
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Name is required')
    })

    it('should reject whitespace-only name', () => {
      const invalidData = {
        name: '   ',
        email: 'john@example.com'
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Name is required')
    })

    it('should reject name that is too long', () => {
      const invalidData = {
        name: 'a'.repeat(51),
        email: 'john@example.com'
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Name too long')
    })

    it('should accept name at maximum length', () => {
      const validData = {
        name: 'a'.repeat(50),
        email: 'john@example.com'
      }

      const result = userSettingsSchema.parse(validData)
      expect(result.name).toBe('a'.repeat(50))
    })

    it('should validate email format', () => {
      const invalidEmails = [
        'invalid-email',
        'missing@domain',
        '@missing-local.com',
        'spaces in@email.com',
        'double@@domain.com'
      ]

      invalidEmails.forEach(email => {
        expect(() => userSettingsSchema.parse({
          name: 'John Doe',
          email
        })).toThrow('Invalid email format')
      })
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      validEmails.forEach(email => {
        const result = userSettingsSchema.parse({
          name: 'John Doe',
          email
        })
        expect(result.email).toBe(email)
      })
    })

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(90) + '@example.com' // > 100 chars
      
      expect(() => userSettingsSchema.parse({
        name: 'John Doe',
        email: longEmail
      })).toThrow('Email too long')
    })

    it('should handle password change validation', () => {
      const validPasswordChange = {
        name: 'John Doe',
        email: 'john@example.com',
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123'
      }

      const result = userSettingsSchema.parse(validPasswordChange)
      expect(result).toEqual(validPasswordChange)
    })

    it('should reject short new password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        newPassword: '1234567' // 7 chars, less than 8
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Password must be at least 8 characters')
    })

    it('should reject password that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        newPassword: 'a'.repeat(101)
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Password too long')
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        newPassword: 'password123',
        confirmPassword: 'different123'
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Passwords do not match')
    })

    it('should require confirm password when new password is provided', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        newPassword: 'password123'
        // Missing confirmPassword
      }

      expect(() => userSettingsSchema.parse(invalidData)).toThrow('Passwords do not match')
    })

    it('should allow profile update without password change', () => {
      const validData = {
        name: 'John Doe Updated',
        email: 'john.updated@example.com'
      }

      const result = userSettingsSchema.parse(validData)
      expect(result).toEqual(validData)
    })
  })

  describe('pomodoroSettingsSchema', () => {
    it('should accept valid pomodoro settings', () => {
      const validData = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        enableNotifications: true
      }

      const result = pomodoroSettingsSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should validate work duration bounds', () => {
      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 0,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Work duration must be at least 1 minute')

      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 121,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Work duration cannot exceed 120 minutes')
    })

    it('should validate short break duration bounds', () => {
      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 0,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Short break must be at least 1 minute')

      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 61,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Short break cannot exceed 60 minutes')
    })

    it('should validate long break duration bounds', () => {
      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 0,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Long break must be at least 1 minute')

      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 121,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Long break cannot exceed 120 minutes')
    })

    it('should validate rounds until long break bounds', () => {
      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 1,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Must have at least 2 rounds until long break')

      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 11,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow('Cannot exceed 10 rounds until long break')
    })

    it('should accept boolean values for auto-start settings', () => {
      const settings1 = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: true,
        autoStartPomodoros: true,
        enableNotifications: true
      }

      const settings2 = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        enableNotifications: false
      }

      expect(pomodoroSettingsSchema.parse(settings1)).toEqual(settings1)
      expect(pomodoroSettingsSchema.parse(settings2)).toEqual(settings2)
    })

    it('should reject non-boolean values for auto-start settings', () => {
      expect(() => pomodoroSettingsSchema.parse({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: 'true', // String instead of boolean
        autoStartPomodoros: false,
        enableNotifications: false
      })).toThrow()
    })

    it('should handle edge case values', () => {
      const edgeCaseSettings = {
        workDuration: 1, // Minimum
        shortBreakDuration: 60, // Maximum
        longBreakDuration: 120, // Maximum
        roundsUntilLongBreak: 10, // Maximum
        autoStartBreaks: false,
        autoStartPomodoros: true,
        enableNotifications: false
      }

      const result = pomodoroSettingsSchema.parse(edgeCaseSettings)
      expect(result).toEqual(edgeCaseSettings)
    })

    it('should have correct TypeScript type inference', () => {
      const settings: PomodoroSettingsForm = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsUntilLongBreak: 4,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        enableNotifications: true
      }

      const result = pomodoroSettingsSchema.parse(settings)
      expect(result).toEqual(settings)
    })
  })

  describe('Schema integration', () => {
    it('should work with realistic user settings', () => {
      const userSettings: UserSettingsForm = {
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
        currentPassword: 'currentpass123',
        newPassword: 'newpassword456',
        confirmPassword: 'newpassword456'
      }

      const result = userSettingsSchema.parse(userSettings)
      expect(result).toEqual(userSettings)
    })

    it('should work with realistic pomodoro settings', () => {
      const pomodoroSettings: PomodoroSettingsForm = {
        workDuration: 50, // 50-minute work sessions
        shortBreakDuration: 10, // 10-minute short breaks
        longBreakDuration: 30, // 30-minute long breaks
        roundsUntilLongBreak: 3, // Long break after 3 rounds
        autoStartBreaks: true,
        autoStartPomodoros: false,
        enableNotifications: true
      }

      const result = pomodoroSettingsSchema.parse(pomodoroSettings)
      expect(result).toEqual(pomodoroSettings)
    })

    it('should maintain type safety across different settings', () => {
      const userUpdate: Partial<UserSettingsForm> = {
        name: 'Updated Name'
      }

      const pomodoroUpdate: Partial<PomodoroSettingsForm> = {
        workDuration: 30,
        enableNotifications: false
      }

      // These should compile without TypeScript errors
      expect(typeof userUpdate.name).toBe('string')
      expect(typeof pomodoroUpdate.workDuration).toBe('number')
      expect(typeof pomodoroUpdate.enableNotifications).toBe('boolean')
    })
  })
})