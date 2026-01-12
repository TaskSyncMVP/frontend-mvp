import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pomodoroSessionApi } from './api';
import { UpdatePomodoroSessionDto } from './types';
import { toast } from 'sonner';

export const pomodoroKeys = {
    all: ['pomodoro'] as const,
    sessions: () => [...pomodoroKeys.all, 'sessions'] as const,
    currentSession: () => [...pomodoroKeys.sessions(), 'current'] as const,
};

export const useCurrentPomodoroSession = () => {
    return useQuery({
        queryKey: pomodoroKeys.currentSession(),
        queryFn: pomodoroSessionApi.getCurrentSession,
        staleTime: 1000 * 60 * 5,
        refetchInterval: false,
        retry: 1,
    });
};

export const useCreatePomodoroSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => pomodoroSessionApi.createSession(),
        onSuccess: (newSession) => {
            queryClient.setQueryData(pomodoroKeys.currentSession(), newSession);
            queryClient.invalidateQueries({ queryKey: pomodoroKeys.sessions() });
        },
        onError: (error) => {
            console.error('Failed to create pomodoro session:', error);
            toast.error('Failed to start pomodoro session');
        },
    });
};

export const useUpdatePomodoroSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePomodoroSessionDto }) => 
            pomodoroSessionApi.updateSession(id, data),
        onSuccess: (updatedSession) => {
            queryClient.setQueryData(pomodoroKeys.currentSession(), updatedSession);
        },
        onError: (error) => {
            console.error('Failed to update pomodoro session:', error);
        },
        retry: 1,
    });
};

export const useDeletePomodoroSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => pomodoroSessionApi.deleteSession(id),
        onSuccess: () => {
            queryClient.setQueryData(pomodoroKeys.currentSession(), null);
            queryClient.invalidateQueries({ queryKey: pomodoroKeys.sessions() });
            toast.success('Pomodoro session reset');
        },
        onError: (error) => {
            console.error('Failed to delete pomodoro session:', error);
            toast.error('Failed to reset pomodoro session');
        },
    });
};