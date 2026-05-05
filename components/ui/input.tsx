import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Dynova Input Component
 * Based on AGENT.md v3.1 specifications:
 * - Fixed height: 52px
 * - Border: 1px color/border/strong (sole boundary indicator - WCAG 1.4.11)
 * - Focus border: 2px color/border/focus
 * - Error border: 1px color/status/danger
 * - Radius: md (12px)
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[52px] w-full rounded-md border bg-card px-4 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
          error
            ? "border-destructive focus-visible:ring-1 focus-visible:ring-destructive"
            : "border-input focus-visible:border-2 focus-visible:border-ring",
          className
        )}
        ref={ref}
        dir="rtl"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
