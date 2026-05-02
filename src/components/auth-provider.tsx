import { type ReactNode } from 'react'
import { useAutoRefresh, useBroadcastAuthSync } from '@/hooks'
import { SessionTimeoutBanner } from './session-timeout-banner'
import { SessionExpiredModal } from './session-expired-modal'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth provider component that wraps the app with auth-related functionality
 * - Auto-refresh scheduler
 * - Multi-tab sync
 * - Session timeout banner
 * - Session expired modal
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auto-refresh scheduler
  useAutoRefresh()
  
  // Initialize multi-tab sync
  useBroadcastAuthSync()

  return (
    <>
      {/* Session timeout warning banner */}
      <SessionTimeoutBanner />
      
      {/* Main content */}
      {children}
      
      {/* Session expired modal (blocking) */}
      <SessionExpiredModal />
    </>
  )
}
