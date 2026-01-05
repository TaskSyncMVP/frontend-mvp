import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { cookies } from '@shared/lib/cookies';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  workInterval: number;
  breakInterval: number;
  intervalsCount: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                          originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<AuthResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/login/access-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;

        cookies.set('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        cookies.remove('accessToken');
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
