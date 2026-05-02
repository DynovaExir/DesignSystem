import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores'

const CHANNEL_NAME = 'dynova_auth'

interface AuthBroadcastMessage {
  type: 'token-refreshed' | 'session-expired'
  accessToken?: string
  expiresIn?: number
}

/**
 * Multi-tab coordination hook
 * Listens for auth events from other tabs and updates local state
 */
export function useBroadcastAuthSync() {
  const channelRef = useRef<BroadcastChannel | null>(null)
  
  const silentRefresh = useAuthStore((state) => state.silentRefresh)
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired)

  useEffect(() => {
    // BroadcastChannel might not be available in all environments
    if (typeof BroadcastChannel === 'undefined') {
      console.log('[useBroadcastAuthSync] BroadcastChannel not available')
      return
    }

    // Create channel
    channelRef.current = new BroadcastChannel(CHANNEL_NAME)
    console.log('[useBroadcastAuthSync] Listening on channel:', CHANNEL_NAME)

    // Handle messages from other tabs
    const handleMessage = async (event: MessageEvent<AuthBroadcastMessage>) => {
      const { type } = event.data
      console.log('[useBroadcastAuthSync] Received message:', type)

      switch (type) {
        case 'token-refreshed':
          // Another tab refreshed the token, do a silent refresh to get the new token
          // This will use the cookie-based session to get a fresh access token
          console.log('[useBroadcastAuthSync] Token refreshed in another tab, syncing...')
          await silentRefresh()
          break

        case 'session-expired':
          // Session expired in another tab, show expired modal
          console.log('[useBroadcastAuthSync] Session expired in another tab')
          setSessionExpired(true)
          break

        default:
          console.log('[useBroadcastAuthSync] Unknown message type:', type)
      }
    }

    channelRef.current.addEventListener('message', handleMessage)

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage)
        channelRef.current.close()
        channelRef.current = null
      }
    }
  }, [silentRefresh, setSessionExpired])

  /**
   * Broadcast token refreshed event to other tabs
   */
  const broadcastTokenRefreshed = () => {
    if (channelRef.current) {
      console.log('[useBroadcastAuthSync] Broadcasting token-refreshed')
      channelRef.current.postMessage({ type: 'token-refreshed' })
    }
  }

  /**
   * Broadcast session expired event to other tabs
   */
  const broadcastSessionExpired = () => {
    if (channelRef.current) {
      console.log('[useBroadcastAuthSync] Broadcasting session-expired')
      channelRef.current.postMessage({ type: 'session-expired' })
    }
  }

  return {
    broadcastTokenRefreshed,
    broadcastSessionExpired,
  }
}
