'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, LinkButton, Input} from "@shared/ui";
import {loginFormSchema, LoginFormSchemas} from "../../lib/login-form-schemas";
import {useAuth} from "../../lib/auth-context";
import {useRouter} from "next/navigation";
import {safeStorage} from "@shared/lib/storage";

export function LoginForm() {
    const { login, isLoading, error, clearError } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<LoginFormSchemas>({
        resolver: zodResolver(loginFormSchema),
    });

    const onSubmit = async (data: LoginFormSchemas) => {
        try {
            clearError();
            await login(data);
            reset();
            const redirectTo = safeStorage.getItem('redirectAfterLogin') || '/home';
            safeStorage.removeItem('redirectAfterLogin');
            router.push(redirectTo);
        } catch {
            // Error is handled by auth context
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-3">Login</h1>
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
                            placeholder="Password"
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
                    <Button className="w-full" size="xl" type="submit" disabled={isLoading} data-testid="login-button">
                        {isLoading ? 'Logging in...' : 'Enter'}
                    </Button>
                </form>
                <LinkButton href="/registration" data-testid="register-link">Registration</LinkButton>
            </div>
        </div>
    );
}
