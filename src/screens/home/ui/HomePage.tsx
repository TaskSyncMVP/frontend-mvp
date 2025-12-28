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
        <div className="min-h-screen flex flex-col gap-6">
            <div className="flex flex-row gap-4">
                <Avatar className="h-[46px] w-[46px]">
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h3 className="font-regular text-sm">Hello!</h3>
                    <h3 className="font-semibold text-base">Livia Vaccaro</h3>
                </div>
            </div>
            <div>
                <h2 className="font-semibold text-base pb-2">Statistics</h2>
                <Statistics data={statisticsData}/>
            </div>
            <div>
                <h1 className="text-base font-semibold mb-6">Today’s Tasks</h1>
                <TaskList/>
            </div>
        </div>
    );
}
