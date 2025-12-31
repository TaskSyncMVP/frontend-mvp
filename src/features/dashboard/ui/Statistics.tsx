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
            <StatisticCard
                variant="secondary"
                title="Total"
                value={data.totalTasks}
            />
            <StatisticCard
                variant="primary"
                title="Completed tasks"
                value={data.completedTasks}
            />
            <StatisticCard
                variant="primary"
                title="Today tasks"
                value={data.todayTasks}
            />
            <StatisticCard
                variant="secondary"
                title="Week tasks"
                value={data.weekTasks}
            />
        </div>
    );
}
