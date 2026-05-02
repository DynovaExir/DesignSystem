/**
 * PKCE (Proof Key for Code Exchange) utilities
 * Used for secure OAuth 2.0 authorization code flow
 */

const PKCE_STORAGE_KEY = 'dynova_pkce_state'

interface PKCEState {
  code_verifier: string
  state: string
  nonce: string
  return_url: string
}

/**
 * Generate a cryptographically random string of specified length
 * Uses characters: A-Z, a-z, 0-9, -, _, .
 */
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.'
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  return Array.from(randomValues)
    .map((v) => charset[v % charset.length])
    .join('')
}

/**
 * Generate a code verifier for PKCE
 * Must be 43-128 characters, using unreserved URI characters
 */
export function generateCodeVerifier(): string {
  // Use 64 characters for good entropy
  return generateRandomString(64)
}

/**
 * Generate code challenge from code verifier using SHA-256
 * Returns base64url-encoded hash
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  
  // Convert to base64url encoding
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generate a random state parameter
 * Used to prevent CSRF attacks
 */
export function generateState(): string {
  return generateRandomString(32)
}

/**
 * Generate a random nonce
 * Used to associate a client session with an ID Token
 */
export function generateNonce(): string {
  return generateRandomString(32)
}

/**
 * Store PKCE parameters in sessionStorage
 * These are needed when handling the callback
 */
export function storePKCEState(params: PKCEState): void {
  sessionStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(params))
}

/**
 * Retrieve stored PKCE parameters from sessionStorage
 */
export function getPKCEState(): PKCEState | null {
  const stored = sessionStorage.getItem(PKCE_STORAGE_KEY)
  if (!stored) return null
  
  try {
    return JSON.parse(stored) as PKCEState
  } catch {
    return null
  }
}

/**
 * Clear stored PKCE parameters
 * Should be called after successful authentication or on logout
 */
export function clearPKCEState(): void {
  sessionStorage.removeItem(PKCE_STORAGE_KEY)
}

/**
 * Validate that the returned state matches the stored state
 */
export function validateState(returnedState: string): boolean {
  const stored = getPKCEState()
  if (!stored) return false
  return stored.state === returnedState
}

/**
 * Build the authorization URL for Keycloak
 */
export async function buildAuthorizationUrl(config: {
  authorization_endpoint: string
  client_id: string
  redirect_uri: string
  return_url: string
}): Promise<string> {
  const code_verifier = generateCodeVerifier()
  const code_challenge = await generateCodeChallenge(code_verifier)
  const state = generateState()
  const nonce = generateNonce()
  
  // Store PKCE parameters for callback
  storePKCEState({
    code_verifier,
    state,
    nonce,
    return_url: config.return_url,
  })
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    scope: 'openid profile email dynova.api',
    state,
    nonce,
    code_challenge,
    code_challenge_method: 'S256',
  })
  
  return `${config.authorization_endpoint}?${params.toString()}`
}
