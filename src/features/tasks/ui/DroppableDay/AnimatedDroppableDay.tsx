import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatedDraggableTaskCard } from '../TaskCard/AnimatedDraggableTaskCard';
import { Button } from '@shared/ui';
import { TaskForm } from '../TaskForm';
import { DayData } from '@shared/lib/date-utils';
import { useState, useEffect } from 'react';

interface AnimatedDroppableDayProps {
    day: DayData;
    showFormForDay: string | null;
    onAddTask: (dayDate: string) => void;
    onCreateTask: (data: { name: string; priority: 'low' | 'medium' | 'high' }, targetDate?: string) => Promise<void>;
    onCancelForm: () => void;
    isCreating: boolean;
    showDeleteButton?: boolean;
    deleteButton?: React.ReactNode;
}

export function AnimatedDroppableDay({
    day,
    showFormForDay,
    onAddTask,
    onCreateTask,
    onCancelForm,
    isCreating,
    showDeleteButton,
    deleteButton
}: AnimatedDroppableDayProps) {
    const [justReceived, setJustReceived] = useState(false);
    
    const { setNodeRef, isOver } = useDroppable({
        id: day.date,
        data: {
            type: 'day',
            date: day.date,
        },
    });

    // Анимация при получении новой задачи
    useEffect(() => {
        if (!isOver && justReceived) {
            const timer = setTimeout(() => setJustReceived(false), 600);
            return () => clearTimeout(timer);
        }
    }, [isOver, justReceived]);

    useEffect(() => {
        if (isOver) {
            setJustReceived(true);
        }
    }, [isOver]);

    const taskIds = day.tasks.map(task => task.id);

    const getDropZoneClasses = () => {
        let classes = 'drop-zone flex flex-col gap-5 min-h-[100px] p-2 rounded-lg transition-all duration-300 ease-in-out';
        
        if (isOver) {
            classes += ' active magnetic';
        } else if (justReceived) {
            classes += ' drop-success';
        } else {
            classes += ' hover:bg-gray-50 hover:shadow-sm';
        }
        
        return classes;
    };

    return (
        <div className="flex flex-col gap-4 w-80">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-regular text-start">
                    {day.day} {day.month}
                </h3>
                {showDeleteButton && deleteButton}
            </div>
            <div
                ref={setNodeRef}
                className={getDropZoneClasses()}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {day.tasks.map((task) => (
                        <AnimatedDraggableTaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            status={task.status}
                            level={task.level}
                            isCompleted={task.isCompleted}
                            createdAt={task.createdAt}
                        />
                    ))}
                </SortableContext>
                
                <Button
                    className="w-full mt-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    onClick={() => onAddTask(day.date)}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create task'}
                </Button>
                
                {showFormForDay === day.date && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <TaskForm
                            onSubmit={(data) => onCreateTask(data, day.date)}
                            onCancel={onCancelForm}
                            disabled={isCreating}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}