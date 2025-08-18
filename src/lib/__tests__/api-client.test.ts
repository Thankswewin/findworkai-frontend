import { apiClient } from '../api-client'
import { AppError, ErrorCategory } from '../error-handler'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
        headers: new Headers(),
      })

      const result = await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockData)
    })

    it('should handle GET request with query parameters', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      await apiClient.get('/test', { 
        params: { search: 'query', limit: 10 } 
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test?search=query&limit=10'),
        expect.any(Object)
      )
    })

    it('should handle 404 errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test')).rejects.toThrow(AppError)
      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 404,
        category: ErrorCategory.VALIDATION,
      })
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const requestData = { name: 'New Item' }
      const responseData = { id: 1, ...requestData }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => responseData,
        headers: new Headers(),
      })

      const result = await apiClient.post('/test', requestData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(responseData)
    })

    it('should handle validation errors', async () => {
      const errorResponse = {
        message: 'Validation failed',
        errors: { name: 'Name is required' }
      }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorResponse,
        headers: new Headers(),
      })

      await expect(apiClient.post('/test', {})).rejects.toThrow(AppError)
      await expect(apiClient.post('/test', {})).rejects.toMatchObject({
        status: 400,
        category: ErrorCategory.VALIDATION,
      })
    })
  })

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const updateData = { name: 'Updated Item' }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updateData,
        headers: new Headers(),
      })

      const result = await apiClient.put('/test/1', updateData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      )
      expect(result).toEqual(updateData)
    })
  })

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
        headers: new Headers(),
      })

      await apiClient.delete('/test/1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(apiClient.get('/test')).rejects.toThrow('Network error')
    })

    it('should handle 401 authentication errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Authentication required' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 401,
        category: ErrorCategory.AUTHENTICATION,
      })
    })

    it('should handle 403 authorization errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({ message: 'Insufficient permissions' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 403,
        category: ErrorCategory.AUTHORIZATION,
      })
    })

    it('should handle 429 rate limit errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Rate limit exceeded' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 429,
        category: ErrorCategory.RATE_LIMIT,
      })
    })

    it('should handle 500 server errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 500,
        category: ErrorCategory.SERVER,
      })
    })
  })

  describe('Request interceptors', () => {
    it('should add authorization header if token exists', async () => {
      // Mock localStorage
      const mockToken = 'test-token-123'
      Storage.prototype.getItem = jest.fn(() => mockToken)
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      )
    })

    it('should not add authorization header if no token', async () => {
      Storage.prototype.getItem = jest.fn(() => null)
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      await apiClient.get('/test')

      const callArgs = (fetch as jest.Mock).mock.calls[0][1]
      expect(callArgs.headers['Authorization']).toBeUndefined()
    })
  })

  describe('Request timeout', () => {
    it('should timeout long-running requests', async () => {
      jest.useFakeTimers()
      
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 35000))
      )

      const promise = apiClient.get('/test')
      
      jest.advanceTimersByTime(30000)
      
      await expect(promise).rejects.toThrow('Request timeout')
      
      jest.useRealTimers()
    })
  })

  describe('Retry logic', () => {
    it('should retry failed requests up to 3 times', async () => {
      let attempts = 0
      ;(global.fetch as jest.Mock).mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
          headers: new Headers(),
        })
      })

      const result = await apiClient.get('/test', { retry: true })
      
      expect(result).toEqual({ success: true })
      expect(fetch).toHaveBeenCalledTimes(3)
    })

    it('should not retry non-retryable errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid input' }),
        headers: new Headers(),
      })

      await expect(apiClient.get('/test', { retry: true }))
        .rejects.toThrow(AppError)
      
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
