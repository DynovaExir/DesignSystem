"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingState } from "./loading-state"
import { useLocale } from "@/hooks/use-locale"
import {
  retrievePkceParams,
  clearPkceParams,
  validateState,
  validateReturnUrl,
} from "@/lib/auth/pkce"
import { exchangeCode, AuthError } from "@/lib/auth/api"
import { tokenStore } from "@/lib/auth/token-store"

type CallbackStatus = "loading" | "error" | "success"

interface ErrorState {
  code: string
  message: string
}

export function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLocale()
  const [status, setStatus] = useState<CallbackStatus>("loading")
  const [error, setError] = useState<ErrorState | null>(null)

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get authorization code and state from URL
        const code = searchParams.get("code")
        const receivedState = searchParams.get("state")
        const errorParam = searchParams.get("error")

        // Handle OAuth error response
        if (errorParam) {
          throw new AuthError(
            errorParam,
            searchParams.get("error_description") || t("errors.generic")
          )
        }

        // Validate required parameters
        if (!code || !receivedState) {
          throw new AuthError("missing_params", t("errors.generic"))
        }

        // Retrieve stored PKCE parameters
        const pkceParams = retrievePkceParams()
        
        if (!pkceParams.state || !pkceParams.codeVerifier) {
          throw new AuthError("missing_pkce", t("errors.generic"))
        }

        // Validate state parameter (CSRF protection)
        if (!validateState(pkceParams.state, receivedState)) {
          throw new AuthError("state_mismatch", t("errors.stateMismatch"))
        }

        // Exchange authorization code for tokens
        const tokenResponse = await exchangeCode(code, pkceParams.codeVerifier)

        // Store access token in memory only
        tokenStore.setToken(tokenResponse.access_token, tokenResponse.expires_in)

        // Determine redirect URL
        let redirectUrl = "/"
        if (pkceParams.returnUrl && validateReturnUrl(pkceParams.returnUrl)) {
          redirectUrl = pkceParams.returnUrl
        }

        // Clear PKCE parameters
        clearPkceParams()

        // Set success and redirect
        setStatus("success")
        router.replace(redirectUrl)
      } catch (err) {
        console.error("Callback error:", err)
        
        if (err instanceof AuthError) {
          setError({ code: err.code, message: err.message })
        } else {
          setError({ code: "unknown", message: t("errors.generic") })
        }
        
        setStatus("error")
        clearPkceParams()
      }
    }

    handleCallback()
  }, [searchParams, router, t])

  if (status === "error" && error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("errors.tokenExchange")}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">{t("errors.backToLogin")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-12">
        <LoadingState />
      </CardContent>
    </Card>
  )
}
