'use client';

import { TaskCard, DeleteAllTasksButton } from '@features/tasks';
import { Statistics } from '@features/dashboard';
import { Avatar, AvatarFallback } from '@shared/ui';
import { useAuth } from '@features/auth';
import { useTasks } from '@/entities/task';
import { getTodayTasks, getWeekTasks } from '@shared/lib/date-utils';
import { HomePageSkeleton } from '@/screens/home/ui/HomePageSkeleton';

export function HomePage() {
    const { user, isLoading: authLoading } = useAuth();
    const { data: tasks = [], isLoading: tasksLoading } = useTasks();

    if (authLoading || tasksLoading) {
        return <HomePageSkeleton />;
    }

    const todayTasks = getTodayTasks(tasks);
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const weekTasks = getWeekTasks(tasks).length;

    const statisticsData = {
        totalTasks: tasks.length,
        completedTasks,
        todayTasks: todayTasks.length,
        weekTasks,
    };

    const sanitizeText = (text?: string) =>
        text ? text.replace(/[<>]/g, '') : '';

    const getInitials = (name?: string) => {
        const sanitized = sanitizeText(name);
        return sanitized
            ? sanitized.split(' ').map(n => n[0]).join('').toUpperCase()
            : 'U';
    };

    return (
        <div className="min-h-screen flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="flex flex-row gap-4 lg:absolute lg:left-15 lg:top-12">
                <Avatar className="h-[46px] w-[46px]">
                    <AvatarFallback>
                        {getInitials(user?.name || user?.email)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <h3 className="font-regular text-sm">Hello!</h3>
                    <h3 className="font-semibold text-base">
                        {sanitizeText(user?.name) ||
                            sanitizeText(user?.email) ||
                            'User'}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6 2xl:gap-8 lg:mt-12">
                <div className="lg:self-start">
                    <h2 className="font-semibold text-base lg:text-xl pb-2">
                        Statistics
                    </h2>
                    <Statistics data={statisticsData} />
                </div>

                <div className="lg:max-w-sm lg:w-full lg:justify-self-center">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-base lg:text-xl font-semibold">
                            Today&apos;s Tasks
                        </h1>
                        <DeleteAllTasksButton />
                    </div>

                    <div className="flex flex-col gap-4 md:columns-2">
                        {todayTasks.length > 0 ? (
                            todayTasks.map(task => (
                                <TaskCard key={task.id} {...task} />
                            ))
                        ) : (
                            <div className="text-muted-foreground text-sm">
                                No tasks for today
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}