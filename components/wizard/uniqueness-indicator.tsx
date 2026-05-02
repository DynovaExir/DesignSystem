"use client"

import { useT } from "@/lib/locale-context"
import type { UniquenessStatus } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Check, X, AlertCircle, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface UniquenessIndicatorProps {
  status: UniquenessStatus
  message?: string
  onRetry?: () => void
  className?: string
}

export function UniquenessIndicator({
  status,
  message,
  onRetry,
  className,
}: UniquenessIndicatorProps) {
  const t = useT()

  if (status === "idle") {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status === "checking" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-label-lg-regular text-muted-foreground">
            {t.common.checking}
          </span>
        </>
      )}

      {status === "available" && (
        <>
          <Check className="h-4 w-4 text-success-500" />
          <span className="text-label-lg-regular text-success-500">
            {t.common.available}
          </span>
        </>
      )}

      {status === "taken" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <X className="h-4 w-4 text-danger-500" />
                <span className="text-label-lg-regular text-danger-500">
                  {t.common.taken}
                </span>
              </div>
            </TooltipTrigger>
            {message && (
              <TooltipContent>
                <p>{message}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-label-lg-regular text-muted-foreground">
            {t.common.error}
          </span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-auto px-2 py-1 text-label-lg-regular"
            >
              {t.common.retry}
            </Button>
          )}
        </div>
      )}

      {status === "cooldown" && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-warning-500" />
          <span className="text-label-lg-regular text-warning-500">
            Rate limited - please wait
          </span>
        </div>
      )}
    </div>
  )
}
