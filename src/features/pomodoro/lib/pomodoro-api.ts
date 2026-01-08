import apiClient from '@shared/api/client';
import { UpdatePomodoroData } from './pomodoro-schemas';
import { User } from '@/entities/user';

export const pomodoroApi = {
    updatePomodoroSettings: async (data: UpdatePomodoroData): Promise<{ user: User }> => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },
};