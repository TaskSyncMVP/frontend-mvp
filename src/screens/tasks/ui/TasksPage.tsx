'use client'
import {useState} from "react";
import {PageHeader} from "@/widgets";
import {TaskCard, TaskForm, DeleteAllTasksButton} from "@features/tasks";
import {Button} from "@shared/ui";
import {useCreateTask, useTasks, CreateTaskDto} from "@/entities/task";
import {generateDaysWithTasks} from "@shared/lib/date-utils";

export function TasksPage() {
    const [showFormForDay, setShowFormForDay] = useState<string | null>(null);
    const createTaskMutation = useCreateTask();
    const { data: tasks = [], isLoading } = useTasks();

    const daysData = generateDaysWithTasks(tasks);

    const handleAddTask = (dayDate: string) => {
        setShowFormForDay(dayDate);
    };

    const handleCancelForm = () => {
        setShowFormForDay(null);
    };

    const handleCreateTask = async (data: { name: string; priority: 'low' | 'medium' | 'high' }, targetDate?: string) => {
        try {
            let taskName = data.name;
            
            if (targetDate) {
                const today = new Date().toISOString().split('T')[0];
                if (targetDate !== today) {
                    taskName = `[${targetDate}] ${data.name}`;
                }
            }
            
            const taskData: CreateTaskDto = {
                name: taskName,
                priority: data.priority,
            };
            
            await createTaskMutation.mutateAsync(taskData);
            setShowFormForDay(null);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <PageHeader title="Tasks"/>
                <div className="flex justify-center items-center h-64">
                    <div className="text-muted-foreground">Loading tasks...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Tasks"/>
            <div className="flex flex-col pt-16 gap-6">
                <div className="overflow-x-auto pb-4 -mx-8">
                    <div className="flex gap-6 p-4 min-w-max -ml-2">
                        {daysData.map((day) => (
                            <div key={day.date} className="flex flex-col gap-4 w-80">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-regular text-start">
                                        {day.day} {day.month}
                                    </h3>
                                    {day.date === daysData[0]?.date && (
                                        <DeleteAllTasksButton />
                                    )}
                                </div>
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
                                        disabled={createTaskMutation.isPending}
                                    >
                                        {createTaskMutation.isPending ? 'Creating...' : 'Create task'}
                                    </Button>
                                    {showFormForDay === day.date && (
                                        <TaskForm
                                            onSubmit={(data) => handleCreateTask(data, day.date)}
                                            onCancel={handleCancelForm}
                                            variant="primary"
                                            showHeader={true}
                                            className="mt-4"
                                            disabled={createTaskMutation.isPending}
                                            targetDate={day.date}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}