import {z} from "zod";

export const loginFormSchema = z.object({
    email: z.string().email().min(8).max(128),
    password: z.string().max(128)
});

export type LoginFormSchemas = z.infer<typeof loginFormSchema>