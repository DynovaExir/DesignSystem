export type Locale = "fa" | "en";

export const translations = {
  fa: {
    // Login page
    "login.title": "ورود به داینووا",
    "login.subtitle": "برای دسترسی به پنل مدیریت، وارد حساب کاربری خود شوید",
    "login.cta": "ورود با کیکلوک",
    "login.redirectNote": "به سرور احراز هویت هدایت خواهید شد",
    "login.loggedOut": "با موفقیت از سیستم خارج شدید",
    "login.error.invalid_state": "وضعیت احراز هویت نامعتبر است",
    "login.error.access_denied": "دسترسی رد شد",
    "login.error.generic": "خطایی رخ داده است",
    "login.tryAgain": "تلاش مجدد",
    "login.back": "بازگشت",

    // Callback page
    "callback.title": "در حال ورود...",
    "callback.subtitle": "لطفاً صبر کنید",
    "callback.error.title": "احراز هویت ناموفق بود",
    "callback.error.description": "وضعیت احراز هویت نامعتبر است",
    "callback.tryAgain": "تلاش مجدد",
    "callback.back": "بازگشت",
    "callback.simulateError": "شبیه‌سازی خطا",

    // Session timeout
    "session.warning": "جلسه شما در {time} منقضی می‌شود",
    "session.staySignedIn": "ادامه جلسه",
    "session.logout": "خروج",
    "session.expired.title": "جلسه منقضی شد",
    "session.expired.description": "برای ادامه، دوباره وارد شوید",
    "session.signInAgain": "ورود مجدد",

    // Layout
    "nav.dashboard": "داشبورد",
    "nav.profile": "پروفایل",
    "nav.settings": "تنظیمات",
    "nav.logout": "خروج",
    "breadcrumb.home": "خانه",
    "breadcrumb.dashboard": "داشبورد",

    // Language
    "language.fa": "فا",
    "language.en": "EN",

    // Footer
    "footer.copyright": "© ۲۰۲۶ داینووا",
    "footer.version": "نسخه ۱.۰.۰",

    // Common
    "common.dismiss": "بستن",
    "common.loading": "در حال بارگذاری...",
  },
  en: {
    // Login page
    "login.title": "Sign in to Dynova",
    "login.subtitle": "Access your management panel by signing in",
    "login.cta": "Sign in with Keycloak",
    "login.redirectNote": "You will be redirected to your identity provider",
    "login.loggedOut": "You have been successfully signed out",
    "login.error.invalid_state": "Invalid authentication state",
    "login.error.access_denied": "Access denied",
    "login.error.generic": "An error occurred",
    "login.tryAgain": "Try again",
    "login.back": "Back",

    // Callback page
    "callback.title": "Signing you in...",
    "callback.subtitle": "Please wait",
    "callback.error.title": "Authentication failed",
    "callback.error.description": "Invalid authentication state",
    "callback.tryAgain": "Try again",
    "callback.back": "Back",
    "callback.simulateError": "Simulate error",

    // Session timeout
    "session.warning": "Your session will expire in {time}",
    "session.staySignedIn": "Stay signed in",
    "session.logout": "Log out",
    "session.expired.title": "Session expired",
    "session.expired.description": "Please sign in again to continue",
    "session.signInAgain": "Sign in again",

    // Layout
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Log out",
    "breadcrumb.home": "Home",
    "breadcrumb.dashboard": "Dashboard",

    // Language
    "language.fa": "فا",
    "language.en": "EN",

    // Footer
    "footer.copyright": "© 2026 Dynova",
    "footer.version": "v1.0.0",

    // Common
    "common.dismiss": "Dismiss",
    "common.loading": "Loading...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["fa"];

export function t(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string>
): string {
  let text = translations[locale][key] || translations.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, value);
    });
  }

  return text;
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

const LOCALE_STORAGE_KEY = "dynova.locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "fa";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" || stored === "fa" ? stored : "fa";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
