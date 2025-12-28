import {z} from "zod";

export const createTaskSchema = z.object({
    name: z.string().min(1, "Task name is required").max(100, "Task name too long"),
    level: z.enum(["low", "medium", "high"]),
});

export type CreateTaskForm = z.infer<typeof createTaskSchema>;
