'use client'
import {useState} from "react";
import {PageHeader} from "@/widgets";
import {TaskCard, TaskForm} from "@features/tasks";
import {Button} from "@shared/ui";
import {DAYS_DATA} from "@shared/constants";


export function TasksPage() {
    const [showFormForDay, setShowFormForDay] = useState<string | null>(null);

    const handleAddTask = (dayDate: string) => {
        setShowFormForDay(dayDate);
    };

    const handleCancelForm = () => {
        setShowFormForDay(null);
    };

    const handleCreateTask = () => {
        setShowFormForDay(null);
    };

    return (
        <>
            <PageHeader title="Tasks"/>
            <div className="overflow-x-auto pb-4 pt-16 -mx-8">
                <div className="flex gap-6 p-4 min-w-max -ml-2">
                    {DAYS_DATA.map((day) => (
                        <div key={day.date} className="flex flex-col gap-4 w-80">
                            <h3 className="text-base font-regular text-start">
                                {day.day} {day.month}
                            </h3>
                            <div className="flex flex-col gap-5">
                                {day.tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        {...task}
                                    />
                                ))}
                                <Button
                                    className="w-full mt-2 flex items-center gap-2"
                                    onClick={() => handleAddTask(day.date)}
                                >
                                    Create task
                                </Button>
                                {showFormForDay === day.date && (
                                    <TaskForm
                                        onSubmit={handleCreateTask}
                                        onCancel={handleCancelForm}
                                        variant="primary"
                                        showHeader={true}
                                        className="mt-4"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}