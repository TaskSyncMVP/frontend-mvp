import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className="relative">
      <input
          type={inputType}
        className={cn(
          "flex h-9 w-full rounded-2xl border-[1.5px] border-primary-100 bg-secondary px-3 py-2 text-xs" +
            "transition-colors file:border-0 file:text-sm file:font-medium file:text-foreground " +
            "placeholder:text-muted-foreground placeholder:text-xs focus-visible:outline-none " +
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm lg:h-10",
            showPasswordToggle && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
