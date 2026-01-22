import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { cookies } from '@shared/lib/cookies';
import { env } from '@shared/lib/env';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message: string;
  code?: string;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [(data) => {
    if (data && typeof data === 'object' && data.constructor === Object) {
      return JSON.stringify(data);
    }
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify({});
  }],
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Only log errors in development
    if (env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: (error.response?.data as { message?: string })?.message || error.message,
        timestamp: new Date().toISOString(),
      });
    }

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                          originalRequest?.url?.includes('/auth/register');

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const { authApi } = await import('@/entities/user');
        const refreshResponse = await authApi.refreshToken();

        cookies.set('accessToken', refreshResponse.accessToken);

        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        cookies.remove('accessToken');
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(refreshError);
      }
    }

    // Retry logic for network errors and 5xx errors
    const shouldRetry = (
      (!error.response && error.code === 'NETWORK_ERROR') ||
      (error.response?.status && error.response.status >= 500)
    ) && originalRequest && !originalRequest._retryCount;

    if (shouldRetry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= MAX_RETRY_ATTEMPTS) {
        await sleep(RETRY_DELAY * originalRequest._retryCount);
        return apiClient(originalRequest);
      }
    }

    // Enhanced error information
    const apiError: ApiError = {
      response: error.response ? {
        status: error.response.status,
        data: error.response.data as { message?: string; errors?: Record<string, string[]> }
      } : undefined,
      message: error.message,
      code: error.code
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
