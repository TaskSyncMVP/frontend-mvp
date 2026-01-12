import {z} from "zod";

export const settingsFormSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),

    password: z.string()
        .refine((val) => val === "" || val.length >= 6, {
            message: "Password must be at least 6 characters"
        })
        .refine((val) => val === "" || val.length <= 128, {
            message: "Password must be less than 128 characters"
        }),

    workInterval: z.number()
        .min(1, "Work interval must be at least 1 minute")
        .max(120, "Work interval must be less than 120 minutes")
        .optional(),

    intervalCount: z.number()
        .min(1, "Interval count must be at least 1")
        .max(10, "Interval count must be less than 10")
        .optional(),

    breakInterval: z.number()
        .min(1, "Break interval must be at least 1 minute")
        .max(60, "Break interval must be less than 60 minutes")
        .optional(),
});

export type SettingsFormSchemas = z.infer<typeof settingsFormSchema>;
