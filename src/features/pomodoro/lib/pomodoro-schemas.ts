import { z } from 'zod';
import { POMODORO_DEFAULTS } from '@shared/constants/pomodoro';

export const pomodoroSettingsSchema = z.object({
    workInterval: z.number()
        .min(POMODORO_DEFAULTS.MIN_INTERVAL, `Work interval must be at least ${POMODORO_DEFAULTS.MIN_INTERVAL} minute`)
        .max(POMODORO_DEFAULTS.MAX_WORK_INTERVAL, `Work interval cannot exceed ${POMODORO_DEFAULTS.MAX_WORK_INTERVAL} minutes`),
    breakInterval: z.number()
        .min(POMODORO_DEFAULTS.MIN_INTERVAL, `Break interval must be at least ${POMODORO_DEFAULTS.MIN_INTERVAL} minute`)
        .max(POMODORO_DEFAULTS.MAX_BREAK_INTERVAL, `Break interval cannot exceed ${POMODORO_DEFAULTS.MAX_BREAK_INTERVAL} minutes`),
    intervalsCount: z.number()
        .min(POMODORO_DEFAULTS.MIN_INTERVAL, `Intervals count must be at least ${POMODORO_DEFAULTS.MIN_INTERVAL}`)
        .max(POMODORO_DEFAULTS.MAX_INTERVALS, `Intervals count cannot exceed ${POMODORO_DEFAULTS.MAX_INTERVALS}`),
});

export type PomodoroSettingsSchema = z.infer<typeof pomodoroSettingsSchema>;

export interface UpdatePomodoroData {
    workInterval?: number;
    breakInterval?: number;
    intervalsCount?: number;
}