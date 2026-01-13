import { describe, it, expect, beforeEach, vi } from 'vitest'
import { safeStorage } from '@shared/lib/storage'

describe('Safe Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SSR safety', () => {
    it('should return null in SSR environment for getItem', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = safeStorage.getItem('testKey')
      
      expect(result).toBeNull()
      
      // Восстанавливаем
      global.window = originalWindow
    })

    it('should do nothing in SSR environment for setItem', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      // Не должно выбросить ошибку
      expect(() => {
        safeStorage.setItem('testKey', 'testValue')
      }).not.toThrow()
      
      // Восстанавливаем
      global.window = originalWindow
    })

    it('should do nothing in SSR environment for removeItem', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      // Не должно выбросить ошибку
      expect(() => {
        safeStorage.removeItem('testKey')
      }).not.toThrow()
      
      // Восстанавливаем
      global.window = originalWindow
    })
  })

  describe('error handling', () => {
    it('should return null when sessionStorage throws error on getItem', () => {
      const originalGetItem = sessionStorage.getItem
      sessionStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      const result = safeStorage.getItem('testKey')
      
      expect(result).toBeNull()
      
      // Восстанавливаем
      sessionStorage.getItem = originalGetItem
    })

    it('should handle storage quota exceeded error on setItem', () => {
      const originalSetItem = sessionStorage.setItem
      sessionStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      // Не должно выбросить ошибку
      expect(() => {
        safeStorage.setItem('testKey', 'testValue')
      }).not.toThrow()
      
      // Восстанавливаем
      sessionStorage.setItem = originalSetItem
    })

    it('should handle storage error during removal', () => {
      const originalRemoveItem = sessionStorage.removeItem
      sessionStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      // Не должно выбросить ошибку
      expect(() => {
        safeStorage.removeItem('testKey')
      }).not.toThrow()
      
      // Восстанавливаем
      sessionStorage.removeItem = originalRemoveItem
    })
  })

  describe('basic functionality', () => {
    it('should handle removal of non-existent key', () => {
      // Не должно выбросить ошибку
      expect(() => {
        safeStorage.removeItem('nonExistentKey')
      }).not.toThrow()
    })

    it('should return null for non-existent key', () => {
      const result = safeStorage.getItem('nonExistentKey')
      
      expect(result).toBeNull()
    })

    it('should have all required methods', () => {
      expect(typeof safeStorage.getItem).toBe('function')
      expect(typeof safeStorage.setItem).toBe('function')
      expect(typeof safeStorage.removeItem).toBe('function')
    })
  })
})