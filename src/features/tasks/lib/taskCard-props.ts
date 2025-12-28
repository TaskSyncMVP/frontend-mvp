export type TaskLevel = "low" | "medium" | "high";

export interface TaskCardProps {
    title: string;
    status: string;
    level?: TaskLevel;
    isCompleted?: boolean;
    onToggle?: (checked: boolean) => void;
}
