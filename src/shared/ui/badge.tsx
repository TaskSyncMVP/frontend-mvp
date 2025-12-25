import {cva, type VariantProps} from "class-variance-authority"
import * as React from "react"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center font-regular transition-colors",
    {
        variants: {
            variant: {
                medium: "bg-level-task-medium-bg text-level-task-medium-text",
                low: "bg-level-task-low-bg text-level-task-low-text",
                high: "bg-level-task-high-bg text-level-task-high-text",
            },
            size: {
                default: "px-4 py-1 text-xs rounded-soft",
                mini: "px-2 text-[9px] rounded-lg",
            },
        },
        defaultVariants: {
            variant: "medium",
            size: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
}

function Badge({className, variant, size, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant, size}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
