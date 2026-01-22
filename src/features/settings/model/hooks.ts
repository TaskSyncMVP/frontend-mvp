import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { settingsApi } from './api';
import { UpdateProfileData, UpdatePomodoroData } from './types';

export const useUpdateProfile = () => {
    const { refreshUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileData) => settingsApi.updateProfile(data),
        onSuccess: () => {
            refreshUser();
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });
};

export const useUpdatePomodoroSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePomodoroData) => settingsApi.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pomodoro-settings'] });
        },
    });
};

export const useUserProfile = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['user-profile'],
        queryFn: () => settingsApi.getProfile(),
        enabled: !!user,
        initialData: user ? { user } : undefined,
    });
};

export const usePomodoroSettings = () => {
    return useQuery({
        queryKey: ['pomodoro-settings'],
        queryFn: () => settingsApi.getSettings(),
        enabled: false,
    });
};

export const useSettings = () => {
    const updateProfile = useUpdateProfile();
    const updatePomodoro = useUpdatePomodoroSettings();
    const userProfile = useUserProfile();
    const pomodoroSettings = usePomodoroSettings();

    return {
        profile: userProfile.data?.user,
        isProfileLoading: userProfile.isLoading,
        updateProfile,

        pomodoro: pomodoroSettings.data?.settings,
        isPomodoroLoading: pomodoroSettings.isLoading,
        updatePomodoro,

        isLoading: userProfile.isLoading || pomodoroSettings.isLoading,
        error: userProfile.error || pomodoroSettings.error,
    };
};



