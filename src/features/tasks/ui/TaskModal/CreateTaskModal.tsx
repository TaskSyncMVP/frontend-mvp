'use client';

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@shared/ui";
import { TaskForm } from "../TaskForm";
import { Plus } from "lucide-react";
import { CreateTaskModalProps } from "@features/tasks/lib";
import { useCreateTask, CreateTaskDto } from "@/entities/task";

export function CreateTaskModal({
    isOpen, 
    onClose, 
    onSubmit, 
    variant = 'primary'
}: CreateTaskModalProps = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isControlled = isOpen !== undefined && onClose !== undefined;
    const createTaskMutation = useCreateTask();

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        }
    };

    const handleFormSubmit = async (data: { name: string; priority: 'low' | 'medium' | 'high' }, targetDate?: string) => {
        setIsSubmitting(true);
        try {
            let taskName = data.name;
            
            if (targetDate) {
                const today = new Date().toISOString().split('T')[0];
                if (targetDate !== today) {
                    taskName = `[${targetDate}] ${data.name}`;
                }
            }
            
            const taskData: CreateTaskDto = {
                name: taskName,
                priority: data.priority,
            };
            
            await createTaskMutation.mutateAsync(taskData);
            handleClose();
            onSubmit?.();
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const trigger = !isControlled ? (
        <DialogTrigger asChild>
            <Button 
                size="sm" 
                className="bg-primary-100 text-white hover:bg-primary-200 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2"
            >
                <Plus size={16} />
                Create Task
            </Button>
        </DialogTrigger>
    ) : null;

    return (
        <Dialog open={isControlled ? isOpen : undefined} onOpenChange={isControlled ? onClose : undefined}>
            {trigger}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                    onSubmit={handleFormSubmit}
                    variant={variant}
                    className="pt-4 pb-2"
                    disabled={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}