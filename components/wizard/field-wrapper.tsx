"use client"

import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AlertCircle, Check, Info, Loader2, X, Clock } from "lucide-react"
import type { FieldStatus } from "@/lib/wizard-types"

interface FieldWrapperProps {
  label: string
  htmlFor: string
  children: React.ReactNode
  status?: FieldStatus
  statusMessage?: string
  error?: string
  helper?: string
  showImmutabilityWarning?: boolean
  className?: string
}

export function FieldWrapper({
  label,
  htmlFor,
  children,
  status,
  statusMessage,
  error,
  helper,
  showImmutabilityWarning,
  className,
}: FieldWrapperProps) {
  const hasSubtext = error || helper || (status && status !== "idle")
  const subtextHeight = 19

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label row */}
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {showImmutabilityWarning && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  <AlertCircle className="h-4 w-4 text-color-status-warning" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>این مقدار پس از ایجاد مستأجر قابل تغییر نیست</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Input wrapper - 52px height */}
      <div className="relative">
        {children}
        {/* Status indicator - positioned at inline-start */}
        {status && status !== "idle" && (
          <div className="absolute start-3 top-1/2 -translate-y-1/2">
            <StatusIndicator status={status} />
          </div>
        )}
      </div>

      {/* Subtext region - always 19px to prevent layout shift */}
      <div className={cn("h-[19px] flex items-center gap-1", !hasSubtext && "invisible")}>
        {error && (
          <>
            <X className="h-3 w-3 text-color-status-danger" />
            <span className="text-label-lg-regular text-color-status-danger">{error}</span>
          </>
        )}
        {!error && status === "checking" && (
          <span className="text-label-lg-regular text-color-text-subtle">در حال بررسی…</span>
        )}
        {!error && status === "available" && (
          <>
            <Check className="h-3 w-3 text-color-status-success" />
            <span className="text-label-lg-regular text-color-status-success">موجود است</span>
          </>
        )}
        {!error && status === "taken" && (
          <>
            <X className="h-3 w-3 text-color-status-danger" />
            <span className="text-label-lg-regular text-color-status-danger">
              {statusMessage || "در دسترس نیست"}
            </span>
          </>
        )}
        {!error && status === "error" && (
          <>
            <AlertCircle className="h-3 w-3 text-color-status-danger" />
            <span className="text-label-lg-regular text-color-status-danger">
              {statusMessage || "خطا در بررسی، تلاش مجدد"}
            </span>
          </>
        )}
        {!error && status === "cooldown" && (
          <>
            <Clock className="h-3 w-3 text-color-status-warning" />
            <span className="text-label-lg-regular text-color-status-warning">
              بررسی موقتاً غیرفعال است
            </span>
          </>
        )}
        {!error && !status && helper && (
          <>
            <Info className="h-3 w-3 text-color-text-subtle" />
            <span className="text-label-lg-regular text-color-text-subtle">{helper}</span>
          </>
        )}
      </div>
    </div>
  )
}

function StatusIndicator({ status }: { status: FieldStatus }) {
  switch (status) {
    case "checking":
      return <Loader2 className="h-4 w-4 animate-spin text-color-icon-subtle" />
    case "available":
      return <Check className="h-4 w-4 text-color-status-success" />
    case "taken":
      return <X className="h-4 w-4 text-color-status-danger" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-color-status-danger" />
    case "cooldown":
      return <Clock className="h-4 w-4 text-color-status-warning" />
    default:
      return null
  }
}
