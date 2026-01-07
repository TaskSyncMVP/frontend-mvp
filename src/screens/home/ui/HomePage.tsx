'use client';

import {TaskList} from '@features/tasks';
import {Statistics} from '@features/dashboard';
import {Avatar, AvatarFallback} from "@shared/ui";
import {useAuth} from "@features/auth";
import {DAYS_DATA} from "@shared/constants";

export function HomePage() {
    const { user } = useAuth();

    const firstDayTasks = DAYS_DATA[0]?.tasks || [];

    const totalTasks = DAYS_DATA.reduce((total, day) => total + day.tasks.length, 0);

    const statisticsData = {
        totalTasks: totalTasks,
        completedTasks: 18,
        todayTasks: firstDayTasks.length,
        weekTasks: 12,
    };


    const sanitizeText = (text?: string) => {
        if (!text) return '';
        return text.replace(/[<>]/g, '');
    };

    const getInitials = (name?: string) => {
        const sanitizedName = sanitizeText(name);
        if (!sanitizedName) return 'U';
        return sanitizedName.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="flex flex-row gap-4 lg:absolute lg:left-15 lg:top-12">
                <Avatar className="h-[46px] w-[46px]">
                    <AvatarFallback>{getInitials(user?.name || user?.email)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h3 className="font-regular text-sm">Hello!</h3>
                    <h3 className="font-semibold text-base">
                        {sanitizeText(user?.name) || sanitizeText(user?.email) || 'User'}
                    </h3>
                </div>
            </div>
            <div
                className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4 xl:gap-6 2xl:gap-8 lg:mt-12">
                <div className="lg:self-start lg:justify-self-start">
                    <h2 className="font-semibold text-base lg:text-xl pb-2">Statistics</h2>
                    <Statistics data={statisticsData} isLoading={false}/>
                </div>
                <div className="lg:max-w-sm lg:w-full lg:justify-self-center">
                    <h1 className="text-base lg:text-xl font-semibold mb-4">Today&apos;s Tasks</h1>
                    <TaskList tasks={firstDayTasks} className="md:columns-2"/>
                </div>
            </div>
        </div>
    );
}