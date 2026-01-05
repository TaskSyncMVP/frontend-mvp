import apiClient from '@shared/api/client';

export interface UserProfileResponse {
    user: {
        id: string;
        email: string;
        name?: string;
        workInterval: number;
        breakInterval: number;
        intervalsCount: number;
        createdAt: string;
    }
}

export const statisticsApi = {
    getUserProfile: async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },
};