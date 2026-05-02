/**
 * Mock authentication API client
 * Simulates Keycloak responses for demo purposes
 */

import { AUTH_CONFIG } from "./config"

interface TokenResponse {
  access_token: string
  token_type: "Bearer"
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope: string
}

/**
 * Exchange authorization code for tokens (mock implementation)
 * In production, this would call the actual Keycloak token endpoint
 */
export async function exchangeCode(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  // Validate code and verifier (mock validation)
  if (!code || !codeVerifier) {
    throw new AuthError("invalid_grant", "Missing code or code_verifier")
  }
  
  // Generate mock tokens
  const mockAccessToken = generateMockJwt({
    sub: "user-123",
    name: "کاربر نمونه",
    email: "user@dynova.example.com",
    preferred_username: "demo_user",
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    iat: Math.floor(Date.now() / 1000),
    iss: AUTH_CONFIG.issuer,
    aud: AUTH_CONFIG.clientId,
  })
  
  return {
    access_token: mockAccessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: AUTH_CONFIG.scope,
  }
}

/**
 * Perform logout (mock implementation)
 */
export async function performLogout(): Promise<void> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))
  // In production, this would call the Keycloak end_session_endpoint
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = "AuthError"
  }
}

/**
 * Generate a mock JWT (for demo purposes only)
 * In production, tokens come from the real authorization server
 */
function generateMockJwt(payload: Record<string, unknown>): string {
  const header = { alg: "RS256", typ: "JWT" }
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
  const mockSignature = "mock_signature_for_demo_only"
  
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`
}
