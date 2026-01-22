'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, LinkButton, Input} from "@shared/ui";
import {registerFormSchema, RegisterFormSchemas} from "../../lib/register-form-schemas";
import {useAuth} from "../../lib/auth-context";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {safeStorage} from "@shared/lib/storage";

export function RegisterForm() {
    const { register: registerUser, isLoading, error, clearError } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<RegisterFormSchemas>({
        resolver: zodResolver(registerFormSchema),
    });

    const onSubmit = async (data: RegisterFormSchemas) => {
        try {
            clearError();
            await registerUser(data);
            reset();
            toast.success('Account created successfully!');
            const redirectTo = safeStorage.getItem('redirectAfterLogin') || '/home';
            safeStorage.removeItem('redirectAfterLogin');
            router.push(redirectTo);
        } catch {
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-3">Registration</h1>
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <div className="flex gap-3 flex-col">
                        <Input
                            {...register("email")}
                            placeholder='Email'
                            type="text"
                            disabled={isLoading}
                            data-testid="email-input"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive" data-testid="email-error">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex gap-3 flex-col">
                        <Input
                            {...register("password")}
                            placeholder="Password (min 6 characters)"
                            type="password"
                            showPasswordToggle
                            disabled={isLoading}
                            data-testid="password-input"
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive" data-testid="password-error">{errors.password.message}</p>
                        )}
                    </div>
                    {error && (
                        <p className="text-sm text-destructive text-center" data-testid="error-message">{error}</p>
                    )}
                    <Button className="w-full" size="xl" type="submit" disabled={isLoading} data-testid="register-button">
                        {isLoading ? 'Registering...' : 'Enter'}
                    </Button>
                </form>
                <LinkButton href="/login" data-testid="login-link">Login</LinkButton>
            </div>
        </div>
    );
}
