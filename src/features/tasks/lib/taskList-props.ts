import {TaskCardProps} from "@features/tasks";

export interface TaskListProps {
    tasks?: TaskCardProps[];
    onTaskToggle?: (taskId: string, checked: boolean) => void;
    getTaskKey?: (task: TaskCardProps, index: number) => string | number;
    emptyStateMessage?: string;
    className?: string;
}
