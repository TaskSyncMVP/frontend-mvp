import { AxiosError } from 'axios';
import { handleApiError, isNetworkError, isServerError } from '@/shared/lib/error-handler';
import { vi } from 'vitest';

describe('error-handler', () => {
  describe('handleApiError', () => {
    it('should handle AxiosError with response data', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        data: { message: 'Custom error message' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      };
      axiosError.code = 'ERR_BAD_REQUEST';

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Custom error message',
        status: 400,
        code: 'ERR_BAD_REQUEST'
      });
    });

    it('should handle AxiosError without response data message', () => {
      const axiosError = new AxiosError('Network Error');
      axiosError.response = {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any
      };
      axiosError.code = 'ERR_NETWORK';

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Network Error',
        status: 500,
        code: 'ERR_NETWORK'
      });
    });

    it('should handle AxiosError without response', () => {
      const axiosError = new AxiosError('Connection timeout');
      axiosError.code = 'ECONNABORTED';

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Connection timeout',
        status: undefined,
        code: 'ECONNABORTED'
      });
    });

    it('should handle AxiosError with empty message', () => {
      const axiosError = new AxiosError('');
      axiosError.response = {
        data: {},
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      };

      const result = handleApiError(axiosError);

      expect(result).toEqual({
        message: 'Network error occurred',
        status: 404,
        code: undefined
      });
    });

    it('should handle regular Error', () => {
      const error = new Error('Regular error message');

      const result = handleApiError(error);

      expect(result).toEqual({
        message: 'Regular error message'
      });
    });

    it('should handle string error', () => {
      const error = 'String error';

      const result = handleApiError(error);

      expect(result).toEqual({
        message: 'Unknown error occurred'
      });
    });

    it('should handle null error', () => {
      const result = handleApiError(null);

      expect(result).toEqual({
        message: 'Unknown error occurred'
      });
    });

    it('should handle undefined error', () => {
      const result = handleApiError(undefined);

      expect(result).toEqual({
        message: 'Unknown error occurred'
      });
    });

    it('should handle object error', () => {
      const error = { someProperty: 'value' };

      const result = handleApiError(error);

      expect(result).toEqual({
        message: 'Unknown error occurred'
      });
    });
  });

  describe('isNetworkError', () => {
    it('should return true for AxiosError without response', () => {
      const axiosError = new AxiosError('Network Error');
      // No response property set

      const result = isNetworkError(axiosError);

      expect(result).toBe(true);
    });

    it('should return false for AxiosError with response', () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      };

      const result = isNetworkError(axiosError);

      expect(result).toBe(false);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Regular error');

      const result = isNetworkError(error);

      expect(result).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isNetworkError('string')).toBe(false);
      expect(isNetworkError(null)).toBe(false);
      expect(isNetworkError(undefined)).toBe(false);
      expect(isNetworkError({})).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for AxiosError with 500 status', () => {
      const axiosError = new AxiosError('Server Error');
      axiosError.response = {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any
      };

      const result = isServerError(axiosError);

      expect(result).toBe(true);
    });

    it('should return true for AxiosError with 502 status', () => {
      const axiosError = new AxiosError('Bad Gateway');
      axiosError.response = {
        data: {},
        status: 502,
        statusText: 'Bad Gateway',
        headers: {},
        config: {} as any
      };

      const result = isServerError(axiosError);

      expect(result).toBe(true);
    });

    it('should return false for AxiosError with 400 status', () => {
      const axiosError = new AxiosError('Bad Request');
      axiosError.response = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      };

      const result = isServerError(axiosError);

      expect(result).toBe(false);
    });

    it('should return false for AxiosError with 404 status', () => {
      const axiosError = new AxiosError('Not Found');
      axiosError.response = {
        data: {},
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      };

      const result = isServerError(axiosError);

      expect(result).toBe(false);
    });

    it('should return false for AxiosError without response', () => {
      const axiosError = new AxiosError('Network Error');
      // No response property set

      const result = isServerError(axiosError);

      expect(result).toBe(false);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Regular error');

      const result = isServerError(error);

      expect(result).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isServerError('string')).toBe(false);
      expect(isServerError(null)).toBe(false);
      expect(isServerError(undefined)).toBe(false);
      expect(isServerError({})).toBe(false);
    });

    it('should handle edge case with status 499', () => {
      const axiosError = new AxiosError('Client Closed Request');
      axiosError.response = {
        data: {},
        status: 499,
        statusText: 'Client Closed Request',
        headers: {},
        config: {} as any
      };

      const result = isServerError(axiosError);

      expect(result).toBe(false);
    });
  });
});