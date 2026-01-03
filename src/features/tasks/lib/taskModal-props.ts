import {CreateTaskForm} from "@features/tasks/lib/task-schemas";
import {TaskFormVariant} from "@features/tasks/ui/TaskForm";

export interface CreateTaskModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: CreateTaskForm) => void;
    variant?: TaskFormVariant;
}
