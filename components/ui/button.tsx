import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Dynova Button Component
 * 
 * Per Component Catalog v3.1:
 * - Single height: 44px (min touch target)
 * - Border radius: radius/full (999px)
 * - Typography: body-sm-semibold (14px, 600)
 * - Horizontal padding: 16px
 * - Focus ring: 2px white gap + 2px primary ring
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: filled primary background, white text
        default:
          "bg-primary text-primary-foreground hover:bg-[oklch(0.3334_0.0687_240.8240)] active:bg-[oklch(0.2247_0.0418_239.4563)]",
        // Secondary: primary-100 background, primary text
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[oklch(0.88_0.03_230)] active:bg-[oklch(0.82_0.04_230)]",
        // Ghost: transparent, primary text, hover shows primary-100
        ghost:
          "text-primary hover:bg-secondary active:bg-[oklch(0.82_0.04_230)]",
        // Tertiary/Outline: border-strong stroke, primary text
        outline:
          "border-2 border-border-strong text-primary bg-transparent hover:bg-secondary active:bg-[oklch(0.82_0.04_230)]",
        // Destructive: danger fill, white text
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[oklch(0.45_0.18_14.82)] active:bg-[oklch(0.35_0.15_14.82)]",
      },
      size: {
        // Default: 44px height per Dynova spec
        default: "h-11 px-4",
        // Icon-only button
        icon: "h-11 w-11",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
