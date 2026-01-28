import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { TaskCardProps } from '@features/tasks/lib/taskCard-props';

interface DraggableTaskCardProps extends TaskCardProps {
    isDragging?: boolean;
}

export function DraggableTaskCard(props: DraggableTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props.id,
        data: {
            type: 'task',
            task: props,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.3 : 1,
        scale: isDragging ? 0.95 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                cursor-grab active:cursor-grabbing 
                transition-all duration-200 ease-in-out
                hover:scale-105 hover:shadow-lg hover:-translate-y-1
                ${isDragging ? 'z-50 rotate-2 shadow-2xl' : 'hover:rotate-1'}
            `}
        >
            <TaskCard {...props} />
        </div>
    );
}