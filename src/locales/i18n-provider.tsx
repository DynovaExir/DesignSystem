import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Locale, Translations } from './types'
import { en } from './en'
import { fa } from './fa'

const translations: Record<Locale, Translations> = { en, fa }

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
  dir: 'ltr' | 'rtl'
  isRTL: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

const LOCALE_STORAGE_KEY = 'dynova_locale'

function getInitialLocale(): Locale {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en' || stored === 'fa') {
      return stored
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('fa')) {
      return 'fa'
    }
  }
  
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  // Update document direction when locale changes
  useEffect(() => {
    const dir = locale === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale],
    dir: locale === 'fa' ? 'rtl' : 'ltr',
    isRTL: locale === 'fa',
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t, locale, dir, isRTL } = useI18n()
  return { t, locale, dir, isRTL }
}
