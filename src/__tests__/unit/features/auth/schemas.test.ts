import { describe, it, expect } from 'vitest'
import { loginFormSchema } from '@features/auth/lib/login-form-schemas'
import { registerFormSchema } from '@features/auth/lib/register-form-schemas'

describe('Auth Schemas', () => {
  describe('loginFormSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = loginFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate minimum password length', () => {
      const validData = {
        email: 'test@example.com',
        password: '123456'
      }

      const result = loginFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }

      const result = loginFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123'
      }

      const result = loginFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345'
      }

      const result = loginFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['password'])
      }
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }

      const result = loginFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['password'])
      }
    })

    it('should reject missing fields', () => {
      const invalidData = {}

      const result = loginFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(2)
      }
    })

    it('should handle various email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.co.uk',
        'user123@domain123.com'
      ]

      validEmails.forEach(email => {
        const data = { email, password: 'password123' }
        const result = loginFormSchema.safeParse(data)
        
        expect(result.success).toBe(true)
      })
    })
  })

  describe('registerFormSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'newuser@example.com',
        password: 'password123'
      }

      const result = registerFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate minimum password length', () => {
      const validData = {
        email: 'newuser@example.com',
        password: '123456'
      }

      const result = registerFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email-format',
        password: 'password123'
      }

      const result = registerFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: '12345'
      }

      const result = registerFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['password'])
      }
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123'
      }

      const result = registerFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: ''
      }

      const result = registerFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
    })

    it('should handle complex email addresses', () => {
      const complexEmails = [
        'user.name+tag@example.com',
        'user_name@example-domain.com',
        'user123@sub.domain.co.uk',
        'a@b.co'
      ]

      complexEmails.forEach(email => {
        const data = { email, password: 'validpassword' }
        const result = registerFormSchema.safeParse(data)
        
        expect(result.success).toBe(true)
      })
    })

    it('should reject malformed emails', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing@domain',
        'spaces @domain.com',
        'user@',
        '@domain.com'
      ]

      invalidEmails.forEach(email => {
        const data = { email, password: 'validpassword' }
        const result = registerFormSchema.safeParse(data)
        
        expect(result.success).toBe(false)
      })
    })

    it('should handle long passwords', () => {
      const longPassword = 'a'.repeat(100)
      const data = {
        email: 'test@example.com',
        password: longPassword
      }

      const result = registerFormSchema.safeParse(data)
      
      expect(result.success).toBe(true)
    })
  })
})