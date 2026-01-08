'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@features/auth';
import { Input, Button } from '@shared/ui';
import { pomodoroSettingsSchema, PomodoroSettingsSchema } from '../lib/pomodoro-schemas';
import { useUpdatePomodoroSettings } from '../lib/pomodoro-hooks';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
            workInterval: 25,
            breakInterval: 5,
            intervalsCount: 4,
        },
    });

    useEffect(() => {
        if (user) {
            setValue('workInterval', user.workInterval || 25);
            setValue('breakInterval', user.breakInterval || 5);
            setValue('intervalsCount', user.intervalsCount || 4);
            reset({
                workInterval: user.workInterval || 25,
                breakInterval: user.breakInterval || 5,
                intervalsCount: user.intervalsCount || 4,
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
                        min="1"
                        max="60"
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
                        min="1"
                        max="30"
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
                    min="1"
                    max="10"
                    disabled={updatePomodoroMutation.isPending}
                />
                {errors.intervalsCount && (
                    <p className="text-sm text-destructive mt-1">{errors.intervalsCount.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={!isDirty || updatePomodoroMutation.isPending}
                className="w-full"
            >
                {updatePomodoroMutation.isPending ? 'Saving...' : 'Save Pomodoro Settings'}
            </Button>
        </form>
    );
}