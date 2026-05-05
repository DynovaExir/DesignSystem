import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Dynova Badge Component
 * Based on AGENT.md v3.1 specifications:
 * - Variants: default, secondary, success, danger, warning, info, outline
 * - Status badges use color/status/[variant]-bg fill + color/status/[variant] text
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        success:
          "bg-[hsl(145,60%,95%)] text-[hsl(145,79%,26%)]",
        danger:
          "bg-[hsl(344,100%,96%)] text-[hsl(344,73%,45%)]",
        warning:
          "bg-[hsl(37,95%,94%)] text-[hsl(37,76%,40%)]",
        info:
          "bg-[hsl(262,87%,96%)] text-[hsl(262,73%,45%)]",
        outline:
          "border border-input bg-transparent text-foreground",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
