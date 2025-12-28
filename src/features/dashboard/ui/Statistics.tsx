import { StatisticCard } from './StatisticCard';
import {StatisticsProps} from "@features/dashboard/lib/statistics-props";

export function Statistics({ data, isLoading = false }: StatisticsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Нет данных для отображения</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-5">
            <StatisticCard className="bg-white">
                <h3 className="text-sm font-regular text-text-main">Total</h3>
                <p className="text-xl font-semibold text-text-main">{data.totalTasks}</p>
            </StatisticCard>
            <StatisticCard className="bg-primary-100">
                <h3 className="text-sm font-regular text-white">Completed tasks</h3>
                <p className="text-xl font-semibold text-white">{data.completedTasks}</p>
            </StatisticCard>
            <StatisticCard className="bg-primary-100">
                <h3 className="text-sm font-regular text-white">Today tasks</h3>
                <p className="text-xl font-semibold text-white">{data.todayTasks}</p>
            </StatisticCard>
            <StatisticCard className="bg-white">
                <h3 className="text-sm font-regular text-text-main">Week tasks</h3>
                <p className="text-xl font-semibold text-text-main">{data.weekTasks}</p>
            </StatisticCard>
        </div>
    );
}
