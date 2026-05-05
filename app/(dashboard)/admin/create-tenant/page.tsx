"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Users,
  Settings,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Dynova Create Tenant Wizard
 * Multi-step wizard for creating new tenants
 * Persian-only UI
 */

interface TenantFormData {
  // Step 1: Basic Info
  name: string
  slug: string
  description: string
  industry: string
  // Step 2: Admin User
  adminName: string
  adminEmail: string
  adminRole: string
  // Step 3: Settings
  language: string
  timezone: string
  fiscalYearStart: string
}

const industries = [
  { value: "finance", label: "مالی و بانکداری" },
  { value: "manufacturing", label: "تولید و صنعت" },
  { value: "healthcare", label: "بهداشت و درمان" },
  { value: "retail", label: "خرده‌فروشی" },
  { value: "technology", label: "فناوری اطلاعات" },
  { value: "government", label: "دولتی" },
  { value: "other", label: "سایر" },
]

const timezones = [
  { value: "Asia/Tehran", label: "تهران (ایران)" },
  { value: "Asia/Dubai", label: "دبی (امارات)" },
  { value: "Europe/London", label: "لندن (انگلستان)" },
]

const steps = [
  { id: 1, title: "اطلاعات پایه", icon: Building2 },
  { id: 2, title: "مدیر اصلی", icon: Users },
  { id: 3, title: "تنظیمات", icon: Settings },
  { id: 4, title: "تأیید نهایی", icon: FileCheck },
]

export default function CreateTenantPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<TenantFormData>({
    name: "",
    slug: "",
    description: "",
    industry: "",
    adminName: "",
    adminEmail: "",
    adminRole: "tenant-admin",
    language: "fa",
    timezone: "Asia/Tehran",
    fiscalYearStart: "1",
  })

  const updateFormData = (updates: Partial<TenantFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/admin/tenants")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.slug && formData.industry
      case 2:
        return formData.adminName && formData.adminEmail
      case 3:
        return true
      default:
        return true
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">ایجاد مستأجر جدید</h1>
        <p className="text-muted-foreground">
          با پر کردن اطلاعات زیر، یک سازمان جدید در پلتفرم ایجاد کنید
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isCurrent && "border-primary text-primary",
                      !isCompleted && !isCurrent && "border-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "اطلاعات اصلی سازمان را وارد کنید"}
            {currentStep === 2 && "مشخصات مدیر اصلی سازمان را تعیین کنید"}
            {currentStep === 3 && "تنظیمات پیش‌فرض سازمان را مشخص کنید"}
            {currentStep === 4 && "اطلاعات وارد شده را مرور و تأیید کنید"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام سازمان *</Label>
                <Input
                  id="name"
                  placeholder="مثال: شرکت توسعه نرم‌افزار پارسیان"
                  value={formData.name}
                  onChange={(e) => {
                    updateFormData({
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">شناسه یکتا *</Label>
                <Input
                  id="slug"
                  placeholder="persian-software-dev"
                  value={formData.slug}
                  onChange={(e) => updateFormData({ slug: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
                <p className="text-xs text-muted-foreground">
                  این شناسه در آدرس‌های اینترنتی استفاده می‌شود
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">صنعت *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => updateFormData({ industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="صنعت سازمان را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  placeholder="توضیحات کوتاه درباره سازمان (اختیاری)"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Admin User */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Alert variant="info">
                <AlertDescription>
                  این کاربر به عنوان مدیر اصلی سازمان تعیین می‌شود و می‌تواند سایر کاربران را مدیریت کند.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="adminName">نام و نام خانوادگی *</Label>
                <Input
                  id="adminName"
                  placeholder="نام کامل مدیر"
                  value={formData.adminName}
                  onChange={(e) => updateFormData({ adminName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">ایمیل *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.adminEmail}
                  onChange={(e) => updateFormData({ adminEmail: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
                <p className="text-xs text-muted-foreground">
                  لینک فعال‌سازی حساب به این ایمیل ارسال می‌شود
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">منطقه زمانی</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => updateFormData({ timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">شروع سال مالی</Label>
                <Select
                  value={formData.fiscalYearStart}
                  onValueChange={(value) => updateFormData({ fiscalYearStart: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">فروردین</SelectItem>
                    <SelectItem value="4">تیر</SelectItem>
                    <SelectItem value="7">مهر</SelectItem>
                    <SelectItem value="10">دی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">اطلاعات سازمان</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">نام:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">شناسه:</span>
                    <p className="font-medium" dir="ltr">{formData.slug}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">صنعت:</span>
                    <p className="font-medium">
                      {industries.find((i) => i.value === formData.industry)?.label}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">مدیر سازمان</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">نام:</span>
                    <p className="font-medium">{formData.adminName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ایمیل:</span>
                    <p className="font-medium" dir="ltr">{formData.adminEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">نقش:</span>
                    <Badge variant="secondary">مدیر مستأجر</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">تنظیمات</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">منطقه زمانی:</span>
                    <p className="font-medium">
                      {timezones.find((t) => t.value === formData.timezone)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowRight className="h-4 w-4 me-2" />
              مرحله قبل
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                مرحله بعد
                <ArrowLeft className="h-4 w-4 ms-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={isLoading}>
                <Check className="h-4 w-4 me-2" />
                ایجاد سازمان
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
