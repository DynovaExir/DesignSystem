import { useTranslation } from '@/locales'
import { useTimeoutBanner } from '@/hooks'
import { formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Clock, X } from 'lucide-react'

export function SessionTimeoutBanner() {
  const { t, locale, isRTL } = useTranslation()
  const { showBanner, secondsRemaining, extendSession, dismissBanner } = useTimeoutBanner()

  if (!showBanner) {
    return null
  }

  const formattedTime = formatTime(secondsRemaining, locale)

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed ${isRTL ? 'bottom-0' : 'top-0'} inset-x-0 z-40 bg-warning text-warning-foreground`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">
            {t.auth.sessionBanner.expiresIn}{' '}
            <span className="font-bold tabular-nums">{formattedTime}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={extendSession}
            className="bg-warning-foreground/10 hover:bg-warning-foreground/20 text-warning-foreground"
          >
            {t.auth.sessionBanner.staySignedIn}
          </Button>
          
          <button
            onClick={dismissBanner}
            className="p-1 hover:bg-warning-foreground/10 rounded"
            aria-label={t.common.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
