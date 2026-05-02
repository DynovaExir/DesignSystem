import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Skeleton } from "@/components/ui/skeleton"

interface LoginPageProps {
  searchParams: Promise<{
    logged_out?: string
    return_url?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const loggedOut = params.logged_out === "1"
  const returnUrl = params.return_url

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm loggedOut={loggedOut} returnUrl={returnUrl} />
      </Suspense>
    </main>
  )
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="rounded-lg bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-full mt-4" />
        </div>
      </div>
    </div>
  )
}
