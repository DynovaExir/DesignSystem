import { create } from 'zustand'
import type { User } from '@/services/types'
import { refreshToken as apiRefreshToken, logout as apiLogout, fetchCurrentUser, buildEndSessionUrl, fetchOIDCConfig } from '@/services/api'
import { clearPKCEState } from '@/services/pkce'

interface AuthState {
  // Token state (in-memory only, never persisted)
  accessToken: string | null
  expiresAt: number | null
  
  // User state
  user: User | null
  
  // Session metadata
  idleExpiresAt: number | null
  absoluteExpiresAt: number | null
  
  // UI state
  isAuthenticated: boolean
  isRefreshing: boolean
  sessionExpired: boolean
  
  // Actions
  setTokens: (accessToken: string, expiresInSeconds: number) => void
  setUser: (user: User) => void
  setSessionMetadata: (idleExpiresAt: number, absoluteExpiresAt: number) => void
  clearTokens: () => void
  refresh: () => Promise<boolean>
  silentRefresh: () => Promise<boolean>
  logout: () => Promise<void>
  setSessionExpired: (expired: boolean) => void
  fetchAndSetUser: () => Promise<void>
}

// Single-flight pattern: track if a refresh is in progress
let refreshPromise: Promise<boolean> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state - all in-memory
  accessToken: null,
  expiresAt: null,
  user: null,
  idleExpiresAt: null,
  absoluteExpiresAt: null,
  isAuthenticated: false,
  isRefreshing: false,
  sessionExpired: false,

  setTokens: (accessToken: string, expiresInSeconds: number) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000
    console.log('[AuthStore] Setting tokens, expires at:', new Date(expiresAt).toISOString())
    set({
      accessToken,
      expiresAt,
      isAuthenticated: true,
      sessionExpired: false,
    })
  },

  setUser: (user: User) => {
    console.log('[AuthStore] Setting user:', user.username)
    set({ user })
  },

  setSessionMetadata: (idleExpiresAt: number, absoluteExpiresAt: number) => {
    console.log('[AuthStore] Setting session metadata')
    set({ idleExpiresAt, absoluteExpiresAt })
  },

  clearTokens: () => {
    console.log('[AuthStore] Clearing tokens')
    set({
      accessToken: null,
      expiresAt: null,
      user: null,
      idleExpiresAt: null,
      absoluteExpiresAt: null,
      isAuthenticated: false,
      sessionExpired: false,
    })
    clearPKCEState()
  },

  refresh: async () => {
    // Single-flight: if refresh is already in progress, return the same promise
    if (refreshPromise) {
      console.log('[AuthStore] Refresh already in progress, waiting...')
      return refreshPromise
    }

    console.log('[AuthStore] Starting token refresh')
    set({ isRefreshing: true })

    refreshPromise = (async () => {
      try {
        const response = await apiRefreshToken()
        const { accessToken } = get()
        
        // Only update if we still need to (avoid race conditions)
        if (!accessToken || get().expiresAt! < Date.now() + 10000) {
          get().setTokens(response.access_token, response.expires_in)
        }
        
        return true
      } catch (error) {
        console.error('[AuthStore] Token refresh failed:', error)
        get().setSessionExpired(true)
        return false
      } finally {
        set({ isRefreshing: false })
        refreshPromise = null
      }
    })()

    return refreshPromise
  },

  silentRefresh: async () => {
    console.log('[AuthStore] Starting silent refresh to restore session')
    return get().refresh()
  },

  logout: async () => {
    console.log('[AuthStore] Logging out')
    
    try {
      // Call logout endpoint
      await apiLogout()
      
      // Clear local state
      get().clearTokens()
      
      // Get OIDC config for end session URL
      const config = await fetchOIDCConfig()
      const postLogoutRedirectUri = `${window.location.origin}/login?logged_out=1`
      const endSessionUrl = buildEndSessionUrl(config.issuer, postLogoutRedirectUri)
      
      // Redirect to Keycloak end session
      console.log('[AuthStore] Redirecting to end session:', endSessionUrl)
      window.location.href = endSessionUrl
    } catch (error) {
      console.error('[AuthStore] Logout error:', error)
      // Still redirect to login even if logout fails
      window.location.href = '/login?logged_out=1'
    }
  },

  setSessionExpired: (expired: boolean) => {
    console.log('[AuthStore] Session expired:', expired)
    set({ sessionExpired: expired })
  },

  fetchAndSetUser: async () => {
    try {
      const metadata = await fetchCurrentUser()
      set({
        user: metadata.user,
        idleExpiresAt: metadata.idle_expires_at,
        absoluteExpiresAt: metadata.absolute_expires_at,
      })
    } catch (error) {
      console.error('[AuthStore] Failed to fetch user:', error)
      throw error
    }
  },
}))

// Selectors
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectUser = (state: AuthState) => state.user
export const selectAccessToken = (state: AuthState) => state.accessToken
export const selectIsRefreshing = (state: AuthState) => state.isRefreshing
export const selectSessionExpired = (state: AuthState) => state.sessionExpired
export const selectIdleExpiresAt = (state: AuthState) => state.idleExpiresAt
export const selectExpiresAt = (state: AuthState) => state.expiresAt
