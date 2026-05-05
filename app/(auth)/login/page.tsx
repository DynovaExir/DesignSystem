"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { KeyRound } from "lucide-react"

/**
 * Dynova Login Page
 * Features:
 * - SSO/OIDC login option
 * - Email/password fallback
 * - Persian-only UI
 * - RTL layout
 */

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulate login - replace with actual auth logic
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // On success, redirect to tenant selection or dashboard
      router.push("/select-tenant")
    } catch {
      setError("خطا در ورود به سیستم. لطفاً اطلاعات خود را بررسی کنید.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = () => {
    setIsLoading(true)
    // Redirect to SSO provider (Keycloak)
    // window.location.href = "/api/auth/sso/keycloak"
    router.push("/select-tenant")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <span className="text-2xl font-semibold">د</span>
          </div>
          <h1 className="text-2xl font-semibold">داینووا</h1>
          <p className="mt-1 text-muted-foreground">
            پلتفرم مدیریت داده‌های اصلی سازمانی
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>ورود به حساب کاربری</CardTitle>
            <CardDescription>
              برای دسترسی به پلتفرم وارد حساب کاربری خود شوید
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="danger" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* SSO Login Button */}
            <Button
              variant="secondary"
              className="w-full mb-6"
              onClick={handleSSOLogin}
              disabled={isLoading}
            >
              <KeyRound className="h-4 w-4 me-2" />
              ورود با احراز هویت سازمانی
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  یا با ایمیل و رمز عبور
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  dir="ltr"
                  className="text-left"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">رمز عبور</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    فراموشی رمز عبور
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked === true })
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  مرا به خاطر بسپار
                </Label>
              </div>

              <Button type="submit" className="w-full" loading={isLoading}>
                ورود به سیستم
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          با ورود به سیستم، شما{" "}
          <Link href="/terms" className="text-primary hover:underline">
            شرایط استفاده
          </Link>{" "}
          و{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            سیاست حفظ حریم خصوصی
          </Link>{" "}
          را می‌پذیرید.
        </p>
      </div>
    </div>
  )
}
