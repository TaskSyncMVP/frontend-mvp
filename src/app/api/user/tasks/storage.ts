// Временное хранилище задач (в реальном проекте это будет база данных)
let tasks: any[] = [
    {
        id: '1',
        name: 'Sample task 1',
        priority: 'medium',
        isCompleted: false,
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: '[2024-01-29] Future task',
        priority: 'high',
        isCompleted: false,
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const getTasks = () => {
    return tasks;
};

export const setTasks = (newTasks: any[]) => {
    tasks = newTasks;
};

export const addTask = (task: any) => {
    tasks.push(task);
    return task;
};

export const updateTask = (id: string, updates: any) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return null;
    }
    
    const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    return updatedTask;
};

export const deleteTask = (id: string) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return null;
    }
    
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    return deletedTask;
};

export const findTask = (id: string) => {
    return tasks.find(task => task.id === id);
};