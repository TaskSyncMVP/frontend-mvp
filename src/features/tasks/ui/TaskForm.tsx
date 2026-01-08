"use client"

import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cva, type VariantProps} from "class-variance-authority";
import {CreateTaskForm, createTaskSchema} from "@features/tasks/lib";
import {Button, Input, Badge, Label} from "@shared/ui";
import {Check, X} from "lucide-react";

const taskFormVariants = cva(
    "grid gap-4 p-4 rounded-lg",
    {
        variants: {
            variant: {
                default: "bg-white",
                primary: "bg-primary-100 text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const labelVariants = cva("", {
    variants: {
        variant: {
            default: "",
            primary: "text-white",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

const inputVariants = cva("", {
    variants: {
        variant: {
            default: "",
            primary: "bg-white text-black",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

const cancelButtonVariants = cva("h-6 w-6 p-0", {
    variants: {
        variant: {
            default: "",
            primary: "text-white hover:text-white hover:bg-white/10",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

const submitButtonVariants = cva("flex justify-center", {
    variants: {
        variant: {
            default: "",
            primary: "bg-secondary text-secondary-foreground hover:shadow-largeDrop",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

export type TaskFormVariant = VariantProps<typeof taskFormVariants>["variant"];

export interface TaskFormProps {
    onSubmit: (data: CreateTaskForm, targetDate?: string) => void | Promise<void>;
    onCancel?: () => void;
    variant?: TaskFormVariant;
    showHeader?: boolean;
    className?: string;
    disabled?: boolean;
    targetDate?: string;
}

export function TaskForm({ 
    onSubmit, 
    onCancel, 
    variant = 'default', 
    showHeader = false, 
    className = "",
    disabled = false,
    targetDate
}: TaskFormProps) {
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
            priority: "medium",
        },
    });

    const handleFormSubmit = async (data: CreateTaskForm) => {
        setIsSubmitting(true);
        try {
            await Promise.resolve(onSubmit(data, targetDate));
            reset();
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabled = disabled || isSubmitting;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={taskFormVariants({ variant, className })}>
            {showHeader && (
                <div className="flex justify-between items-center mb-2">
                    <h4 className={`text-base font-medium ${labelVariants({ variant })}`}>New Task</h4>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className={cancelButtonVariants({ variant })}
                            disabled={isDisabled}
                        >
                            <X size={14} />
                        </Button>
                    )}
                </div>
            )}
            <div className="flex gap-3 pb-2 flex-col">
                <Label className={labelVariants({ variant })}>Name</Label>
                <Input
                    {...register("name")}
                    placeholder="Enter task name"
                    className={inputVariants({ variant })}
                    disabled={isDisabled}
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>
            <div className="grid grid-cols-1 gap-2">
                <Label className={labelVariants({ variant })}>Priority</Label>
                <Controller
                    name="priority"
                    control={control}
                    render={({field}) => (
                        <div className='inline-flex gap-3'>
                            <Badge
                                variant="high"
                                className={`cursor-pointer transition-all duration-200 ${
                                    field.value === 'high' 
                                        ? variant === 'primary' 
                                            ? 'ring-2 ring-white shadow-lg' 
                                            : 'ring-2 ring-primary-100 shadow-lg'
                                        : 'opacity-70 hover:opacity-100'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isDisabled && field.onChange('high')}
                            >
                                High
                            </Badge>
                            <Badge
                                variant="medium"
                                className={`cursor-pointer transition-all duration-200 ${
                                    field.value === 'medium' 
                                        ? variant === 'primary' 
                                            ? 'ring-2 ring-white shadow-lg' 
                                            : 'ring-2 ring-primary-100 shadow-lg'
                                        : 'opacity-70 hover:opacity-100'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isDisabled && field.onChange('medium')}
                            >
                                Medium
                            </Badge>
                            <Badge
                                variant="low"
                                className={`cursor-pointer transition-all duration-200 ${
                                    field.value === 'low' 
                                        ? variant === 'primary' 
                                            ? 'ring-2 ring-white shadow-lg' 
                                            : 'ring-2 ring-primary-100 shadow-lg'
                                        : 'opacity-70 hover:opacity-100'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isDisabled && field.onChange('low')}
                            >
                                Low
                            </Badge>
                        </div>
                    )}
                />
                {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority.message}</p>
                )}
            </div>
            <div className={`flex justify-center gap-2 ${variant === "default" ? "pt-12" : '' }`}>
                <Button
                    type="submit"
                    size='lg'
                    variant={variant === 'primary' ? 'secondary' : 'default'}
                    className={submitButtonVariants({ variant })}
                    disabled={isDisabled}
                >
                    <Check />
                </Button>
            </div>
        </form>
    );
}
