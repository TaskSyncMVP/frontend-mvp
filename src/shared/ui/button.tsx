import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import Link from "next/link"
import * as React from "react"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:pointer-events-none disabled:opacity-50 transition duration-200",
    {
        variants: {
            variant: {
                default: "bg-primary-100 text-secondary " +
                    "hover:shadow-largeDrop",
                primary: "bg-primary-30 text-primary-100 font-normal " +
                    "hover:shadow-largeDrop",
                secondary: "bg-secondary text-secondary-foreground items-center shadow-drop text-xs font-semibold shadow-md " +
                    "hover:shadow-lg",
                outline: "border border-input bg-background " +
                    "hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                icon: "bg-none border-none bg-none text-secondary " +
                    "hover:bg-accent hover:text-accent-foreground"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                xl: "h-14",
                icon: "h-9 w-9",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const linkVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:pointer-events-none disabled:opacity-50 no-underline transition duration-200",
    {
        variants: {
            variant: {
                default: "text-primary-100 underline-offset-4 text-sm font-regular",
            },
            size: {
                default: "text-sm",
                sm: "text-xs",
                lg: "text-base",
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
    'data-testid'?: string;
}

export interface LinkButtonProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
        VariantProps<typeof linkVariants> {
    href: string
    'data-testid'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button"

        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({className, variant, size, href, ...props}, ref) => {
        return (
            <Link
                ref={ref}
                href={href}
                className={cn(linkVariants({variant, size, className}))}
                {...props}
            />
        )
    }
)

Button.displayName = "Button"
LinkButton.displayName = "LinkButton"

export {Button, LinkButton, buttonVariants, linkVariants}
