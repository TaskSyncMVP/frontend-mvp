import type { User } from '@/entities/user';

export type { User as UserProfile, UpdateProfileData, UpdateProfileResponse, LoginCredentials, RegisterData, AuthResponse } from '@/entities/user';

export interface PomodoroSettings {
    workInterval: number;
    breakInterval: number;
    intervalsCount: number;
}

export interface UpdatePomodoroData {
    workInterval?: number;
    breakInterval?: number;
    intervalsCount?: number;
}

export interface SettingsState {
    profile: User | null;
    pomodoro: PomodoroSettings | null;
    isLoading: boolean;
    error: string | null;
}

