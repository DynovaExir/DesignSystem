import { useCallback } from 'react'
import { useAuthStore, selectIsAuthenticated, selectUser, selectAccessToken, selectIsRefreshing, selectSessionExpired } from '@/stores'

/**
 * Main authentication hook
 * Provides access to auth state and actions
 */
export function useAuth() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)
  const accessToken = useAuthStore(selectAccessToken)
  const isRefreshing = useAuthStore(selectIsRefreshing)
  const sessionExpired = useAuthStore(selectSessionExpired)
  
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)
  const clearTokens = useAuthStore((state) => state.clearTokens)
  const refresh = useAuthStore((state) => state.refresh)
  const silentRefresh = useAuthStore((state) => state.silentRefresh)
  const logout = useAuthStore((state) => state.logout)
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired)
  const fetchAndSetUser = useAuthStore((state) => state.fetchAndSetUser)
  
  /**
   * Check if the token is valid (not expired with buffer)
   */
  const isTokenValid = useCallback(() => {
    const expiresAt = useAuthStore.getState().expiresAt
    if (!accessToken || !expiresAt) return false
    // Consider invalid if expiring within 10 seconds
    return expiresAt > Date.now() + 10000
  }, [accessToken])

  return {
    // State
    isAuthenticated,
    user,
    accessToken,
    isRefreshing,
    sessionExpired,
    
    // Computed
    isTokenValid,
    
    // Actions
    setTokens,
    setUser,
    clearTokens,
    refresh,
    silentRefresh,
    logout,
    setSessionExpired,
    fetchAndSetUser,
  }
}
