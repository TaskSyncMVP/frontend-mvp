import apiClient from '@shared/api/client';
import { authApi } from '@shared/api/auth';

export const userApi = {
    getCurrentUser: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data.user;
    },
    updateProfile: async (data: any) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },
    login: authApi.login,
    register: authApi.register,
    logout: authApi.logout,
};