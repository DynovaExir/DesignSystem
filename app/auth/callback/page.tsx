import { Suspense } from "react"
import { CallbackHandler } from "@/components/auth/callback-handler"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<CallbackSkeleton />}>
        <CallbackHandler />
      </Suspense>
    </main>
  )
}

function CallbackSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-12 flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )
}
