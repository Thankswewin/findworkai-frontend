import {
  AppError,
  ErrorCategory,
  ErrorSeverity,
  categorizeError,
  getErrorMessage,
  withRetry,
  createApiError,
} from '../error-handler'

describe('Error Handler', () => {
  describe('AppError', () => {
    it('should create an AppError with correct properties', () => {
      const error = new AppError(
        'Test error',
        ErrorCategory.VALIDATION,
        ErrorSeverity.HIGH,
        400,
        { field: 'email' }
      )

      expect(error.message).toBe('Test error')
      expect(error.category).toBe(ErrorCategory.VALIDATION)
      expect(error.severity).toBe(ErrorSeverity.HIGH)
      expect(error.statusCode).toBe(400)
      expect(error.context).toEqual({ field: 'email' })
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should serialize to JSON correctly', () => {
      const error = new AppError('Test error', ErrorCategory.NETWORK)
      const json = error.toJSON()

      expect(json).toHaveProperty('message', 'Test error')
      expect(json).toHaveProperty('category', ErrorCategory.NETWORK)
      expect(json).toHaveProperty('severity')
      expect(json).toHaveProperty('timestamp')
    })
  })

  describe('categorizeError', () => {
    it('should categorize network errors', () => {
      const error = new Error('Network request failed')
      expect(categorizeError(error)).toBe(ErrorCategory.NETWORK)
    })

    it('should categorize authentication errors', () => {
      const error = new Error('401 Unauthorized')
      expect(categorizeError(error)).toBe(ErrorCategory.AUTHENTICATION)
    })

    it('should categorize authorization errors', () => {
      const error = new Error('403 Forbidden')
      expect(categorizeError(error)).toBe(ErrorCategory.AUTHORIZATION)
    })

    it('should categorize rate limit errors', () => {
      const error = new Error('429 Too Many Requests')
      expect(categorizeError(error)).toBe(ErrorCategory.RATE_LIMIT)
    })

    it('should categorize validation errors', () => {
      const error = new Error('Invalid input data')
      expect(categorizeError(error)).toBe(ErrorCategory.VALIDATION)
    })

    it('should return UNKNOWN for unrecognized errors', () => {
      const error = new Error('Something went wrong')
      expect(categorizeError(error)).toBe(ErrorCategory.UNKNOWN)
    })

    it('should handle AppError instances', () => {
      const error = new AppError('Test', ErrorCategory.SERVER)
      expect(categorizeError(error)).toBe(ErrorCategory.SERVER)
    })
  })

  describe('getErrorMessage', () => {
    it('should return message from Error instance', () => {
      const error = new Error('Test error message')
      expect(getErrorMessage(error)).toBe('Test error message')
    })

    it('should return message from AppError instance', () => {
      const error = new AppError('App error message')
      expect(getErrorMessage(error)).toBe('App error message')
    })

    it('should return string directly', () => {
      expect(getErrorMessage('String error')).toBe('String error')
    })

    it('should return default message for unknown types', () => {
      expect(getErrorMessage(123)).toBe('An unexpected error occurred. Please try again.')
      expect(getErrorMessage(null)).toBe('An unexpected error occurred. Please try again.')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.')
    })

    it('should return user-friendly message for network errors', () => {
      const error = new Error('fetch failed')
      expect(getErrorMessage(error)).toBe('Network error. Please check your connection and try again.')
    })
  })

  describe('withRetry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0
      const fn = jest.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          throw new Error('Network error')
        }
        return Promise.resolve('success')
      })

      const result = await withRetry(fn, {
        maxAttempts: 3,
        delay: 10,
      })

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        withRetry(fn, {
          maxAttempts: 2,
          delay: 10,
        })
      ).rejects.toThrow('Network error')

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not retry if shouldRetry returns false', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Validation error'))

      await expect(
        withRetry(fn, {
          maxAttempts: 3,
          delay: 10,
          shouldRetry: () => false,
        })
      ).rejects.toThrow('Validation error')

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should use exponential backoff', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Network error'))
      const startTime = Date.now()

      try {
        await withRetry(fn, {
          maxAttempts: 3,
          delay: 10,
          backoff: 'exponential',
        })
      } catch {
        // Expected to fail
      }

      const duration = Date.now() - startTime
      // First retry after 10ms, second after 20ms (10 * 2^1)
      expect(duration).toBeGreaterThanOrEqual(30)
    })
  })

  describe('createApiError', () => {
    it('should create error for 400 response', () => {
      const response = new Response(null, { status: 400 })
      const error = createApiError(response, { 
        message: 'Bad Request',
        code: 'INVALID_INPUT',
        timestamp: new Date(),
        details: { field: 'email' }
      })

      expect(error.category).toBe(ErrorCategory.VALIDATION)
      expect(error.severity).toBe(ErrorSeverity.LOW)
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Bad Request')
    })

    it('should create error for 401 response', () => {
      const response = new Response(null, { status: 401 })
      const error = createApiError(response)

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION)
      expect(error.severity).toBe(ErrorSeverity.HIGH)
      expect(error.statusCode).toBe(401)
    })

    it('should create error for 500 response', () => {
      const response = new Response(null, { status: 500 })
      const error = createApiError(response)

      expect(error.category).toBe(ErrorCategory.SERVER)
      expect(error.severity).toBe(ErrorSeverity.HIGH)
      expect(error.statusCode).toBe(500)
    })

    it('should use default message when not provided', () => {
      const response = new Response(null, { status: 404 })
      const error = createApiError(response)

      expect(error.message).toBe('Request failed with status 404')
    })
  })
})
