"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { type Locale, type Dictionary, getDictionary } from "../i18n"

interface LocaleContextValue {
  locale: Locale
  dir: "rtl" | "ltr"
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

interface LocaleProviderProps {
  children: ReactNode
  defaultLocale?: Locale
}

export function LocaleProvider({
  children,
  defaultLocale = "fa",
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  const dir = locale === "fa" ? "rtl" : "ltr"
  const t = getDictionary(locale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("dir", newLocale === "fa" ? "rtl" : "ltr")
      document.documentElement.setAttribute("lang", newLocale)
      localStorage.setItem("dynova.locale", newLocale)
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fa" ? "en" : "fa")
  }, [locale, setLocale])

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dynova.locale") as Locale | null
    if (stored && (stored === "fa" || stored === "en")) {
      setLocale(stored)
    } else {
      setLocale(defaultLocale)
    }
    setMounted(true)
  }, [defaultLocale, setLocale])

  // Update document attributes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("dir", dir)
      document.documentElement.setAttribute("lang", locale)
    }
  }, [dir, locale, mounted])

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dir,
        t,
        setLocale,
        toggleLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
