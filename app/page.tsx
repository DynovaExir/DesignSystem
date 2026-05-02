import { Suspense } from "react"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
