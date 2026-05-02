"use client"

import Image from "next/image"
import { Spinner } from "@/components/ui/spinner"
import { useLocale } from "@/hooks/use-locale"

/**
 * Branded loading state shown during auth redirects
 */
export function LoadingState() {
  const { t } = useLocale()

  return (
    <div
      className="flex flex-col items-center justify-center gap-6"
      role="status"
      aria-busy="true"
      aria-label={t("a11y.loading")}
    >
      <Image
        src="/images/dynova-logo.jpg"
        alt="Dynova"
        width={64}
        height={64}
        className="rounded-lg"
        priority
      />
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">
        {t("login.loading")}
      </p>
    </div>
  )
}
