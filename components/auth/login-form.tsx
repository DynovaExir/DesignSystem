"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LanguageSwitcher } from "./language-switcher"
import { LogoutBanner } from "./logout-banner"
import { LoadingState } from "./loading-state"
import { useLocale } from "@/hooks/use-locale"
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  storePkceParams,
} from "@/lib/auth/pkce"
import { buildAuthorizationUrl } from "@/lib/auth/config"

interface LoginFormProps {
  loggedOut?: boolean
  returnUrl?: string
}

export function LoginForm({ loggedOut = false, returnUrl }: LoginFormProps) {
  const { t, dir } = useLocale()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = useCallback(async () => {
    setIsLoading(true)

    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const state = generateState()
      const nonce = generateNonce()

      // Store in sessionStorage for callback validation
      storePkceParams({
        codeVerifier,
        state,
        nonce,
        returnUrl,
      })

      // Build and redirect to authorization URL
      const authUrl = buildAuthorizationUrl({
        codeChallenge,
        state,
        nonce,
        returnUrl,
      })

      // In a real app, this would redirect to Keycloak
      // For demo, we simulate the redirect with a mock authorization code
      const mockCode = "mock_authorization_code_" + Date.now()
      const callbackUrl = `/auth/callback?code=${mockCode}&state=${state}`
      
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      window.location.href = callbackUrl
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }, [returnUrl])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-12">
          <LoadingState />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {loggedOut && <LogoutBanner />}
      
      <Card>
        <CardHeader className="text-center relative">
          {/* Language switcher positioned at top-end */}
          <div className="absolute top-4 end-4">
            <LanguageSwitcher />
          </div>
          
          {/* Logo */}
          <div className="flex justify-center mb-4 pt-4">
            <Image
              src="/images/dynova-logo.jpg"
              alt="Dynova"
              width={80}
              height={80}
              className="rounded-xl"
              priority
            />
          </div>
          
          <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button
            onClick={handleLogin}
            className="w-full"
            size="default"
          >
            <LogIn className={dir === "rtl" ? "rtl-flip" : ""} />
            {t("login.button")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
