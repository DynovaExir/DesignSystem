import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { useTranslation } from '@/locales'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isTokenValid, isRefreshing, silentRefresh } = useAuth()
  
  const [isChecking, setIsChecking] = useState(true)
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // If already authenticated with valid token, render children
      if (isAuthenticated && isTokenValid()) {
        setIsChecking(false)
        return
      }

      // If not authenticated or token invalid, try silent refresh
      if (!hasAttemptedRefresh) {
        setHasAttemptedRefresh(true)
        console.log('[ProtectedRoute] Attempting silent refresh')
        
        const success = await silentRefresh()
        
        if (success) {
          setIsChecking(false)
          return
        }
        
        // Refresh failed, redirect to login
        console.log('[ProtectedRoute] Silent refresh failed, redirecting to login')
        const returnUrl = encodeURIComponent(location.pathname + location.search)
        navigate(`/login?return_url=${returnUrl}`, { replace: true })
        return
      }
      
      // Already attempted refresh and failed
      const returnUrl = encodeURIComponent(location.pathname + location.search)
      navigate(`/login?return_url=${returnUrl}`, { replace: true })
    }

    checkAuth()
  }, [isAuthenticated, isTokenValid, hasAttemptedRefresh, silentRefresh, navigate, location])

  // Show loading while checking or refreshing
  if (isChecking || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Spinner size="lg" />
            <div className="text-center">
              <p className="font-medium">{t.auth.protectedRoute.restoring}</p>
              <p className="text-sm text-muted-foreground">{t.auth.protectedRoute.restoringSession}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Fallback loading state
  return null
}
