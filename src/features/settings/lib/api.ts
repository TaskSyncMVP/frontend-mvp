import apiClient from '@/shared/api/client';
import { PomodoroSettings, UpdatePomodoroData } from './types';

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