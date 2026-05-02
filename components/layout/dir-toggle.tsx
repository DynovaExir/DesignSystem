"use client"

import { useLocale, useT } from "@/lib/locale-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function DirToggle() {
  const { locale, toggleLocale } = useLocale()
  const t = useT()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "fa" ? "EN" : "فا"}</span>
    </Button>
  )
}
