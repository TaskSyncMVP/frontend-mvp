'use client';

import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Button, Input, Badge, Label,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@shared/ui";

import {Check, Plus} from "lucide-react";
import {CreateTaskModalProps, CreateTaskForm, createTaskSchema} from "@features/tasks/lib";

export function CreateTaskModal({isOpen, onClose, onSubmit}: CreateTaskModalProps = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isControlled = isOpen !== undefined && onClose !== undefined;

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
    } = useForm<CreateTaskForm>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            name: "",
            level: "medium",
        },
    });

    const handleClose = () => {
        reset();
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
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-12 pt-4 pb-2">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-3 flex-col">
                            <Label>Name</Label>
                            <Input
                                {...register("name")}
                                placeholder="Enter task name"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label>Priority</Label>
                            <Controller
                                name="level"
                                control={control}
                                render={({field}) => (
                                    <div className='inline-flex gap-3'>
                                        <Badge
                                            variant="high"
                                            className={`cursor-pointer ${field.value === 'high' ? 'ring-2 ring-primary' : ''}`}
                                            onClick={() => field.onChange('high')}
                                        >
                                            High
                                        </Badge>
                                        <Badge
                                            variant="medium"
                                            className={`cursor-pointer ${field.value === 'medium' ? 'ring-2 ring-primary' : ''}`}
                                            onClick={() => field.onChange('medium')}
                                        >
                                            Medium
                                        </Badge>
                                        <Badge
                                            variant="low"
                                            className={`cursor-pointer ${field.value === 'low' ? 'ring-2 ring-primary' : ''}`}
                                            onClick={() => field.onChange('low')}
                                        >
                                            Low
                                        </Badge>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" size='lg' className="flex justify-center" disabled={isSubmitting}>
                            <Check />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
