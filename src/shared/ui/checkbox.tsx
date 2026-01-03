"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import {Check} from "lucide-react"
import * as React from "react"

import {cn} from "@/lib/utils"
import {TaskLevel} from "@shared/lib/types"

export interface TaskCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    level?: TaskLevel
}

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "grid place-content-center peer h-6 w-6 shrink-0 rounded-soft focus-visible:outline-none" +
            "focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 " +
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-none",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn("grid place-content-center text-current")}
        >
            <Check className="h-4 w-4"/>
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const TaskCheckbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    TaskCheckboxProps
>(({className, level = "medium", ...props}, ref) => {
    const getLevelColors = (level: TaskLevel) => {
        switch (level) {
            case "low":
                return {
                    checked: "bg-level-task-low-bg data-[state=checked]:text-level-task-low-text ",
                    unchecked: "border-level-task-low-text"
                }
            case "high":
                return {
                    checked: "bg-level-task-high-bg data-[state=checked]:text-level-task-high-text ",
                    unchecked: "border-level-task-high-text"
                }
            case "medium":
            default:
                return {
                    checked: "bg-level-task-medium-bg data-[state=checked]:text-level-task-medium-text ",
                    unchecked: "border-level-task-medium-text"
                }
        }
    }

    const colors = getLevelColors(level)

    return (
        <CheckboxPrimitive.Root
            ref={ref}
        className={cn(
            "grid place-content-center peer h-6 w-6 shrink-0 rounded-soft focus-visible:outline-none " +
            "disabled:cursor-not-allowed disabled:opacity-50 " +
            colors.checked + colors.unchecked,
            className
        )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn("grid place-content-center text-current")}
            >
                <Check className="h-4 w-4"/>
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
})
TaskCheckbox.displayName = "TaskCheckbox"

export {Checkbox, TaskCheckbox}
