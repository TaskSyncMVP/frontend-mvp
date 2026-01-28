import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { TaskCardProps } from '@features/tasks/lib/taskCard-props';
import { useState, useEffect } from 'react';

interface AnimatedDraggableTaskCardProps extends TaskCardProps {
    isDragging?: boolean;
}

export function AnimatedDraggableTaskCard(props: AnimatedDraggableTaskCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [justDropped, setJustDropped] = useState(false);
    
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

    // Эффект для анимации после успешного drop
    useEffect(() => {
        if (!isDragging && justDropped) {
            const timer = setTimeout(() => setJustDropped(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isDragging, justDropped]);

    useEffect(() => {
        if (!isDragging && transform) {
            setJustDropped(true);
        }
    }, [isDragging, transform]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition || 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isDragging ? 0.2 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const getCardClasses = () => {
        let classes = 'drag-item cursor-grab active:cursor-grabbing';
        
        if (isDragging) {
            classes += ' dragging drag-glow';
        } else if (isHovered) {
            classes += ' hover:scale-105 hover:shadow-lg hover:-translate-y-1 hover:rotate-1';
        }
        
        if (justDropped) {
            classes += ' drop-success';
        }
        
        return classes;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={getCardClasses()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={isDragging ? 'drag-float' : ''}>
                <TaskCard {...props} />
            </div>
        </div>
    );
}