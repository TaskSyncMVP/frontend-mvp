export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskDto {
    name: string;
    isCompleted?: boolean;
    createdAt?: string;
    priority: TaskPriority;
}

export interface Task {
    id: string;
    name: string;
    priority: TaskPriority;
    isCompleted: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    name: string;
    priority: TaskPriority;
}

export interface UpdateTaskDto {
    name?: string;
    isCompleted?: boolean;
    priority?: TaskPriority;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
