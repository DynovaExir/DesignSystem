"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, getDictionary, type Dictionary } from "./i18n"

interface LocaleContextType {
  locale: Locale
  direction: "rtl" | "ltr"
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  
  const direction = locale === "fa" ? "rtl" : "ltr"
  const dictionary = getDictionary(locale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("dynova.locale", newLocale)
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fa" ? "en" : "fa")
  }, [locale, setLocale])

  // Load locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("dynova.locale") as Locale | null
      if (savedLocale && (savedLocale === "fa" || savedLocale === "en")) {
        setLocaleState(savedLocale)
      }
    }
  }, [])

  // Update document direction
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = direction
      document.documentElement.lang = locale
    }
  }, [direction, locale])

  return (
    <LocaleContext.Provider value={{ locale, direction, dictionary, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}

export function useT() {
  const { dictionary } = useLocale()
  return dictionary
}
