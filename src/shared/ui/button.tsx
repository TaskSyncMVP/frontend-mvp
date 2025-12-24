import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import Link from "next/link"
import * as React from "react"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap group rounded-md " +
    "transition-transform duration-200",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-100 text-secondary hover:scale-105",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-drop text-xs font-semibold flex flex-row items-center " +
                    "gap-2 p-6 hover:largeDrop",
                link: "text-primary-100 hover:underline text-sm font-regular",
                primary: "text-secondary text-base border-none p-0 overflow-hidden " +
                    "bg-primary-100 mask1 flex items-center justify-center text-secondary font-semibold " +
                    "hover:scale-105",
                icon: "bg-none border-none text-secondary"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                xl: "h-14",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, href, ...props}
        , ref) => {
        const Comp = asChild ? Slot : "button"

        if (variant === "link" && href) {
            const {children} = props;
            return (
                <Link href={href} className={cn(buttonVariants({variant, size, className}))}>
                    {children}
                </Link>
            )
        }

        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}
