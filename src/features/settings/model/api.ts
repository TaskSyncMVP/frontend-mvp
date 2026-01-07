import apiClient from '@/shared/api/client';
import { profileApi } from '@/entities/user';
import {
    UserProfile,
    PomodoroSettings,
    UpdatePomodoroData
} from './types';

export { profileApi };

export const pomodoroApi = {
    updateSettings: async (data: UpdatePomodoroData): Promise<{ settings: PomodoroSettings }> => {
        const response = await apiClient.put('/user/pomodoro-settings', data);
        return response.data;
    },

    getSettings: async (): Promise<{ settings: PomodoroSettings }> => {
        const response = await apiClient.get('/user/pomodoro-settings');
        return response.data;
    },
};

export const settingsApi = {
    ...profileApi,
    ...pomodoroApi,

    getAllSettings: async (): Promise<{
        profile: UserProfile;
        pomodoro: PomodoroSettings;
    }> => {
        const [profileResponse, pomodoroResponse] = await Promise.all([
            profileApi.getProfile(),
            pomodoroApi.getSettings(),
        ]);

        return {
            profile: profileResponse.user,
            pomodoro: pomodoroResponse.settings,
        };
    },
};
