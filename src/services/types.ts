/**
 * Types for authentication services
 */

export interface OIDCConfig {
  issuer: string
  client_id: string
  authorization_endpoint: string
  pkce: boolean
}

export interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  token_type?: string
}

export interface User {
  id: string
  username: string
  email: string
  roles: string[]
  tenantIds: string[]
}

export interface SessionMetadata {
  user: User
  idle_expires_at: number
  absolute_expires_at: number
}

export interface AuthError {
  error: string
  error_description?: string
}
