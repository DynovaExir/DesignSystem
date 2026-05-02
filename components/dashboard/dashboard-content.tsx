"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSwitcher } from "@/components/auth/language-switcher"
import { useLocale } from "@/hooks/use-locale"
import { useAuth } from "@/hooks/use-auth"

export function DashboardContent() {
  const router = useRouter()
  const { t, dir } = useLocale()
  const { isAuthenticated, logout } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  // Show nothing while checking auth / redirecting
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/dynova-logo.jpg"
              alt="Dynova"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg">Dynova MDM</span>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={logout}>
              <LogOut className={dir === "rtl" ? "rtl-flip" : ""} />
              <span className="hidden sm:inline">{t("dashboard.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#e9f9ef] flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#0e7732]" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t("dashboard.welcome")}</CardTitle>
            <CardDescription>{t("dashboard.welcomeMessage")}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="info">
              <AlertDescription>
                {dir === "rtl" 
                  ? "این یک صفحه نمونه برای نمایش جریان احراز هویت است. در محیط واقعی، داشبورد مدیریت دستگاه‌ها در اینجا نمایش داده می‌شود."
                  : "This is a demo page showing the authentication flow. In production, the device management dashboard would be displayed here."
                }
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary">۱۲۵</div>
                <div className="text-sm text-muted-foreground">
                  {dir === "rtl" ? "دستگاه‌های فعال" : "Active Devices"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary">۹۸٪</div>
                <div className="text-sm text-muted-foreground">
                  {dir === "rtl" ? "نرخ آنلاین" : "Online Rate"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
