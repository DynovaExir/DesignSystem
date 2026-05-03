"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-body-sm-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-color-interactive-default text-color-text-inverse hover:bg-color-interactive-hover active:bg-color-interactive-active focus-visible:ring-color-interactive-focus",
        secondary:
          "bg-color-interactive-subtle text-color-interactive-default hover:bg-color-interactive-subtle/80 active:bg-color-interactive-subtle/60 focus-visible:ring-color-interactive-focus",
        tertiary:
          "bg-transparent text-color-text-default border border-color-border-strong hover:bg-color-bg-default active:bg-color-bg-muted focus-visible:ring-color-interactive-focus",
        destructive:
          "bg-color-status-danger text-color-text-inverse hover:bg-color-status-danger/90 active:bg-color-status-danger/80 focus-visible:ring-color-status-danger",
        ghost:
          "bg-transparent text-color-text-link hover:bg-color-interactive-subtle active:bg-color-interactive-subtle/80 focus-visible:ring-color-interactive-focus",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }), "h-[44px] px-4")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
