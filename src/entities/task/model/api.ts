import apiClient from '@shared/api/client';
import { Task, CreateTaskDto, UpdateTaskDto } from './types';

export const taskApi = {
    getTasks: async (): Promise<Task[]> => {
        const response = await apiClient.get('/user/tasks');
        return response.data;
    },

    createTask: async (data: CreateTaskDto): Promise<Task> => {
        const response = await apiClient.post('/user/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
        const response = await apiClient.put(`/user/tasks/${id}`, data);
        return response.data;
    },

    moveTaskToDate: async (id: string, targetDate: string): Promise<Task> => {
        const response = await apiClient.put(`/user/tasks/${id}/move`, { targetDate });
        return response.data;
    },

    deleteTask: async (id: string): Promise<Task> => {
        const response = await apiClient.delete(`/user/tasks/${id}`);
        return response.data;
    },

    // временное решение
    deleteAllTasks: async (): Promise<void> => {
        const tasks = await taskApi.getTasks();
        const deletePromises = tasks.map(task => taskApi.deleteTask(task.id));
        await Promise.all(deletePromises);
    },
};