"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLocale } from "@/hooks/use-locale"
import { cn } from "@/lib/utils"

interface LogoutBannerProps {
  className?: string
}

/**
 * Logout confirmation banner
 * Auto-dismisses after 5 seconds per spec
 */
export function LogoutBanner({ className }: LogoutBannerProps) {
  const { t } = useLocale()
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 4500)

    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <Alert
      variant="success"
      className={cn(
        "transition-opacity duration-500",
        fading && "opacity-0",
        className
      )}
    >
      <CheckCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{t("login.loggedOut")}</span>
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-full hover:bg-[#0e7732]/10 transition-colors"
          aria-label={t("a11y.closeAlert")}
        >
          <X className="h-4 w-4" />
        </button>
      </AlertDescription>
    </Alert>
  )
}
