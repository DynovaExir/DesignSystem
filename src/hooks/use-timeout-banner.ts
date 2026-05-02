import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore, selectIdleExpiresAt, selectIsAuthenticated } from '@/stores'
import { fetchCurrentUser } from '@/services/api'

const POLL_INTERVAL = 30 * 1000 // Poll every 30 seconds
const WARNING_THRESHOLD = 5 * 60 * 1000 // Show warning when <= 5 minutes remaining

/**
 * Session timeout banner hook
 * Polls for session metadata and shows warning banner when session is about to expire
 */
export function useTimeoutBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const idleExpiresAt = useAuthStore(selectIdleExpiresAt)
  const setSessionMetadata = useAuthStore((state) => state.setSessionMetadata)
  const refresh = useAuthStore((state) => state.refresh)
  
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /**
   * Poll for session metadata
   */
  const pollSessionMetadata = useCallback(async () => {
    try {
      const metadata = await fetchCurrentUser()
      setSessionMetadata(metadata.idle_expires_at, metadata.absolute_expires_at)
    } catch (error) {
      console.error('[useTimeoutBanner] Failed to poll session metadata:', error)
    }
  }, [setSessionMetadata])

  /**
   * Check if banner should be shown and update countdown
   */
  const updateBannerState = useCallback(() => {
    if (!idleExpiresAt) {
      setShowBanner(false)
      return
    }

    const remaining = idleExpiresAt - Date.now()
    
    if (remaining <= 0) {
      setShowBanner(false)
      setSecondsRemaining(0)
    } else if (remaining <= WARNING_THRESHOLD) {
      setShowBanner(true)
      setSecondsRemaining(Math.ceil(remaining / 1000))
    } else {
      setShowBanner(false)
      setSecondsRemaining(0)
    }
  }, [idleExpiresAt])

  /**
   * Handle "Stay signed in" button click
   */
  const extendSession = useCallback(async () => {
    console.log('[useTimeoutBanner] Extending session')
    const success = await refresh()
    if (success) {
      // Refresh metadata to get new expiry time
      await pollSessionMetadata()
      setShowBanner(false)
    }
  }, [refresh, pollSessionMetadata])

  /**
   * Dismiss banner manually
   */
  const dismissBanner = useCallback(() => {
    setShowBanner(false)
  }, [])

  /**
   * Setup polling interval
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear intervals when not authenticated
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      setShowBanner(false)
      return
    }

    // Initial poll
    pollSessionMetadata()

    // Start polling
    pollIntervalRef.current = setInterval(pollSessionMetadata, POLL_INTERVAL)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [isAuthenticated, pollSessionMetadata])

  /**
   * Setup countdown interval
   */
  useEffect(() => {
    // Update immediately
    updateBannerState()

    // Update every second when banner should be visible
    countdownIntervalRef.current = setInterval(updateBannerState, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
    }
  }, [updateBannerState])

  return {
    showBanner,
    secondsRemaining,
    extendSession,
    dismissBanner,
  }
}
