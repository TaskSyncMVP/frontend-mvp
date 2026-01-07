'use client';

import {Input, Button} from "@shared/ui";
import {useEffect, useRef, useCallback, memo} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/features/auth";
import {SettingsFormSchemas, settingsFormSchema} from "../lib/settings-form-schemas";
import {useUpdateProfile} from "../lib";
import {LogOut} from "lucide-react";
import {toast} from "sonner";

interface SettingsFormProps {
    onSubmitSuccess?: () => void;
}

export const SettingsForm = memo<SettingsFormProps>(function SettingsForm({ onSubmitSuccess }) {
    const {user, logout, isLoading} = useAuth();
    const updateProfileMutation = useUpdateProfile();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        reset,
    } = useForm<SettingsFormSchemas>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            name: '',
            password: '',
        },
    });

    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('password', '');
        }
    }, [user, setValue]);

    const handleLogout = useCallback(async () => {
        try {
            toast.loading('Logging out...', { id: 'logout' });
            await logout();
            toast.success('Logged out successfully!', { id: 'logout' });
        } catch {
            toast.error('Failed to logout. Please try again.', { id: 'logout' });
        }
    }, [logout]);

    const onSubmit = useCallback(async (data: SettingsFormSchemas) => {
        if (!isDirty) {
            toast.info('No changes to save');
            return;
        }

        const updateData: { name?: string; password?: string } = {};

        if (data.name && data.name !== user?.name) {
            updateData.name = data.name;
        }

        if (data.password && data.password.trim()) {
            updateData.password = data.password;
        }

        if (Object.keys(updateData).length > 0) {
            toast.loading('Saving profile...', { id: 'profile-update' });
            
            updateProfileMutation.mutate(updateData, {
                onSuccess: () => {
                    toast.success('Profile updated successfully!', { id: 'profile-update' });
                    
                    setValue('password', '');
                    reset({ name: data.name, password: '' });

                    if (passwordInputRef.current) {
                        passwordInputRef.current.value = '';
                    }

                    onSubmitSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to update profile. Please try again.', { id: 'profile-update' });
                }
            });
        } else {
            toast.info('No changes to save');
        }
    }, [isDirty, user?.name, updateProfileMutation, setValue, reset, onSubmitSuccess]);

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
    }, [handleSubmit, onSubmit]);

    useEffect(() => {
        const handleNavbarSubmit = () => {
            handleSubmit(onSubmit)();
        };

        window.addEventListener('navbar:settings-submit', handleNavbarSubmit);

        return () => {
            window.removeEventListener('navbar:settings-submit', handleNavbarSubmit);
        };
    }, [handleSubmit, onSubmit]);

    return (
        <div className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={user?.email || ''}
                        disabled={true}
                        className="opacity-50 cursor-not-allowed"
                        title="Email cannot be changed"
                    />
                    <Input
                        {...register("name")}
                        placeholder="Name"
                        disabled={updateProfileMutation.isPending}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive mt-1 col-span-2">{errors.name.message}</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <Input
                        {...register("password")}
                        placeholder="New Password (leave empty to keep current)"
                        type="password"
                        showPasswordToggle
                        disabled={updateProfileMutation.isPending}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                    <div className="flex items-end gap-6">
                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending || !isDirty}
                            className="hidden md:flex"
                        >
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            disabled={isLoading || updateProfileMutation.isPending}
                            variant="outline"
                            className="w-full"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
});