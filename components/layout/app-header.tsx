"use client"

import Link from "next/link"
import { useLocale } from "@/lib/contexts/locale-context"
import { TenantSelector } from "@/components/tenant-selector/tenant-selector"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

export function AppHeader() {
  const { t, locale, toggleLocale, dir } = useLocale()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            D
          </div>
          <span className="hidden sm:inline">{t.appName}</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Tenant Selector */}
          <TenantSelector isPlatformAdmin={true} />

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="gap-2"
            aria-label={locale === "fa" ? t.switchToEnglish : t.switchToPersian}
          >
            <Globe className="h-4 w-4" />
            <span className={cn("text-xs font-medium", locale === "fa" && "font-sans")}>
              {locale === "fa" ? "EN" : "فا"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
