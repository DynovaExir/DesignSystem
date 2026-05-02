import fa from "./locales/fa.json"
import en from "./locales/en.json"

export type Locale = "fa" | "en"

export const locales = {
  fa,
  en,
} as const

export type TranslationKeys = typeof fa

/**
 * Get nested translation value by dot-separated key path
 * @example t("login.title", "fa") => "ورود به سامانه داینووا"
 */
export function getTranslation(keyPath: string, locale: Locale): string {
  const keys = keyPath.split(".")
  let value: unknown = locales[locale]

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      // Fallback: try English, then return key path
      if (locale !== "en") {
        return getTranslation(keyPath, "en")
      }
      return keyPath
    }
  }

  return typeof value === "string" ? value : keyPath
}

export const LOCALE_STORAGE_KEY = "dynova.locale"
export const DEFAULT_LOCALE: Locale = "fa"
