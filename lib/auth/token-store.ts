/**
 * In-memory token storage (singleton)
 * 
 * SECURITY: Access tokens are NEVER stored in localStorage or sessionStorage.
 * They exist only in memory and are cleared on page refresh/close.
 * This follows OAuth 2.0 security best practices for SPAs.
 */

interface TokenData {
  accessToken: string
  expiresAt?: number
}

class TokenStore {
  private tokenData: TokenData | null = null

  /**
   * Store the access token in memory
   */
  setToken(accessToken: string, expiresIn?: number): void {
    this.tokenData = {
      accessToken,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    }
  }

  /**
   * Get the current access token
   * Returns null if token is expired or not set
   */
  getToken(): string | null {
    if (!this.tokenData) return null
    
    // Check if token is expired
    if (this.tokenData.expiresAt && Date.now() >= this.tokenData.expiresAt) {
      this.clearToken()
      return null
    }
    
    return this.tokenData.accessToken
  }

  /**
   * Clear the token from memory
   */
  clearToken(): void {
    this.tokenData = null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  /**
   * Get time until token expires (in seconds)
   */
  getExpiresIn(): number | null {
    if (!this.tokenData?.expiresAt) return null
    const remaining = Math.floor((this.tokenData.expiresAt - Date.now()) / 1000)
    return remaining > 0 ? remaining : null
  }
}

// Singleton instance
export const tokenStore = new TokenStore()
