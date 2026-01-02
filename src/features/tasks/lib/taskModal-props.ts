import {CreateTaskForm} from "@features/tasks/lib/task-schemas";
import {TaskFormVariant} from "@shared/ui";

export interface CreateTaskModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: CreateTaskForm) => void;
    variant?: TaskFormVariant;
}
