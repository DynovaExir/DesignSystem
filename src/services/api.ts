/**
 * Mock API service
 * All fetch calls simulate network latency and log to console
 * Replace with real endpoints later
 */

import type { OIDCConfig, TokenResponse, SessionMetadata } from './types'

const MOCK_DELAY = 200 // ms

/**
 * Simulate network delay
 */
function delay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if we should simulate an expired session
 * Add ?simulateExpired=true to any API call to force 401
 */
function shouldSimulateExpired(): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('simulateExpired') === 'true'
  }
  return false
}

/**
 * GET /api/v1/auth/.well-known/config
 * Fetches public OIDC configuration
 */
export async function fetchOIDCConfig(): Promise<OIDCConfig> {
  console.log('[API] GET /api/v1/auth/.well-known/config')
  await delay()
  
  const config: OIDCConfig = {
    issuer: 'https://mock-keycloak/realms/dynova',
    client_id: 'dynova-public',
    authorization_endpoint: 'https://mock-keycloak/realms/dynova/protocol/openid-connect/auth',
    pkce: true,
  }
  
  console.log('[API] OIDC Config response:', config)
  return config
}

/**
 * POST /api/v1/auth/token
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(params: {
  code: string
  code_verifier: string
  redirect_uri: string
}): Promise<TokenResponse> {
  console.log('[API] POST /api/v1/auth/token', params)
  await delay()
  
  if (shouldSimulateExpired()) {
    console.log('[API] Simulating 401 Unauthorized')
    throw new APIError(401, 'Session expired')
  }
  
  const response: TokenResponse = {
    access_token: `mock.jwt.token.${Date.now()}`,
    expires_in: 3600, // 1 hour
    refresh_token: `mock-refresh-${Date.now()}`,
    token_type: 'Bearer',
  }
  
  console.log('[API] Token response:', { ...response, access_token: '[REDACTED]' })
  return response
}

/**
 * POST /api/v1/auth/refresh
 * Refresh the access token using the session cookie
 */
export async function refreshToken(): Promise<TokenResponse> {
  console.log('[API] POST /api/v1/auth/refresh')
  await delay()
  
  if (shouldSimulateExpired()) {
    console.log('[API] Simulating 401 Unauthorized')
    throw new APIError(401, 'Session expired')
  }
  
  const response: TokenResponse = {
    access_token: `new.mock.jwt.${Date.now()}`,
    expires_in: 3600, // 1 hour
    token_type: 'Bearer',
  }
  
  console.log('[API] Refresh response:', { ...response, access_token: '[REDACTED]' })
  return response
}

/**
 * POST /api/v1/auth/logout
 * Logout and invalidate the session
 */
export async function logout(): Promise<{ success: boolean }> {
  console.log('[API] POST /api/v1/auth/logout')
  await delay()
  
  console.log('[API] Logout response: { success: true }')
  return { success: true }
}

/**
 * GET /api/v1/me
 * Get current user info and session metadata
 */
export async function fetchCurrentUser(): Promise<SessionMetadata> {
  console.log('[API] GET /api/v1/me')
  await delay()
  
  if (shouldSimulateExpired()) {
    console.log('[API] Simulating 401 Unauthorized')
    throw new APIError(401, 'Session expired')
  }
  
  const response: SessionMetadata = {
    user: {
      id: 'u1',
      username: 'user1',
      email: 'user@example.com',
      roles: ['read_only'],
      tenantIds: ['t1'],
    },
    idle_expires_at: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    absolute_expires_at: Date.now() + 8 * 3600 * 1000, // 8 hours from now
  }
  
  console.log('[API] Me response:', response)
  return response
}

/**
 * Build Keycloak end-session URL
 */
export function buildEndSessionUrl(issuer: string, postLogoutRedirectUri: string): string {
  const params = new URLSearchParams({
    post_logout_redirect_uri: postLogoutRedirectUri,
  })
  
  // For mock, just return the redirect URL directly
  // In production, this would be: `${issuer}/protocol/openid-connect/logout?${params}`
  console.log('[API] Building end session URL for:', issuer)
  
  return postLogoutRedirectUri
}

/**
 * Custom API error class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}
