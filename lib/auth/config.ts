/**
 * Authentication configuration
 * In production, these would come from environment variables
 */

export const AUTH_CONFIG = {
  // Mock Keycloak configuration (demo purposes)
  issuer: "https://auth.dynova.example.com/realms/dynova",
  clientId: "dynova-mdm-web",
  
  // OAuth endpoints (mocked in demo)
  authorizationEndpoint: "/api/auth/mock/authorize",
  tokenEndpoint: "/api/auth/mock/token",
  endSessionEndpoint: "/api/auth/mock/logout",
  
  // Redirect URIs
  redirectUri: typeof window !== "undefined" 
    ? `${window.location.origin}/auth/callback` 
    : "/auth/callback",
  postLogoutRedirectUri: typeof window !== "undefined"
    ? `${window.location.origin}/login?logged_out=1`
    : "/login?logged_out=1",
  
  // PKCE settings
  codeChallengeMethod: "S256" as const,
  responseType: "code" as const,
  scope: "openid profile email",
} as const

/**
 * Build authorization URL with PKCE parameters
 */
export function buildAuthorizationUrl(params: {
  codeChallenge: string
  state: string
  nonce: string
  returnUrl?: string
}): string {
  const searchParams = new URLSearchParams({
    response_type: AUTH_CONFIG.responseType,
    client_id: AUTH_CONFIG.clientId,
    redirect_uri: AUTH_CONFIG.redirectUri,
    scope: AUTH_CONFIG.scope,
    code_challenge: params.codeChallenge,
    code_challenge_method: AUTH_CONFIG.codeChallengeMethod,
    state: params.state,
    nonce: params.nonce,
  })
  
  if (params.returnUrl) {
    searchParams.set("return_url", params.returnUrl)
  }
  
  return `${AUTH_CONFIG.authorizationEndpoint}?${searchParams.toString()}`
}
