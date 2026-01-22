import {z} from "zod";

export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Task name is required")
        .max(100, "Task name too long"),
    priority: taskPrioritySchema,
});

export const updateTaskSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Task name is required")
        .max(100, "Task name too long")
        .optional(),
    isCompleted: z.boolean().optional(),
    priority: taskPrioritySchema.optional(),
});

export type CreateTaskForm = z.infer<typeof createTaskSchema>;
export type UpdateTaskForm = z.infer<typeof updateTaskSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
