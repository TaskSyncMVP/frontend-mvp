import {CreateTaskForm} from "@features/tasks/lib/task-schemas";

export interface CreateTaskModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: CreateTaskForm) => void;
}
