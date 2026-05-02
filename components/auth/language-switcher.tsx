"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

/**
 * Language switcher button
 * Toggles between Persian (FA) and English (EN)
 */
export function LanguageSwitcher() {
  const { locale, switchLocale, t } = useLocale()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchLocale}
      aria-label={t("a11y.switchLanguage")}
      className="gap-2"
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-semibold">
        {locale === "fa" ? "EN" : "FA"}
      </span>
    </Button>
  )
}
