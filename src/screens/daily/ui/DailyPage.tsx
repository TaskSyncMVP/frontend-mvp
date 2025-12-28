import {PageHeader} from "@/widgets";
import {Button} from "@/shared/ui";
import {TaskList} from "@features/tasks";
import {DayCard} from "./DayCard";

export function DailyPage() {
    return (
        <>
            <PageHeader title="Today’s Tasks"/>
            <div className="flex flex-col gap-7">
                <div className="-mx-4 flex flex-row justify-center">
                    <div className="flex gap-3 overflow-x-auto">
                        <DayCard month="Dec" day={25} weekday="Wed"/>
                        <DayCard month="Dec" day={26} weekday="Thu"/>
                        <DayCard month="Dec" day={27} weekday="Fri" isActive={true}/>
                        <DayCard month="Dec" day={28} weekday="Sat"/>
                        <DayCard month="Dec" day={29} weekday="Sun"/>
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
