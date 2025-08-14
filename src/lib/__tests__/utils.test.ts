import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class')
    expect(result).toBe('base-class additional-class')
  })

  it('should handle conditional classes', () => {
    const condition = true
    const result = cn('base', condition && 'conditional')
    expect(result).toBe('base conditional')
  })

  it('should handle false conditions', () => {
    const condition = false
    const result = cn('base', condition && 'conditional')
    expect(result).toBe('base')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('should handle arrays', () => {
    const result = cn(['base', 'array'])
    expect(result).toBe('base array')
  })

  it('should handle objects', () => {
    const result = cn({
      'base': true,
      'excluded': false,
      'included': true,
    })
    expect(result).toBe('base included')
  })

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toBe('base end')
  })

  it('should handle empty strings', () => {
    const result = cn('', 'base', '')
    expect(result).toBe('base')
  })
})
