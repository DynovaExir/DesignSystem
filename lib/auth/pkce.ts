/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0 authorization
 * Per RFC 7636 specification
 */

/**
 * Generate a cryptographically random code verifier (43-128 chars)
 * Using Web Crypto API for secure random generation
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate code challenge from verifier using S256 method
 * SHA-256 hash of verifier, base64url encoded
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return base64UrlEncode(new Uint8Array(digest))
}

/**
 * Generate cryptographically secure state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate nonce for replay protection
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Validate state parameter matches stored value (constant-time comparison)
 */
export function validateState(stored: string, received: string): boolean {
  if (stored.length !== received.length) return false
  
  let result = 0
  for (let i = 0; i < stored.length; i++) {
    result |= stored.charCodeAt(i) ^ received.charCodeAt(i)
  }
  return result === 0
}

/**
 * Validate return URL is same-origin (prevents open redirect)
 */
export function validateReturnUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.origin === window.location.origin
  } catch {
    return false
  }
}

/**
 * Base64url encode without padding
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Session storage keys
export const PKCE_KEYS = {
  CODE_VERIFIER: "dynova.pkce.code_verifier",
  STATE: "dynova.pkce.state",
  NONCE: "dynova.pkce.nonce",
  RETURN_URL: "dynova.pkce.return_url",
} as const

/**
 * Store PKCE parameters in sessionStorage before redirect
 */
export function storePkceParams(params: {
  codeVerifier: string
  state: string
  nonce: string
  returnUrl?: string
}): void {
  sessionStorage.setItem(PKCE_KEYS.CODE_VERIFIER, params.codeVerifier)
  sessionStorage.setItem(PKCE_KEYS.STATE, params.state)
  sessionStorage.setItem(PKCE_KEYS.NONCE, params.nonce)
  if (params.returnUrl) {
    sessionStorage.setItem(PKCE_KEYS.RETURN_URL, params.returnUrl)
  }
}

/**
 * Retrieve and clear PKCE parameters from sessionStorage
 */
export function retrievePkceParams(): {
  codeVerifier: string | null
  state: string | null
  nonce: string | null
  returnUrl: string | null
} {
  const params = {
    codeVerifier: sessionStorage.getItem(PKCE_KEYS.CODE_VERIFIER),
    state: sessionStorage.getItem(PKCE_KEYS.STATE),
    nonce: sessionStorage.getItem(PKCE_KEYS.NONCE),
    returnUrl: sessionStorage.getItem(PKCE_KEYS.RETURN_URL),
  }
  
  return params
}

/**
 * Clear all PKCE parameters from sessionStorage
 */
export function clearPkceParams(): void {
  Object.values(PKCE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key)
  })
}
