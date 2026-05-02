"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import {
  type Locale,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getTranslation,
} from "@/lib/i18n"

interface LocaleContextValue {
  locale: Locale
  dir: "rtl" | "ltr"
  switchLocale: () => void
  t: (key: string) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  // Load locale from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored && (stored === "fa" || stored === "en")) {
      setLocale(stored)
    }
    setMounted(true)
  }, [])

  // Update document attributes when locale changes
  useEffect(() => {
    if (!mounted) return
    const dir = locale === "fa" ? "rtl" : "ltr"
    const lang = locale
    document.documentElement.setAttribute("dir", dir)
    document.documentElement.setAttribute("lang", lang)
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale, mounted])

  const switchLocale = useCallback(() => {
    setLocale((prev) => (prev === "fa" ? "en" : "fa"))
  }, [])

  const t = useCallback(
    (key: string) => getTranslation(key, locale),
    [locale]
  )

  const dir = locale === "fa" ? "rtl" : "ltr"

  return (
    <LocaleContext.Provider value={{ locale, dir, switchLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}
