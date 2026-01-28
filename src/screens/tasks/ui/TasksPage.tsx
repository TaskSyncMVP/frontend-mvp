'use client'
import {useState} from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {PageHeader} from "@/widgets";
import {TaskCard, DeleteAllTasksButton} from "@features/tasks";
import {useCreateTask, useTasks, CreateTaskDto, useMoveTask} from "@/entities/task";
import {generateDaysWithTasks, TaskWithLevel} from "@shared/lib/date-utils";
import {useAuth} from "@features/auth";
import {TasksPageSkeleton} from "./TasksPageSkeleton";
import {AnimatedDroppableDay} from "@features/tasks/ui/DroppableDay/AnimatedDroppableDay";

export function TasksPage() {
    const [showFormForDay, setShowFormForDay] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<TaskWithLevel | null>(null);
    
    const createTaskMutation = useCreateTask();
    const moveTaskMutation = useMoveTask();
    const { data: tasks = [], isLoading: tasksLoading } = useTasks();
    const { isLoading: authLoading } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const daysData = generateDaysWithTasks(tasks);

    if (authLoading || tasksLoading) {
        return (
            <>
                <PageHeader title="Tasks"/>
                <TasksPageSkeleton />
            </>
        );
    }

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

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'task') {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeTask = active.data.current?.task;
        const overData = over.data.current;

        if (!activeTask || !overData) {
            setActiveTask(null);
            return;
        }

        // Если перетаскиваем на другой день
        if (overData.type === 'day') {
            const targetDate = overData.date;
            
            try {
                await moveTaskMutation.mutateAsync({
                    id: activeTask.id,
                    targetDate: targetDate
                });
            } catch (error) {
                console.error('Failed to move task:', error);
            }
        }

        setActiveTask(null);
    };

    return (
        <>
            <PageHeader title="Tasks"/>
            <div className="flex flex-col pt-16 gap-6">
                <div className="overflow-x-auto pb-4 -mx-8">
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-6 p-4 min-w-max -ml-2">
                            {daysData.map((day) => (
                                <AnimatedDroppableDay
                                    key={day.date}
                                    day={day}
                                    showFormForDay={showFormForDay}
                                    onAddTask={handleAddTask}
                                    onCreateTask={handleCreateTask}
                                    onCancelForm={handleCancelForm}
                                    isCreating={createTaskMutation.isPending}
                                    showDeleteButton={day.date === daysData[0]?.date}
                                    deleteButton={<DeleteAllTasksButton />}
                                />
                            ))}
                        </div>
                        
                        <DragOverlay>
                            {activeTask ? (
                                <div className="transform rotate-6 scale-110 opacity-95 drag-glow animate-pulse">
                                    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 rounded-xl shadow-2xl ring-4 ring-blue-200 ring-opacity-60">
                                        <div className="bg-white rounded-lg shadow-inner">
                                            <TaskCard
                                                id={activeTask.id}
                                                title={activeTask.title}
                                                status={activeTask.status}
                                                level={activeTask.level}
                                                isCompleted={activeTask.isCompleted}
                                                createdAt={activeTask.createdAt}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </>
    )
}