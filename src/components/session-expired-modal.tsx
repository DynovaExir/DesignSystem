import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from '@/locales'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export function SessionExpiredModal() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { sessionExpired, clearTokens } = useAuth()
  
  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Focus trap - keep focus within modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Prevent escape from closing - user must click button
    if (e.key === 'Escape') {
      e.preventDefault()
    }
  }, [])

  // Focus the button when modal opens
  useEffect(() => {
    if (sessionExpired) {
      buttonRef.current?.focus()
      document.addEventListener('keydown', handleKeyDown)
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [sessionExpired, handleKeyDown])

  const handleSignIn = () => {
    // Clear any stale tokens
    clearTokens()
    
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search)
    navigate(`/login?return_url=${returnUrl}`, { replace: true })
  }

  if (!sessionExpired) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-description"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            
            {/* Title */}
            <h2 
              id="session-expired-title"
              className="text-xl font-semibold mb-2"
            >
              {t.auth.sessionExpired.title}
            </h2>
            
            {/* Description */}
            <p 
              id="session-expired-description"
              className="text-muted-foreground mb-6"
            >
              {t.auth.sessionExpired.message}
            </p>
            
            {/* Action */}
            <Button
              ref={buttonRef}
              onClick={handleSignIn}
              className="w-full"
              size="lg"
            >
              {t.auth.sessionExpired.signInAgain}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
