'use client';

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {authApi, User, LoginCredentials, RegisterData} from '@/entities/user';
import { cookies } from '@shared/lib/cookies';

interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
    message?: string;
}

const getErrorMessage = (error: ApiError, type: 'login' | 'register'): string => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() || '';

    if (type === 'login') {
        if (status === 401) {
            if (message.includes('user not found') || message.includes('email not found')) {
                return 'User not found';
            }
            if (message.includes('password') || message.includes('invalid password')) {
                return 'Wrong login or password';
            }
            return 'Invalid email or password';
        }
        return 'Please check the data you entered';
    }

    if (type === 'register') {
        if (status === 400 && (message.includes('already') || message.includes('exists'))) {
            return 'This email is already registered. Try logging in instead';
        }
        return 'Registration failed. Please try again';
    }

    return 'An error occurred';
};

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const token = cookies.get('accessToken');
            if (!token) {
                setState(prev => ({...prev, isLoading: false}));
                return;
            }

            setState(prev => ({...prev, isAuthenticated: true, isLoading: false}));

            try {
                const user = await authApi.getCurrentUser();
                setState({
                    user,
                    isLoading: false,
                    isAuthenticated: true,
                    error: null,
                });
            } catch {
                cookies.remove('accessToken');
                setState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: null,
                });
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setState(prev => ({...prev, isLoading: true, error: null}));

        try {
            const response = await authApi.login(credentials);
            cookies.set('accessToken', response.accessToken);
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch {
            const errorMessage = getErrorMessage(new Error('Login failed') as ApiError, 'login');
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw new Error('Login failed');
        }
    };

    const register = async (data: RegisterData) => {
        setState(prev => ({...prev, isLoading: true, error: null}));

        try {
            const response = await authApi.register(data);
            cookies.set('accessToken', response.accessToken);
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error) {
            const errorMessage = getErrorMessage(error as ApiError, 'register');
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    };

    const logout = async () => {
        setState(prev => ({...prev, isLoading: true}));

        try {
            await authApi.logout();
        } finally {
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
            });
        }
    };

    const refreshUser = async () => {
        try {
            const user = await authApi.getCurrentUser();
            setState(prev => ({
                ...prev,
                user,
            }));
        } catch {
            cookies.remove('accessToken');
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
            });
        }
    };

    const clearError = () => {
        setState(prev => ({...prev, error: null}));
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        if (typeof window === 'undefined') {
            throw new Error('useAuth called on server side. Make sure AuthProvider is properly set up.');
        }
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export {AuthContext};
