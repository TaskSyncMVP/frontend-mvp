import apiClient from '@/shared/api/client';
import { UpdateProfileData, UpdateProfileResponse, LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const profileApi = {
    updateProfile: async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },

    getProfile: async (): Promise<{ user: User }> => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },
};

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login/access-token');
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<{ user: User; statistics: unknown }>('/user/profile');
        return response.data.user;
    },
};



