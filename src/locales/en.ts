import type { Translations } from './types'

export const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
  },
  auth: {
    login: {
      title: 'Welcome to Dynova',
      subtitle: 'Sign in to continue to your account',
      signingIn: 'Signing in...',
      redirecting: 'Redirecting to authentication...',
      signInWithKeycloak: 'Sign in with Keycloak',
      loggedOutSuccess: 'You have been successfully logged out.',
    },
    callback: {
      processing: 'Processing authentication...',
      exchangingCode: 'Exchanging authorization code...',
      invalidState: 'Invalid State',
      invalidStateMessage: 'The authentication state is invalid or has expired. Please try signing in again.',
      exchangeError: 'Authentication Error',
      exchangeErrorMessage: 'Failed to complete authentication. Please try again.',
      backToLogin: 'Back to Login',
    },
    logout: {
      button: 'Logout',
      loggingOut: 'Logging out...',
    },
    sessionBanner: {
      expiresIn: 'Your session will expire in',
      staySignedIn: 'Stay signed in',
    },
    sessionExpired: {
      title: 'Session Expired',
      message: 'Please sign in again to continue.',
      signInAgain: 'Sign in again',
    },
    protectedRoute: {
      restoring: 'Restoring session...',
      restoringSession: 'Please wait while we restore your session',
    },
  },
  header: {
    welcome: 'Welcome',
  },
  language: {
    switchTo: 'Switch to',
    english: 'English',
    persian: 'فارسی',
  },
}
