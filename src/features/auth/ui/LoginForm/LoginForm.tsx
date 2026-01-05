'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, LinkButton, Input} from "@shared/ui";
import {loginFormSchema, LoginFormSchemas} from "../../lib/login-form-schemas";
import {useAuth} from "../../lib/auth-context";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

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
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/home';
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectTo);
        } catch (err) {
            console.error('Login failed:', err);
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
                            type="email"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex gap-3 flex-col">
                        <Input
                            {...register("password")}
                            placeholder="Password"
                            type="password"
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                    {error && (
                        <p className="text-sm text-destructive text-center">{error}</p>
                    )}
                    <Button className="w-full" size="xl" type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Enter'}
                    </Button>
                </form>
                <LinkButton href="/registration">Registration</LinkButton>
            </div>
        </div>
    );
}
