import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUpdateProfile as useUpdateProfileFromEntity } from '@/entities/user/hooks';
import { UpdatePomodoroData } from './types';
import { pomodoroApi } from './api';

export const useUpdateProfile = useUpdateProfileFromEntity;

export const useUpdatePomodoroSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePomodoroData) => pomodoroApi.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pomodoro-settings'] });
        },
    });
};

export const usePomodoroSettings = () => {
    return useQuery({
        queryKey: ['pomodoro-settings'],
        queryFn: () => pomodoroApi.getSettings(),
        enabled: false,
    });
};

export const useSettings = () => {
    const updateProfile = useUpdateProfile();
    const updatePomodoro = useUpdatePomodoroSettings();
    const pomodoroSettings = usePomodoroSettings();

    return {
        updateProfile,
        pomodoro: pomodoroSettings.data?.settings,
        isPomodoroLoading: pomodoroSettings.isLoading,
        updatePomodoro,
        isLoading: pomodoroSettings.isLoading,
        error: pomodoroSettings.error,
    };
};