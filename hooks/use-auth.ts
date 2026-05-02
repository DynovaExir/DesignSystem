"use client"

import { useCallback, useSyncExternalStore } from "react"
import { tokenStore } from "@/lib/auth/token-store"
import { performLogout } from "@/lib/auth/api"
import { clearPkceParams } from "@/lib/auth/pkce"
import { AUTH_CONFIG } from "@/lib/auth/config"

// Simple pub/sub for token changes
const subscribers = new Set<() => void>()

function subscribe(callback: () => void) {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}

function notifySubscribers() {
  subscribers.forEach((callback) => callback())
}

// Wrap tokenStore methods to notify subscribers
const originalSetToken = tokenStore.setToken.bind(tokenStore)
const originalClearToken = tokenStore.clearToken.bind(tokenStore)

tokenStore.setToken = (accessToken: string, expiresIn?: number) => {
  originalSetToken(accessToken, expiresIn)
  notifySubscribers()
}

tokenStore.clearToken = () => {
  originalClearToken()
  notifySubscribers()
}

export function useAuth() {
  // Subscribe to token changes using useSyncExternalStore
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    () => tokenStore.isAuthenticated(),
    () => false // Server snapshot
  )

  const logout = useCallback(async () => {
    try {
      await performLogout()
    } finally {
      tokenStore.clearToken()
      clearPkceParams()
      window.location.href = AUTH_CONFIG.postLogoutRedirectUri
    }
  }, [])

  return {
    isAuthenticated,
    logout,
    getToken: () => tokenStore.getToken(),
  }
}
