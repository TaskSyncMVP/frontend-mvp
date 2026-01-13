'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@features/auth';
import { Input, Button } from '@shared/ui';
import { pomodoroSettingsSchema, PomodoroSettingsSchema } from '../lib/pomodoro-schemas';
import { useUpdatePomodoroSettings } from '../lib/pomodoro-hooks';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { POMODORO_DEFAULTS } from '@shared/constants/pomodoro';

export function PomodoroSettingsForm() {
    const { user } = useAuth();
    const updatePomodoroMutation = useUpdatePomodoroSettings();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        reset,
    } = useForm<PomodoroSettingsSchema>({
        resolver: zodResolver(pomodoroSettingsSchema),
        defaultValues: {
            workInterval: POMODORO_DEFAULTS.WORK_INTERVAL,
            breakInterval: POMODORO_DEFAULTS.BREAK_INTERVAL,
            intervalsCount: POMODORO_DEFAULTS.INTERVALS_COUNT,
        },
    });

    useEffect(() => {
        if (user) {
            setValue('workInterval', user.workInterval || POMODORO_DEFAULTS.WORK_INTERVAL);
            setValue('breakInterval', user.breakInterval || POMODORO_DEFAULTS.BREAK_INTERVAL);
            setValue('intervalsCount', user.intervalsCount || POMODORO_DEFAULTS.INTERVALS_COUNT);
            reset({
                workInterval: user.workInterval || POMODORO_DEFAULTS.WORK_INTERVAL,
                breakInterval: user.breakInterval || POMODORO_DEFAULTS.BREAK_INTERVAL,
                intervalsCount: user.intervalsCount || POMODORO_DEFAULTS.INTERVALS_COUNT,
            });
        }
    }, [user, setValue, reset]);

    const onSubmit = async (data: PomodoroSettingsSchema) => {
        if (!isDirty) {
            toast.info('No changes to save');
            return;
        }

        const updateData: Record<string, number> = {};
        
        if (data.workInterval !== user?.workInterval) {
            updateData.workInterval = data.workInterval;
        }
        if (data.breakInterval !== user?.breakInterval) {
            updateData.breakInterval = data.breakInterval;
        }
        if (data.intervalsCount !== user?.intervalsCount) {
            updateData.intervalsCount = data.intervalsCount;
        }

        if (Object.keys(updateData).length > 0) {
            toast.loading('Saving pomodoro settings...', { id: 'pomodoro-update' });
            
            updatePomodoroMutation.mutate(updateData, {
                onSuccess: () => {
                    toast.success('Pomodoro settings saved successfully!', { id: 'pomodoro-update' });
                    reset(data);
                },
                onError: () => {
                    toast.error('Failed to save pomodoro settings', { id: 'pomodoro-update' });
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <Input
                        {...register('workInterval', { valueAsNumber: true })}
                        placeholder="Work Interval (min)"
                        type="number"
                        min={POMODORO_DEFAULTS.MIN_INTERVAL.toString()}
                        max={POMODORO_DEFAULTS.MAX_WORK_INTERVAL.toString()}
                        disabled={updatePomodoroMutation.isPending}
                    />
                    {errors.workInterval && (
                        <p className="text-sm text-destructive mt-1">{errors.workInterval.message}</p>
                    )}
                </div>

                <div>
                    <Input
                        {...register('breakInterval', { valueAsNumber: true })}
                        placeholder="Break Interval (min)"
                        type="number"
                        min={POMODORO_DEFAULTS.MIN_INTERVAL.toString()}
                        max={POMODORO_DEFAULTS.MAX_BREAK_INTERVAL.toString()}
                        disabled={updatePomodoroMutation.isPending}
                    />
                    {errors.breakInterval && (
                        <p className="text-sm text-destructive mt-1">{errors.breakInterval.message}</p>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Input
                    {...register('intervalsCount', { valueAsNumber: true })}
                    placeholder="Intervals Count"
                    type="number"
                    min={POMODORO_DEFAULTS.MIN_INTERVAL.toString()}
                    max={POMODORO_DEFAULTS.MAX_INTERVALS.toString()}
                    disabled={updatePomodoroMutation.isPending}
                />
                {errors.intervalsCount && (
                    <p className="text-sm text-destructive mt-1">{errors.intervalsCount.message}</p>
                )}
                <Button
                    type="submit"
                    disabled={!isDirty || updatePomodoroMutation.isPending}
                    className="hidden md:flex"
                >
                    {updatePomodoroMutation.isPending ? 'Saving...' : 'Save Pomodoro Settings'}
                </Button>
            </div>


        </form>
    );
}