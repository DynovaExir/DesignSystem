"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Locale,
  type TranslationKey,
  t as translate,
  getDirection,
  getStoredLocale,
  setStoredLocale,
} from "./i18n";

interface I18nContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({
  children,
  defaultLocale = "fa",
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const dir = getDirection(locale);
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string>) => {
      return translate(locale, key, params);
    },
    [locale]
  );

  const dir = getDirection(locale);

  // Prevent hydration mismatch by rendering null until mounted
  if (!mounted) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
