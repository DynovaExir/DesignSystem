import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

/**
 * Dynova Alert Component
 * Status alerts using semantic colors from design system
 */

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pe-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border",
        success:
          "bg-[hsl(145,60%,95%)] text-[hsl(145,79%,26%)] border-[hsl(145,79%,26%)]",
        danger:
          "bg-[hsl(344,100%,96%)] text-[hsl(344,73%,45%)] border-[hsl(344,73%,45%)]",
        warning:
          "bg-[hsl(37,95%,94%)] text-[hsl(37,76%,40%)] border-[hsl(37,76%,40%)]",
        info:
          "bg-[hsl(262,87%,96%)] text-[hsl(262,73%,45%)] border-[hsl(262,73%,45%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantIcons = {
  default: Info,
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", dismissible, onDismiss, children, ...props }, ref) => {
    const Icon = variantIcons[variant || "default"]
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-5 w-5" />
        {children}
        {dismissible && (
          <button
            onClick={onDismiss}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="رد کردن"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
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
