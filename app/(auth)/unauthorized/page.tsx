"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, ArrowRight, Mail, Home } from "lucide-react"

/**
 * Dynova 403 Unauthorized Page
 * Based on FEAT-001-03 specifications:
 * - Persian explanation
 * - Return to dashboard button
 * - Contact admin link
 */

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">دسترسی غیرمجاز</CardTitle>
            <CardDescription className="text-base">
              کد خطا: ۴۰۳
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              متأسفانه شما مجوز دسترسی به این بخش را ندارید. این محدودیت بر اساس
              نقش کاربری شما در سیستم اعمال شده است.
            </p>

            <div className="rounded-lg bg-muted/50 p-4 text-sm text-right">
              <p className="font-semibold mb-2">دلایل احتمالی:</p>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                <li>نقش فعلی شما اجازه دسترسی به این صفحه را ندارد</li>
                <li>مجوزهای لازم به نقش شما اختصاص داده نشده است</li>
                <li>دسترسی شما توسط مدیر سیستم محدود شده است</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="h-4 w-4 me-2" />
                  بازگشت به داشبورد
                </Link>
              </Button>
              
              <Button variant="secondary" asChild className="w-full">
                <Link href="mailto:admin@company.com">
                  <Mail className="h-4 w-4 me-2" />
                  تماس با مدیر سیستم
                </Link>
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/select-tenant">
                  <ArrowRight className="h-4 w-4 me-2" />
                  تغییر سازمان
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground">
          اگر فکر می‌کنید این یک خطا است، لطفاً با پشتیبانی تماس بگیرید
        </p>
      </div>
    </div>
  )
}
