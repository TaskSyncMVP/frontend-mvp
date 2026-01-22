import { describe, it, expect } from 'vitest'
import { pomodoroSettingsSchema } from '@features/pomodoro/lib/pomodoro-schemas'

describe('Pomodoro Schemas', () => {
  describe('pomodoroSettingsSchema', () => {
    it('should validate correct pomodoro settings', () => {
      const validData = {
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate minimum work interval', () => {
      const validData = {
        workInterval: 1,
        breakInterval: 5,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should validate maximum work interval', () => {
      const validData = {
        workInterval: 60,
        breakInterval: 5,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject work interval below minimum', () => {
      const invalidData = {
        workInterval: 0,
        breakInterval: 5,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['workInterval'])
      }
    })

    it('should reject work interval above maximum', () => {
      const invalidData = {
        workInterval: 61,
        breakInterval: 5,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['workInterval'])
      }
    })

    it('should validate minimum break interval', () => {
      const validData = {
        workInterval: 25,
        breakInterval: 1,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should validate maximum break interval', () => {
      const validData = {
        workInterval: 25,
        breakInterval: 30,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject break interval below minimum', () => {
      const invalidData = {
        workInterval: 25,
        breakInterval: 0,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['breakInterval'])
      }
    })

    it('should reject break interval above maximum', () => {
      const invalidData = {
        workInterval: 25,
        breakInterval: 31,
        intervalsCount: 4
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['breakInterval'])
      }
    })

    it('should validate minimum intervals count', () => {
      const validData = {
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 1
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should validate maximum intervals count', () => {
      const validData = {
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 10
      }

      const result = pomodoroSettingsSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject intervals count below minimum', () => {
      const invalidData = {
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 0
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['intervalsCount'])
      }
    })

    it('should reject intervals count above maximum', () => {
      const invalidData = {
        workInterval: 25,
        breakInterval: 5,
        intervalsCount: 11
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['intervalsCount'])
      }
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        workInterval: 25
        // missing breakInterval and intervalsCount
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
      }
    })

    it('should reject non-numeric values', () => {
      const invalidData = {
        workInterval: '25',
        breakInterval: '5',
        intervalsCount: '4'
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(3)
      }
    })

    it('should reject negative values', () => {
      const invalidData = {
        workInterval: -25,
        breakInterval: -5,
        intervalsCount: -4
      }

      const result = pomodoroSettingsSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(3)
      }
    })

    it('should handle edge case values', () => {
      const edgeCaseData = {
        workInterval: 1,
        breakInterval: 1,
        intervalsCount: 1
      }

      const result = pomodoroSettingsSchema.safeParse(edgeCaseData)
      
      expect(result.success).toBe(true)
    })
  })
})