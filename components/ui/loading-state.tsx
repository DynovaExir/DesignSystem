import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

/**
 * Dynova Loading State Components
 * Various loading indicators with Persian text
 */

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({
  size = "md",
  text = "در حال بارگذاری...",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "در حال بارگذاری صفحه..." }: LoadingPageProps) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" text={message} />
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 border-b pb-3">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <Skeleton className="mb-4 h-6 w-[200px]" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  )
}

export function LoadingForm() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-[52px] w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-[120px]" />
    </div>
  )
}
