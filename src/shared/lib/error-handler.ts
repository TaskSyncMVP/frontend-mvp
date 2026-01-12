import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Unknown error occurred',
  };
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

export const isServerError = (error: unknown): boolean => {
  return error instanceof AxiosError && 
         error.response?.status !== undefined && 
         error.response.status >= 500;
};