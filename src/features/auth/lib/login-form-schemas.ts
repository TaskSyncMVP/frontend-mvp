import {z} from "zod";

export const loginFormSchema = z.object({
    email: z.string().email().max(128),
    password: z.string().min(6).max(128)
});

export type LoginFormSchemas = z.infer<typeof loginFormSchema>