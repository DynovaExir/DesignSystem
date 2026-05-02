"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingState } from "@/components/auth/loading-state"

/**
 * Logout page - clears tokens and redirects to login
 * Can be linked to directly for explicit logout
 */
export default function LogoutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    // Perform logout on mount
    logout()
  }, [logout])

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-12">
          <LoadingState />
        </CardContent>
      </Card>
    </main>
  )
}
