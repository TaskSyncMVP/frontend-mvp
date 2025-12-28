'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, LinkButton, Input} from "@shared/ui";
import {loginFormSchema, LoginFormSchemas} from "../../lib/login-form-schemas";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormSchemas>({
        resolver: zodResolver(loginFormSchema),
    });

    const onSubmit = (data: LoginFormSchemas) => {
        console.log("Login data:", data);
        // TODO: Implement login logic
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
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                    <Button className="w-full" size="xl" type="submit">Enter</Button>
                </form>
                <LinkButton href="/registration">Registration</LinkButton>
            </div>
        </div>
    );
}
