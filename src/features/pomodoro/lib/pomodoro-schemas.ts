import { z } from 'zod';

export const pomodoroSettingsSchema = z.object({
    workInterval: z.number()
        .min(1, 'Work interval must be at least 1 minute')
        .max(60, 'Work interval cannot exceed 60 minutes'),
    breakInterval: z.number()
        .min(1, 'Break interval must be at least 1 minute')
        .max(30, 'Break interval cannot exceed 30 minutes'),
    intervalsCount: z.number()
        .min(1, 'Intervals count must be at least 1')
        .max(10, 'Intervals count cannot exceed 10'),
});

export type PomodoroSettingsSchema = z.infer<typeof pomodoroSettingsSchema>;

export interface UpdatePomodoroData {
    workInterval?: number;
    breakInterval?: number;
    intervalsCount?: number;
}