import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  describe('Basic functionality', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle single class name', () => {
      expect(cn('single-class')).toBe('single-class')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle undefined and null values', () => {
      expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2')
    })

    it('should handle boolean conditions', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })
  })

  describe('Conditional classes', () => {
    it('should handle conditional class objects', () => {
      expect(cn({
        'active': true,
        'disabled': false,
        'visible': true
      })).toBe('active visible')
    })

    it('should combine strings and objects', () => {
      expect(cn('base-class', {
        'active': true,
        'disabled': false
      })).toBe('base-class active')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle nested arrays and objects', () => {
      expect(cn(
        'base',
        ['array-class1', 'array-class2'],
        {
          'object-class1': true,
          'object-class2': false
        },
        'final'
      )).toBe('base array-class1 array-class2 object-class1 final')
    })
  })

  describe('Tailwind CSS class merging', () => {
    it('should merge conflicting Tailwind classes', () => {
      // Later classes should override earlier ones
      expect(cn('px-2 px-4')).toBe('px-4')
      expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500')
    })

    it('should handle responsive classes', () => {
      expect(cn('text-sm md:text-lg lg:text-xl')).toBe('text-sm md:text-lg lg:text-xl')
    })

    it('should merge padding and margin classes correctly', () => {
      expect(cn('p-2 px-4')).toBe('p-2 px-4')
      expect(cn('px-2 px-4')).toBe('px-4')
      expect(cn('p-2 p-4')).toBe('p-4')
    })

    it('should handle hover and focus states', () => {
      expect(cn('hover:bg-red-500 hover:bg-blue-500')).toBe('hover:bg-blue-500')
      expect(cn('focus:ring-2 focus:ring-4')).toBe('focus:ring-4')
    })

    it('should preserve non-conflicting classes', () => {
      expect(cn('text-red-500 bg-blue-500 p-4')).toBe('text-red-500 bg-blue-500 p-4')
    })
  })

  describe('Complex scenarios', () => {
    it('should handle component-style class combinations', () => {
      const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium'
      const variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90'
      const sizeClasses = 'h-10 px-4 py-2'
      
      const result = cn(baseClasses, variantClasses, sizeClasses)
      expect(result).toContain('inline-flex')
      expect(result).toContain('bg-primary')
      expect(result).toContain('h-10')
    })

    it('should handle button variant patterns', () => {
      const getButtonClasses = (variant: 'primary' | 'secondary', size: 'sm' | 'lg') => {
        return cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          {
            'bg-primary text-white': variant === 'primary',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-lg': size === 'lg'
          }
        )
      }

      expect(getButtonClasses('primary', 'sm')).toContain('bg-primary')
      expect(getButtonClasses('primary', 'sm')).toContain('h-8')
      expect(getButtonClasses('secondary', 'lg')).toContain('bg-secondary')
      expect(getButtonClasses('secondary', 'lg')).toContain('h-12')
    })

    it('should handle state-based classes', () => {
      const getStateClasses = (isActive: boolean, isDisabled: boolean, isLoading: boolean) => {
        return cn(
          'base-class',
          {
            'active-class': isActive && !isDisabled,
            'disabled-class opacity-50': isDisabled,
            'loading-class animate-spin': isLoading
          }
        )
      }

      expect(getStateClasses(true, false, false)).toContain('active-class')
      expect(getStateClasses(false, true, false)).toContain('disabled-class')
      expect(getStateClasses(false, false, true)).toContain('loading-class')
      expect(getStateClasses(true, true, false)).not.toContain('active-class')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(cn('', 'class1', '', 'class2')).toBe('class1 class2')
    })

    it('should handle whitespace', () => {
      expect(cn('  class1  ', '  class2  ')).toBe('class1 class2')
    })

    it('should handle duplicate classes', () => {
      // clsx/twMerge doesn't deduplicate by default, it preserves order
      expect(cn('class1', 'class2', 'class1')).toBe('class1 class2 class1')
    })

    it('should handle very long class strings', () => {
      const longClass = 'very-long-class-name-that-might-be-used-in-some-scenarios'
      expect(cn(longClass, 'short')).toBe(`${longClass} short`)
    })

    it('should handle special characters in class names', () => {
      expect(cn('class-with-dashes', 'class_with_underscores', 'class:with:colons')).toBe('class-with-dashes class_with_underscores class:with:colons')
    })

    it('should handle numbers in class names', () => {
      expect(cn('text-2xl', 'w-1/2', 'grid-cols-12')).toBe('text-2xl w-1/2 grid-cols-12')
    })
  })

  describe('Performance considerations', () => {
    it('should handle many class inputs efficiently', () => {
      const manyClasses = Array.from({ length: 50 }, (_, i) => `class-${i}`)
      const result = cn(...manyClasses)
      expect(result).toContain('class-0')
      expect(result).toContain('class-49')
    })

    it('should handle deeply nested conditional objects', () => {
      const result = cn({
        'level1': true,
        'level2': {
          'nested1': true,
          'nested2': false
        } as any // Type assertion for testing purposes
      })
      // Note: clsx handles nested objects, but this tests the behavior
      expect(typeof result).toBe('string')
    })
  })

  describe('Real-world usage patterns', () => {
    it('should work with React component patterns', () => {
      // Simulating a common React component pattern
      const getCardClasses = (className?: string, variant?: 'default' | 'destructive') => {
        return cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          {
            'border-destructive/50 text-destructive dark:border-destructive': variant === 'destructive'
          },
          className
        )
      }

      expect(getCardClasses()).toContain('rounded-lg')
      expect(getCardClasses('custom-class')).toContain('custom-class')
      expect(getCardClasses(undefined, 'destructive')).toContain('border-destructive')
    })

    it('should work with form input patterns', () => {
      const getInputClasses = (hasError: boolean, isDisabled: boolean) => {
        return cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-destructive focus-visible:ring-destructive': hasError,
            'opacity-50 cursor-not-allowed': isDisabled
          }
        )
      }

      const normalInput = getInputClasses(false, false)
      const errorInput = getInputClasses(true, false)
      const disabledInput = getInputClasses(false, true)

      expect(normalInput).toContain('border-input')
      expect(errorInput).toContain('border-destructive')
      expect(disabledInput).toContain('cursor-not-allowed')
    })

    it('should work with animation and transition classes', () => {
      const getAnimationClasses = (isVisible: boolean, isLoading: boolean) => {
        return cn(
          'transition-all duration-200 ease-in-out',
          {
            'opacity-100 translate-y-0': isVisible,
            'opacity-0 translate-y-2': !isVisible,
            'animate-pulse': isLoading
          }
        )
      }

      expect(getAnimationClasses(true, false)).toContain('opacity-100')
      expect(getAnimationClasses(false, false)).toContain('opacity-0')
      expect(getAnimationClasses(true, true)).toContain('animate-pulse')
    })
  })

  describe('Type safety', () => {
    it('should accept various ClassValue types', () => {
      // These should all compile and work without TypeScript errors
      expect(() => cn('string')).not.toThrow()
      expect(() => cn(['array', 'of', 'strings'])).not.toThrow()
      expect(() => cn({ object: true, keys: false })).not.toThrow()
      expect(() => cn(undefined)).not.toThrow()
      expect(() => cn(null)).not.toThrow()
      expect(() => cn(false)).not.toThrow()
      expect(() => cn(0)).not.toThrow()
    })

    it('should handle mixed types in a single call', () => {
      const result = cn(
        'string-class',
        ['array-class1', 'array-class2'],
        { 'object-class': true },
        undefined,
        null,
        false && 'conditional-class',
        true && 'visible-class'
      )
      
      expect(result).toContain('string-class')
      expect(result).toContain('array-class1')
      expect(result).toContain('object-class')
      expect(result).toContain('visible-class')
      expect(result).not.toContain('conditional-class')
    })
  })
})