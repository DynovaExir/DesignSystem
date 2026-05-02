import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from '@/locales'
import { fetchOIDCConfig } from '@/services/api'
import { buildAuthorizationUrl } from '@/services/pkce'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { LanguageSwitcher } from '@/components/language-switcher'
import { CheckCircle } from 'lucide-react'

export function LoginPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showLoggedOutBanner, setShowLoggedOutBanner] = useState(false)

  // Check for logged_out query param
  useEffect(() => {
    if (searchParams.get('logged_out') === '1') {
      setShowLoggedOutBanner(true)
      
      // Auto-dismiss after 5 seconds
      const timeout = setTimeout(() => {
        setShowLoggedOutBanner(false)
      }, 5000)
      
      return () => clearTimeout(timeout)
    }
  }, [searchParams])

  const handleLogin = useCallback(async () => {
    setIsLoading(true)
    
    try {
      // Fetch OIDC configuration
      const config = await fetchOIDCConfig()
      
      // Get the return URL from query params or default to home
      const returnUrl = searchParams.get('return_url') || '/'
      
      // Build authorization URL with PKCE
      const authUrl = await buildAuthorizationUrl({
        authorization_endpoint: config.authorization_endpoint,
        client_id: config.client_id,
        redirect_uri: `${window.location.origin}/auth/callback`,
        return_url: returnUrl,
      })
      
      console.log('[Login] Redirecting to:', authUrl)
      
      // For mock, redirect to callback with mock params
      // In production, this would redirect to Keycloak
      const mockCallbackUrl = `/auth/callback?code=mock-auth-code&state=${new URLSearchParams(authUrl.split('?')[1]).get('state')}`
      window.location.href = mockCallbackUrl
    } catch (error) {
      console.error('[Login] Error initiating login:', error)
      setIsLoading(false)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar with language switcher */}
      <header className="flex justify-end p-4">
        <LanguageSwitcher />
      </header>

      {/* Logged out success banner */}
      {showLoggedOutBanner && (
        <div className="fixed top-4 inset-x-4 z-50 flex justify-center">
          <Alert variant="success" className="max-w-md">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {t.auth.login.loggedOutSuccess}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {/* Logo placeholder */}
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <CardTitle>{t.auth.login.title}</CardTitle>
            <CardDescription>{t.auth.login.subtitle}</CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Spinner size="lg" />
                <p className="text-muted-foreground">{t.auth.login.redirecting}</p>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="w-full"
                size="lg"
              >
                {t.auth.login.signInWithKeycloak}
              </Button>
            )}
          </CardContent>
          
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Powered by Dynova
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
