"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[52px] w-full rounded-md border bg-color-bg-subtle px-4 text-body-sm-regular transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-color-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-40",
          error
            ? "border-color-status-danger focus-visible:ring-color-status-danger"
            : "border-color-border-strong focus-visible:ring-color-border-focus",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
