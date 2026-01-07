import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {PomodoroSettings, SettingsState, UserProfile} from './types';

interface SettingsStore extends SettingsState {
    setProfile: (profile: UserProfile) => void;
    setPomodoro: (settings: PomodoroSettings) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    updatePomodoro: (updates: Partial<PomodoroSettings>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState: SettingsState = {
    profile: null,
    pomodoro: null,
    isLoading: false,
    error: null,
};

export const useSettingsStore = create<SettingsStore>()(
    devtools(
        (set) => ({
            ...initialState,

            setProfile: (profile) =>
                set({ profile }, false, 'settings/setProfile'),

            setPomodoro: (settings) =>
                set({ pomodoro: settings }, false, 'settings/setPomodoro'),

            updateProfile: (updates) =>
                set((state) => ({
                    profile: state.profile ? { ...state.profile, ...updates } : null,
                }), false, 'settings/updateProfile'),

            updatePomodoro: (updates) =>
                set((state) => ({
                    pomodoro: state.pomodoro ? { ...state.pomodoro, ...updates } : null,
                }), false, 'settings/updatePomodoro'),

            setLoading: (loading) =>
                set({ isLoading: loading }, false, 'settings/setLoading'),

            setError: (error) =>
                set({ error }, false, 'settings/setError'),

            reset: () =>
                set(initialState, false, 'settings/reset'),
        }),
        {
            name: 'settings-store',
        }
    )
);



