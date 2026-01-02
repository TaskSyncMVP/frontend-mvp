"use client"

import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateTaskForm, createTaskSchema} from "@features/tasks/lib";
import {Button, Input, Badge, Label} from "@shared/ui";
import {Check, X} from "lucide-react";

export type TaskFormVariant = 'default' | 'primary';

export interface TaskFormProps {
    onSubmit: (data: CreateTaskForm) => void;
    onCancel?: () => void;
    variant?: TaskFormVariant;
    showHeader?: boolean;
    className?: string;
}

export function TaskForm({ onSubmit, onCancel, variant = 'default', showHeader = false, className = "" }: TaskFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleFormSubmit = async (data: CreateTaskForm) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            reset();
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPrimary = variant === 'primary';
    const textColor = isPrimary ? 'text-white' : '';
    const buttonVariant = isPrimary ? 'secondary' : 'default';

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={`grid gap-4 p-4 rounded-lg ${isPrimary ? 'bg-primary-100 ' : 'bg-white'} ${className}`}>
            {showHeader && (
                <div className="flex justify-between items-center mb-2">
                    <h4 className={`text-base font-medium ${isPrimary ? 'text-white' : ''}`}>New Task</h4>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className={`h-6 w-6 p-0 ${isPrimary ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
                        >
                            <X size={14} />
                        </Button>
                    )}
                </div>
            )}
            <div className="flex gap-3 flex-col">
                <Label className={textColor}>Name</Label>
                <Input
                    {...register("name")}
                    placeholder="Enter task name"
                    className={isPrimary ? 'bg-white text-black ' : ''}
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>
            <div className="grid grid-cols-1 gap-2">
                <Label className={textColor}>Priority</Label>
                <Controller
                    name="level"
                    control={control}
                    render={({field}) => (
                        <div className='inline-flex gap-3'>
                            <Badge
                                variant="high"
                                className={`cursor-pointer ${field.value === 'high' ? 'ring-2 ring-white' : ''}`}
                                onClick={() => field.onChange('high')}
                            >
                                High
                            </Badge>
                            <Badge
                                variant="medium"
                                className={`cursor-pointer ${field.value === 'medium' ? 'ring-2 ring-white' : ''}`}
                                onClick={() => field.onChange('medium')}
                            >
                                Medium
                            </Badge>
                            <Badge
                                variant="low"
                                className={`cursor-pointer ${field.value === 'low' ? 'ring-2 ring-white' : ''}`}
                                onClick={() => field.onChange('low')}
                            >
                                Low
                            </Badge>
                        </div>
                    )}
                />
            </div>
            <div className="flex justify-center gap-2">
                <Button
                    type="submit"
                    size='lg'
                    variant={buttonVariant}
                    className="flex justify-center"
                    disabled={isSubmitting}
                >
                    <Check />
                </Button>
            </div>
        </form>
    );
}
