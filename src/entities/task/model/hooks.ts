import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from './api';
import { CreateTaskDto, UpdateTaskDto, Task } from './types';
import { toast } from 'sonner';
import { APP_CONSTANTS } from '@shared/constants/app';

export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useTasks = () => {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: taskApi.getTasks,
        staleTime: APP_CONSTANTS.CACHE_TIME.TASKS,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => taskApi.createTask(data),
        onSuccess: (newTask) => {
            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
                return old ? [...old, newTask] : [newTask];
            });
            
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            
            toast.success('Task created successfully!');
        },
        onError: (error) => {
            console.error('Failed to create task:', error);
            toast.error('Failed to create task. Please try again.');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) => 
            taskApi.updateTask(id, data),
        onSuccess: (updatedTask) => {
            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
                return old ? old.map(task => 
                    task.id === updatedTask.id ? updatedTask : task
                ) : [updatedTask];
            });
            
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
            
            toast.success('Task updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update task:', error);
            toast.error('Failed to update task. Please try again.');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => taskApi.deleteTask(id),
        onSuccess: (deletedTask) => {
            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
                return old ? old.filter(task => task.id !== deletedTask.id) : [];
            });
            
            queryClient.removeQueries({ queryKey: taskKeys.detail(deletedTask.id) });
            
            toast.success('Task deleted successfully!');
        },
        onError: (error) => {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task. Please try again.');
        },
    });
};

export const useDeleteAllTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => taskApi.deleteAllTasks(),
        onSuccess: () => {
            queryClient.setQueryData<Task[]>(taskKeys.lists(), []);
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            
            toast.success('All tasks deleted successfully!');
        },
        onError: (error) => {
            console.error('Failed to delete all tasks:', error);
            toast.error('Failed to delete all tasks. Please try again.');
        },
    });
};

export const useToggleTaskCompletion = () => {
    const updateTask = useUpdateTask();

    return useMutation({
        mutationFn: (task: Task) => 
            updateTask.mutateAsync({
                id: task.id,
                data: { isCompleted: !task.isCompleted }
            }),
        onError: (error) => {
            console.error('Failed to toggle task completion:', error);
            toast.error('Failed to update task status.');
        },
    });
};

export const useMoveTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, targetDate }: { id: string; targetDate: string }) => 
            taskApi.moveTaskToDate(id, targetDate),
        onSuccess: (updatedTask) => {
            queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
                return old ? old.map(task => 
                    task.id === updatedTask.id ? updatedTask : task
                ) : [updatedTask];
            });
            
            queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            
            toast.success('Task moved successfully!');
        },
        onError: (error) => {
            console.error('Failed to move task:', error);
            toast.error('Failed to move task. Please try again.');
        },
    });
};