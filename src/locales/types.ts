export type Locale = 'en' | 'fa'

export interface Translations {
  common: {
    loading: string
    error: string
    retry: string
    cancel: string
    confirm: string
    close: string
  }
  auth: {
    login: {
      title: string
      subtitle: string
      signingIn: string
      redirecting: string
      signInWithKeycloak: string
      loggedOutSuccess: string
    }
    callback: {
      processing: string
      exchangingCode: string
      invalidState: string
      invalidStateMessage: string
      exchangeError: string
      exchangeErrorMessage: string
      backToLogin: string
    }
    logout: {
      button: string
      loggingOut: string
    }
    sessionBanner: {
      expiresIn: string
      staySignedIn: string
    }
    sessionExpired: {
      title: string
      message: string
      signInAgain: string
    }
    protectedRoute: {
      restoring: string
      restoringSession: string
    }
  }
  header: {
    welcome: string
  }
  language: {
    switchTo: string
    english: string
    persian: string
  }
}

export type TranslationKey = keyof Translations
