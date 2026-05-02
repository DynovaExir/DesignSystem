import { cn } from "@/lib/utils"

/**
 * Dynova Skeleton Component
 * 
 * Per Component Catalog v3.1:
 * - Background: color/bg/muted (neutral-300)
 * - Opacity: opacity/skeleton (0.6)
 * - Border radius: matches content being loaded
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-skeleton rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
