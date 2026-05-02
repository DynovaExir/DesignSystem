"use client"

import { useLocale, useT } from "@/lib/locale-context"
import { TenantSelector } from "@/components/tenant-selector/tenant-selector"
import { DirToggle } from "@/components/layout/dir-toggle"
import { cn } from "@/lib/utils"

export function AppHeader() {
  const { direction } = useLocale()
  const t = useT()

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-card shadow-xs">
      <div className="flex h-full items-center justify-between px-5">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-body-sm-semibold text-primary-foreground">D</span>
          </div>
          <div>
            <h1 className="text-body-lg-semibold text-foreground">{t.app.name}</h1>
            <p className="text-label-lg-regular text-muted-foreground">{t.app.tagline}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <DirToggle />
          <TenantSelector />
        </div>
      </div>
    </header>
  )
}
