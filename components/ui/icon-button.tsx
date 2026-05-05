import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"

/**
 * Dynova IconButton Component
 * Based on AGENT.md v3.1 specifications:
 * - Separate component from Button (never a Button size variant)
 * - variant: filled | tertiary
 * - size: md (44×44px) | sm (32×32px) | xs (24×24px)
 * - tooltipLabel is REQUIRED (WCAG 1.1.1)
 * - sm and xs sizes need 44px hit area
 */

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:bg-[hsl(201,75%,19%)] active:bg-[hsl(202,68%,10%)] focus-visible:ring-primary rounded-full",
        tertiary:
          "border-2 border-[hsl(219,20%,27%)] bg-transparent text-foreground hover:bg-muted/50 active:bg-muted focus-visible:ring-primary rounded-full",
      },
      size: {
        md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
        sm: "h-8 w-8 min-h-[44px] min-w-[44px] [&_svg]:h-4 [&_svg]:w-4",
        xs: "h-6 w-6 min-h-[44px] min-w-[44px] [&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required tooltip label for accessibility (WCAG 1.1.1) */
  tooltipLabel: string
  /** Loading state */
  loading?: boolean
  /** Side for tooltip */
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      tooltipLabel,
      loading = false,
      disabled,
      tooltipSide = "top",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(iconButtonVariants({ variant, size }), className)}
              ref={ref}
              disabled={disabled || loading}
              aria-label={tooltipLabel}
              {...props}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                children
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            {tooltipLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
