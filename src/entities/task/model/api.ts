import apiClient from '@shared/api/client';

interface CreateTaskData {
    name: string;
    level: 'low' | 'medium' | 'high';
    date?: string;
}

interface UpdateTaskData {
    name?: string;
    level?: 'low' | 'medium' | 'high';
    isCompleted?: boolean;
    status?: string;
}

export const taskApi = {
    getTasks: async () => {
        const response = await apiClient.get('/user/tasks');
        return response.data;
    },
    createTask: async (data: CreateTaskData) => {
        const response = await apiClient.post('/user/tasks', data);
        return response.data;
    },
    updateTask: async (id: string, data: UpdateTaskData) => {
        const response = await apiClient.put(`/user/tasks/${id}`, data);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await apiClient.delete(`/user/tasks/${id}`);
        return response.data;
    },
};