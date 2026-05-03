"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react"

type BannerVariant = "warning" | "danger" | "info" | "success"

interface BannerProps {
  variant: BannerVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BannerVariant, { bg: string; text: string; icon: typeof AlertTriangle }> = {
  warning: {
    bg: "bg-color-status-warning-bg",
    text: "text-color-status-warning",
    icon: AlertTriangle,
  },
  danger: {
    bg: "bg-color-status-danger-bg",
    text: "text-color-status-danger",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-color-status-info-bg",
    text: "text-color-status-info",
    icon: Info,
  },
  success: {
    bg: "bg-color-status-success-bg",
    text: "text-color-status-success",
    icon: CheckCircle,
  },
}

export function Banner({ variant, children, className }: BannerProps) {
  const styles = variantStyles[variant]
  const Icon = styles.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-4",
        styles.bg,
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.text)} />
      <div className={cn("text-body-sm-regular", styles.text)}>{children}</div>
    </div>
  )
}
