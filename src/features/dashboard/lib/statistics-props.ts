export interface StatisticsData {
    totalTasks: number;
    completedTasks: number;
    todayTasks: number;
    weekTasks: number;
}

export interface StatisticsProps {
    data?: StatisticsData;
    isLoading?: boolean;
}
