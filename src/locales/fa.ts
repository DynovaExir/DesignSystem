import type { Translations } from './types'

export const fa: Translations = {
  common: {
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    retry: 'تلاش مجدد',
    cancel: 'لغو',
    confirm: 'تایید',
    close: 'بستن',
  },
  auth: {
    login: {
      title: 'به داینووا خوش آمدید',
      subtitle: 'برای ادامه وارد حساب کاربری خود شوید',
      signingIn: 'در حال ورود...',
      redirecting: 'در حال انتقال به صفحه احراز هویت...',
      signInWithKeycloak: 'ورود با Keycloak',
      loggedOutSuccess: 'با موفقیت از حساب خود خارج شدید.',
    },
    callback: {
      processing: 'در حال پردازش احراز هویت...',
      exchangingCode: 'در حال تبادل کد احراز هویت...',
      invalidState: 'وضعیت نامعتبر',
      invalidStateMessage: 'وضعیت احراز هویت نامعتبر است یا منقضی شده است. لطفا دوباره وارد شوید.',
      exchangeError: 'خطای احراز هویت',
      exchangeErrorMessage: 'احراز هویت با خطا مواجه شد. لطفا دوباره تلاش کنید.',
      backToLogin: 'بازگشت به صفحه ورود',
    },
    logout: {
      button: 'خروج',
      loggingOut: 'در حال خروج...',
    },
    sessionBanner: {
      expiresIn: 'جلسه شما منقضی می‌شود در',
      staySignedIn: 'ادامه ورود',
    },
    sessionExpired: {
      title: 'جلسه منقضی شد',
      message: 'لطفا برای ادامه دوباره وارد شوید.',
      signInAgain: 'ورود مجدد',
    },
    protectedRoute: {
      restoring: 'در حال بازیابی جلسه...',
      restoringSession: 'لطفا صبر کنید تا جلسه شما بازیابی شود',
    },
  },
  header: {
    welcome: 'خوش آمدید',
  },
  language: {
    switchTo: 'تغییر به',
    english: 'English',
    persian: 'فارسی',
  },
}
