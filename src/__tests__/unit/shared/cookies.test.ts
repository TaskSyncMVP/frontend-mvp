import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cookies } from '@shared/lib/cookies'

const mockCookie = vi.fn()
Object.defineProperty(document, 'cookie', {
  get: mockCookie,
  set: vi.fn(),
  configurable: true
})

describe('Cookies Utils', () => {
  beforeEach(() => {
    mockCookie.mockReturnValue('')
    vi.clearAllMocks()
  })

  describe('set', () => {
    it('should set cookie with default options', () => {
      const setSpy = vi.spyOn(document, 'cookie', 'set')
      
      cookies.set('testKey', 'testValue')
      
      expect(setSpy).toHaveBeenCalledWith('testKey=testValue; path=/; sameSite=lax; secure')
    })

    it('should set cookie with custom options', () => {
      const setSpy = vi.spyOn(document, 'cookie', 'set')
      
      cookies.set('testKey', 'testValue', {
        maxAge: 3600,
        domain: 'example.com',
        secure: false,
        sameSite: 'lax'
      })
      
      expect(setSpy).toHaveBeenCalledWith(
        'testKey=testValue; path=/; sameSite=lax; max-age=3600; domain=example.com'
      )
    })

    it('should handle expires option', () => {
      const setSpy = vi.spyOn(document, 'cookie', 'set')
      const expireDate = new Date('2024-12-31T23:59:59.000Z')
      
      cookies.set('testKey', 'testValue', {
        expires: expireDate
      })
      
      expect(setSpy).toHaveBeenCalledWith(
        `testKey=testValue; path=/; sameSite=lax; expires=${expireDate.toUTCString()}; secure`
      )
    })
  })

  describe('get', () => {
    it('should get cookie value', () => {
      mockCookie.mockReturnValue('testKey=testValue; otherKey=otherValue')
      
      const result = cookies.get('testKey')
      
      expect(result).toBe('testValue')
    })

    it('should return null for non-existent cookie', () => {
      mockCookie.mockReturnValue('otherKey=otherValue')
      
      const result = cookies.get('testKey')
      
      expect(result).toBeNull()
    })

    it('should handle empty cookie string', () => {
      mockCookie.mockReturnValue('')
      
      const result = cookies.get('testKey')
      
      expect(result).toBeNull()
    })

    it('should handle cookie with special characters', () => {
      mockCookie.mockReturnValue('testKey=test%20value%3Dspecial')
      
      const result = cookies.get('testKey')
      
      expect(result).toBe('test value=special')
    })
  })

  describe('remove', () => {
    it('should remove cookie', () => {
      const setSpy = vi.spyOn(document, 'cookie', 'set')
      
      cookies.remove('testKey')
      
      expect(setSpy).toHaveBeenCalledWith(
        'testKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      )
    })

    it('should remove cookie with custom path', () => {
      const setSpy = vi.spyOn(document, 'cookie', 'set')
      
      cookies.remove('testKey', { path: '/admin' })
      
      expect(setSpy).toHaveBeenCalledWith(
        'testKey=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      )
    })
  })

  describe('getAll', () => {
    it('should get all cookies as object', () => {
      mockCookie.mockReturnValue('key1=value1; key2=value2; key3=value3')
      
      const result = cookies.getAll()
      
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      })
    })

    it('should return empty object for no cookies', () => {
      mockCookie.mockReturnValue('')
      
      const result = cookies.getAll()
      
      expect(result).toEqual({})
    })

    it('should handle malformed cookies', () => {
      mockCookie.mockReturnValue('validKey=validValue; invalidKey; anotherValid=anotherValue')
      
      const result = cookies.getAll()
      
      expect(result).toEqual({
        validKey: 'validValue',
        anotherValid: 'anotherValue'
      })
    })
  })
})