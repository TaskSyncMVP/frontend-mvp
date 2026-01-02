import {PageHeader} from "@/widgets";
import {Button} from "@/shared/ui";
import {TaskList} from "@features/tasks";
import {DayCard} from "./DayCard";
import {DAYS_DATA} from "@shared/constants";

export function DailyPage() {
    return (
        <>
            <PageHeader title="Today’s Tasks"/>
            <div className="flex flex-col gap-7">
                <div className="-mx-4 flex flex-row justify-center">
                    <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide snap-x snap-mandatory">
                        {DAYS_DATA.map((day, index) => (
                            <div key={day.date} className="snap-center shrink-0">
                                <DayCard
                                    month={day.month}
                                    day={day.day}
                                    weekday={day.weekday}
                                    isActive={index === 2}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <Button size="sm">All</Button>
                    <Button size="sm" variant="primary">High</Button>
                    <Button size="sm" variant="primary">Medium</Button>
                    <Button size="sm" variant="primary">Low</Button>
                </div>
                <TaskList/>
            </div>
        </>
    )
}
