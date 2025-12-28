import {z} from "zod";

export const registerFormSchema = z.object({
    email: z.string().email().min(8).max(128),
    password: z.string().max(128)
})

export type RegisterFormSchemas = z.infer<typeof registerFormSchema>