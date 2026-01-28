import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableTaskCard } from '../TaskCard/DraggableTaskCard';
import { Button } from '@shared/ui';
import { TaskForm } from '../TaskForm';
import { DayData } from '@shared/lib/date-utils';

interface DroppableDayProps {
    day: DayData;
    showFormForDay: string | null;
    onAddTask: (dayDate: string) => void;
    onCreateTask: (data: { name: string; priority: 'low' | 'medium' | 'high' }, targetDate?: string) => Promise<void>;
    onCancelForm: () => void;
    isCreating: boolean;
    showDeleteButton?: boolean;
    deleteButton?: React.ReactNode;
}

export function DroppableDay({
    day,
    showFormForDay,
    onAddTask,
    onCreateTask,
    onCancelForm,
    isCreating,
    showDeleteButton,
    deleteButton
}: DroppableDayProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: day.date,
        data: {
            type: 'day',
            date: day.date,
        },
    });

    const taskIds = day.tasks.map(task => task.id);

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
                className={`
                    flex flex-col gap-5 min-h-[100px] p-2 rounded-lg 
                    transition-all duration-300 ease-in-out
                    ${isOver 
                        ? 'bg-gradient-to-br from-primary-5 to-primary-10 border-2 border-dashed border-primary-30 scale-105 shadow-lg transform' 
                        : 'hover:bg-gray-50 hover:shadow-sm'
                    }
                `}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {day.tasks.map((task) => (
                        <DraggableTaskCard
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
                    className="w-full mt-2 flex items-center gap-2"
                    onClick={() => onAddTask(day.date)}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create task'}
                </Button>
                
                {showFormForDay === day.date && (
                    <TaskForm
                        onSubmit={(data) => onCreateTask(data, day.date)}
                        onCancel={onCancelForm}
                        variant="primary"
                        showHeader={true}
                        className="mt-4"
                        disabled={isCreating}
                        targetDate={day.date}
                    />
                )}
            </div>
        </div>
    );
}