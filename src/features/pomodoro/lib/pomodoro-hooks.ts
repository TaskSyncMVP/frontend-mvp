import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { pomodoroApi } from './pomodoro-api';
import { UpdatePomodoroData } from './pomodoro-schemas';
import { useAuth } from '@features/auth';

export const useUpdatePomodoroSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePomodoroData) => pomodoroApi.updatePomodoroSettings(data),
        onSuccess: (response) => {
            queryClient.setQueryData(['user'], response.user);
            
            toast.success('Pomodoro settings updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update pomodoro settings:', error);
            toast.error('Failed to update pomodoro settings. Please try again.');
        },
    });
};

export const usePomodoroSettings = () => {
    const { user } = useAuth();
    
    return {
        workInterval: user?.workInterval || 25,
        breakInterval: user?.breakInterval || 5,
        intervalsCount: user?.intervalsCount || 4,
        isLoading: !user,
    };
};