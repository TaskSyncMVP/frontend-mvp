'use client';

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {authApi, LoginCredentials, RegisterData} from '@shared/api/auth';
import {User} from '@shared/api/client';
import { cookies } from '@shared/lib/cookies';

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
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error: any) {
            // Sanitize error message to prevent XSS
            const rawMessage = error.response?.data?.message || 'Login failed';
            const errorMessage = typeof rawMessage === 'string' ? rawMessage.replace(/[<>]/g, '') : 'Login failed';
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
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error: any) {
            // Sanitize error message to prevent XSS
            const rawMessage = error.response?.data?.message || 'Registration failed';
            const errorMessage = typeof rawMessage === 'string' ? rawMessage.replace(/[<>]/g, '') : 'Registration failed';
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
