import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-lg-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-color-interactive-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-color-interactive-default text-color-text-inverse",
        secondary: "bg-color-bg-muted text-color-text-default",
        success: "bg-color-status-success-bg text-color-status-success",
        danger: "bg-color-status-danger-bg text-color-status-danger",
        warning: "bg-color-status-warning-bg text-color-status-warning",
        info: "bg-color-status-info-bg text-color-status-info",
        outline: "border border-color-border-default text-color-text-default bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
