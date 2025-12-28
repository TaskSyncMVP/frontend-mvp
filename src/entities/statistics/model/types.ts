export interface Statistics {
    totalTasks: number;
    completedTasks: number;
    productivity: number;
    monthlyGoals: {
        completed: number;
        total: number;
    };
}

export interface StatisticsFilters {
    period: 'week' | 'month' | 'year';
    userId?: string;
}










