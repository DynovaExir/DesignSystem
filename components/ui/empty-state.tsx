import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileX, Search, Users, Database, Shield, FolderOpen } from "lucide-react"

/**
 * Dynova Empty State Component
 * Used for tables and lists when no data is available
 * All text must be in Persian
 */

type EmptyStateVariant = 
  | "default"
  | "search"
  | "users"
  | "data"
  | "permissions"
  | "files"

const variantConfig: Record<EmptyStateVariant, {
  icon: React.ElementType
  title: string
  description: string
}> = {
  default: {
    icon: FileX,
    title: "داده‌ای یافت نشد",
    description: "در حال حاضر هیچ موردی برای نمایش وجود ندارد.",
  },
  search: {
    icon: Search,
    title: "نتیجه‌ای یافت نشد",
    description: "جستجوی شما نتیجه‌ای نداشت. لطفاً عبارت دیگری را امتحان کنید.",
  },
  users: {
    icon: Users,
    title: "کاربری یافت نشد",
    description: "هنوز کاربری به این بخش اضافه نشده است.",
  },
  data: {
    icon: Database,
    title: "داده‌ای وجود ندارد",
    description: "هنوز داده‌ای در این بخش ثبت نشده است.",
  },
  permissions: {
    icon: Shield,
    title: "مجوزی تعریف نشده",
    description: "هنوز هیچ مجوزی برای این نقش تعریف نشده است.",
  },
  files: {
    icon: FolderOpen,
    title: "فایلی وجود ندارد",
    description: "هنوز فایلی در این بخش آپلود نشده است.",
  },
}

export interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  icon?: React.ElementType
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  variant = "default",
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = icon || config.icon
  const displayTitle = title || config.title
  const displayDescription = description || config.description

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{displayTitle}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {displayDescription}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
