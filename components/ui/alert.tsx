import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Dynova Alert Component
 * 
 * Per Component Catalog v3.1:
 * - Border radius: radius/md (12px)
 * - Padding: space/4 (16px)
 * - Left accent: border-width/accent (4px) 
 * - Status backgrounds with matching text/icon colors
 */
const alertVariants = cva(
  "relative w-full rounded-md border-s-4 p-4 [&>svg~*]:ps-7 [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-s-border",
        success: "bg-[#e9f9ef] text-[#0e7732] border-s-[#0e7732] [&>svg]:text-[#0e7732]",
        destructive: "bg-[#ffe9f0] text-[#c41f47] border-s-[#c41f47] [&>svg]:text-[#c41f47]",
        warning: "bg-[#fef3e2] text-[#b47818] border-s-[#b47818] [&>svg]:text-[#b47818]",
        info: "bg-[#f3eefe] text-[#5c1fc8] border-s-[#5c1fc8] [&>svg]:text-[#5c1fc8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
