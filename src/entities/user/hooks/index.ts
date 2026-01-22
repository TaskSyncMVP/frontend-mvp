import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { profileApi, authApi } from '../api';
import { UpdateProfileData } from '../types';

export const useUpdateProfile = () => {
    const { refreshUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
        onSuccess: () => {
            refreshUser();
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });
};

export const useUserProfile = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['user-profile'],
        queryFn: () => profileApi.getProfile(),
        enabled: !!user,
        // Use data from auth context as initial data
        initialData: user ? { user } : undefined,
    });
};

export const useAuthActions = () => {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.clear();
        },
    });

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    };
};



