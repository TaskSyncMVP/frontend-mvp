import {TaskList} from '@features/tasks';
import {Statistics} from '@features/dashboard';
import {Avatar, AvatarFallback} from "@shared/ui";

export function HomePage() {
    const statisticsData = {
        totalTasks: 24,
        completedTasks: 18,
        todayTasks: 5,
        weekTasks: 12,
    };

    return (
        <div className="min-h-screen flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="flex flex-row gap-4 lg:absolute lg:left-15 lg:top-12">
                <Avatar className="h-[46px] w-[46px]">
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h3 className="font-regular text-sm">Hello!</h3>
                    <h3 className="font-semibold text-base">Livia Vaccaro</h3>
                </div>
            </div>
            <div
                className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4 xl:gap-6 2xl:gap-8 lg:mt-12">
                <div className="lg:self-start lg:justify-self-start">
                    <h2 className="font-semibold text-base lg:text-xl pb-2">Statistics</h2>
                    <Statistics data={statisticsData}/>
                </div>
                <div className="lg:col-start-2 lg:col-end-3 lg:self-center lg:justify-self-center">
                    <h1 className="text-base lg:text-xl font-semibold mb-4">Today’s Tasks</h1>
                    <TaskList className="md:columns-2"/>
                </div>
            </div>
        </div>
    );
}