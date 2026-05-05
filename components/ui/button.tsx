import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

/**
 * Dynova Button Component
 * Based on AGENT.md v3.1 specifications:
 * - One size (44px height)
 * - Five variants: default, secondary, tertiary, destructive, ghost
 * - Full radius (pill shape)
 * - Focus ring: 2px white gap + 2px focus color
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[hsl(201,75%,19%)] active:bg-[hsl(202,68%,10%)] focus-visible:ring-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 focus-visible:ring-primary",
        tertiary:
          "border-2 border-[hsl(219,20%,27%)] bg-transparent text-foreground hover:bg-muted/50 active:bg-muted focus-visible:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-primary",
        link:
          "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
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
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant }),
          "h-11 px-6 rounded-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
