import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore, selectExpiresAt, selectIsAuthenticated } from '@/stores'

const REFRESH_BUFFER = 60 * 1000 // Refresh 60 seconds before expiry
const CHANNEL_NAME = 'dynova_auth'

/**
 * Auto-refresh scheduler hook
 * Schedules token refresh before expiration
 * Coordinates with other tabs via BroadcastChannel
 */
export function useAutoRefresh() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const expiresAt = useAuthStore(selectExpiresAt)
  const refresh = useAuthStore((state) => state.refresh)
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  /**
   * Clear any scheduled refresh
   */
  const clearScheduledRefresh = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  /**
   * Schedule a refresh at the appropriate time
   */
  const scheduleRefresh = useCallback(() => {
    clearScheduledRefresh()
    
    if (!expiresAt) return
    
    const now = Date.now()
    const refreshAt = expiresAt - REFRESH_BUFFER
    const delay = Math.max(0, refreshAt - now)
    
    console.log('[useAutoRefresh] Scheduling refresh in', Math.round(delay / 1000), 'seconds')
    
    timeoutRef.current = setTimeout(async () => {
      console.log('[useAutoRefresh] Executing scheduled refresh')
      const success = await refresh()
      
      if (success && channelRef.current) {
        // Broadcast to other tabs
        channelRef.current.postMessage({ type: 'token-refreshed' })
      }
    }, delay)
  }, [expiresAt, refresh, clearScheduledRefresh])

  /**
   * Initialize BroadcastChannel and schedule refresh
   */
  useEffect(() => {
    if (!isAuthenticated) {
      clearScheduledRefresh()
      return
    }

    // Create BroadcastChannel if not exists
    if (!channelRef.current && typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME)
    }

    scheduleRefresh()

    return () => {
      clearScheduledRefresh()
    }
  }, [isAuthenticated, expiresAt, scheduleRefresh, clearScheduledRefresh])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearScheduledRefresh()
      if (channelRef.current) {
        channelRef.current.close()
        channelRef.current = null
      }
    }
  }, [clearScheduledRefresh])

  return {
    scheduleRefresh,
    clearScheduledRefresh,
  }
}
