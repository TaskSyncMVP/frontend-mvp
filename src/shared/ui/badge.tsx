import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-soft px-4 py-1 text-xs font-regular transition-colors",
    {
        variants: {
            variant: {
                medium: "bg-level-task-medium-bg text-level-task-medium-text",
                low: "bg-level-task-low-bg text-level-task-low-text",
                high: "bg-level-task-high-bg text-level-task-high-text",
            },
        },
        defaultVariants: {
            variant: "medium",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
}

function Badge({className, variant, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
