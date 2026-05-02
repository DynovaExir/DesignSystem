"use client"

import { cn } from "@/lib/utils"
import { Check, X, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useLocale } from "@/lib/contexts/locale-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export type UniquenessState = "idle" | "checking" | "available" | "taken" | "error"

interface UniquenessIndicatorProps {
  state: UniquenessState
  message?: string
  normalizedValue?: string
  originalValue?: string
  onRetry?: () => void
  className?: string
}

export function UniquenessIndicator({
  state,
  message,
  normalizedValue,
  originalValue,
  onRetry,
  className,
}: UniquenessIndicatorProps) {
  const { t } = useLocale()
  
  const showNormalized = normalizedValue && originalValue && normalizedValue !== originalValue

  if (state === "idle") {
    return null
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm",
          className
        )}
      >
        {state === "checking" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">{t.checking}</span>
          </>
        )}

        {state === "available" && (
          <>
            <Check className="h-4 w-4 text-success" />
            <span className="text-success">{t.available}</span>
            {showNormalized && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.normalizedTooltip}</p>
                  <p className="font-mono text-xs mt-1">{normalizedValue}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}

        {state === "taken" && (
          <>
            <X className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{message || t.taken}</span>
          </>
        )}

        {state === "error" && (
          <>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t.error}</span>
            {onRetry && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={onRetry}
              >
                <RefreshCw className="h-3 w-3 me-1" />
                {t.retry}
              </Button>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
