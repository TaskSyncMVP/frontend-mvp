
import {TaskLevel} from "@shared/lib/types";

export interface TaskCardProps {
    id: string;
    title: string;
    status: string;
    level?: TaskLevel;
    isCompleted?: boolean;
    createdAt?: string;
    onToggle?: (checked: boolean) => void;
}
