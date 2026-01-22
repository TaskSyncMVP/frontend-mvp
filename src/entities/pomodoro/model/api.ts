import apiClient from '@shared/api/client';
import { PomodoroSession, UpdatePomodoroSessionDto } from './types';

export const pomodoroSessionApi = {
    getCurrentSession: async (): Promise<PomodoroSession | null> => {
        try {
            const response = await apiClient.get('/user/timer/today');
            return response.data;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 404) {
                    return null;
                }
            }
            throw error;
        }
    },

    createSession: async (): Promise<PomodoroSession> => {
        const response = await apiClient.post('/user/timer', {});
        return response.data;
    },

    updateSession: async (id: string, data: UpdatePomodoroSessionDto): Promise<PomodoroSession> => {
        const response = await apiClient.put(`/user/timer/${id}`, data);
        return response.data;
    },

    deleteSession: async (id: string): Promise<void> => {
        await apiClient.delete(`/user/timer/${id}`);
    },

    updateRound: async (roundId: string, data: { totalSeconds?: number; isCompleted?: boolean }) => {
        const response = await apiClient.put(`/user/timer/round/${roundId}`, data);
        return response.data;
    },
};