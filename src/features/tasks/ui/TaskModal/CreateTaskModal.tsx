'use client';

import {useState} from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@shared/ui";
import {TaskForm} from "../TaskForm";

import {Plus} from "lucide-react";
import {CreateTaskModalProps, CreateTaskForm} from "@features/tasks/lib";

export function CreateTaskModal({isOpen, onClose, onSubmit, variant = 'primary'}: CreateTaskModalProps = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isControlled = isOpen !== undefined && onClose !== undefined;

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        }
    };

    const handleFormSubmit = async (data: CreateTaskForm) => {
        if (!onSubmit) return;

        setIsSubmitting(true);
        try {
            await onSubmit(data);
            handleClose();
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const trigger = !isControlled ? (
        <DialogTrigger asChild>
            <Button size="sm" className="bg-primary-100 text-white hover:bg-primary-200 px-4 py-2
            rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <span className="mr-2">
                    <Plus/>
                </span>
                Создать задачу
            </Button>
        </DialogTrigger>
    ) : null;

    return (
        <Dialog open={isControlled ? isOpen : undefined} onOpenChange={isControlled ? onClose : undefined}>
            {trigger}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                    onSubmit={handleFormSubmit}
                    variant={variant}
                    className="pt-4 pb-2"
                />
            </DialogContent>
        </Dialog>
    );
}
