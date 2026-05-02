import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from '@/locales'
import { useAuth } from '@/hooks'
import { exchangeCodeForTokens } from '@/services/api'
import { getPKCEState, clearPKCEState, validateState } from '@/services/pkce'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'

type CallbackState = 'processing' | 'invalid-state' | 'exchange-error' | 'success'

export function CallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setTokens, fetchAndSetUser } = useAuth()
  
  const [state, setState] = useState<CallbackState>('processing')
  const [errorDetails, setErrorDetails] = useState<string>('')

  const processCallback = useCallback(async () => {
    const code = searchParams.get('code')
    const returnedState = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Check for OAuth error
    if (error) {
      console.error('[Callback] OAuth error:', error, errorDescription)
      setState('exchange-error')
      setErrorDetails(errorDescription || error)
      return
    }

    // Validate required params
    if (!code || !returnedState) {
      console.error('[Callback] Missing code or state')
      setState('invalid-state')
      return
    }

    // Validate state
    if (!validateState(returnedState)) {
      console.error('[Callback] State mismatch')
      setState('invalid-state')
      return
    }

    const pkceState = getPKCEState()
    if (!pkceState) {
      console.error('[Callback] No PKCE state found')
      setState('invalid-state')
      return
    }

    try {
      // Exchange code for tokens
      const response = await exchangeCodeForTokens({
        code,
        code_verifier: pkceState.code_verifier,
        redirect_uri: `${window.location.origin}/auth/callback`,
      })

      // Store tokens in memory
      setTokens(response.access_token, response.expires_in)

      // Fetch user info
      await fetchAndSetUser()

      // Clear PKCE state
      clearPKCEState()

      setState('success')

      // Redirect to return URL
      const returnUrl = pkceState.return_url || '/'
      console.log('[Callback] Redirecting to:', returnUrl)
      navigate(returnUrl, { replace: true })
    } catch (error) {
      console.error('[Callback] Token exchange error:', error)
      setState('exchange-error')
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error')
    }
  }, [searchParams, setTokens, fetchAndSetUser, navigate])

  useEffect(() => {
    processCallback()
  }, [processCallback])

  if (state === 'processing' || state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Spinner size="lg" />
            <p className="text-muted-foreground">{t.auth.callback.exchangingCode}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === 'invalid-state') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>{t.auth.callback.invalidState}</CardTitle>
            <CardDescription>{t.auth.callback.invalidStateMessage}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link to="/login">{t.auth.callback.backToLogin}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // exchange-error
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{t.auth.callback.exchangeError}</CardTitle>
          <CardDescription>
            {t.auth.callback.exchangeErrorMessage}
            {errorDetails && (
              <span className="block mt-2 text-xs text-destructive">
                {errorDetails}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link to="/login">{t.auth.callback.backToLogin}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
