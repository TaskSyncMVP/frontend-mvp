'use client';

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {authApi, LoginCredentials, RegisterData} from '@shared/api/auth';
import {User} from '@shared/api/client';
import { cookies } from '@shared/lib/cookies';

const getErrorMessage = (error: any, type: 'login' | 'register'): string => {
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

            try {
                const user = await authApi.getCurrentUser();
                setState({
                    user,
                    isLoading: false,
                    isAuthenticated: true,
                    error: null,
                });
            } catch (error) {
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
        } catch (error: any) {
            const errorMessage = getErrorMessage(error, 'login');
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
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
        } catch (error: any) {
            const errorMessage = getErrorMessage(error, 'register');
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

    const clearError = () => {
        setState(prev => ({...prev, error: null}));
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export {AuthContext};
