"use client"

import { useState } from "react"
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Activity,
  Database,
  Shield,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for dashboard
const stats = [
  {
    title: "واحدهای سازمانی",
    value: "۱۲",
    change: "+۲",
    changeType: "increase" as const,
    icon: Building2,
    description: "واحد فعال",
  },
  {
    title: "کاربران فعال",
    value: "۴۸",
    change: "+۵",
    changeType: "increase" as const,
    icon: Users,
    description: "کاربر در این ماه",
  },
  {
    title: "فرم‌های ارسالی",
    value: "۱۵۶",
    change: "+۲۳",
    changeType: "increase" as const,
    icon: FileText,
    description: "فرم در این دوره",
  },
  {
    title: "نرخ تکمیل",
    value: "٪۸۷",
    change: "+۴٪",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "بهبود نسبت به ماه قبل",
  },
]

const recentSubmissions = [
  {
    id: "SUB-001",
    title: "گزارش مالی فصل سوم",
    status: "تأیید شده",
    statusType: "success" as const,
    submitter: "علی محمدی",
    date: "۱۴۰۳/۰۹/۱۵",
    unit: "مالی",
  },
  {
    id: "SUB-002",
    title: "ارزیابی ریسک عملیاتی",
    status: "در انتظار بررسی",
    statusType: "warning" as const,
    submitter: "مریم احمدی",
    date: "۱۴۰۳/۰۹/۱۴",
    unit: "ریسک",
  },
  {
    id: "SUB-003",
    title: "داده‌های حاکمیتی Q3",
    status: "در حال بررسی",
    statusType: "info" as const,
    submitter: "رضا کریمی",
    date: "۱۴۰۳/۰۹/۱۳",
    unit: "IT",
  },
  {
    id: "SUB-004",
    title: "شاخص‌های کلیدی عملکرد",
    status: "رد شده",
    statusType: "error" as const,
    submitter: "سارا حسینی",
    date: "۱۴۰۳/۰۹/۱۲",
    unit: "منابع انسانی",
  },
  {
    id: "SUB-005",
    title: "گزارش انطباق",
    status: "پیش‌نویس",
    statusType: "default" as const,
    submitter: "امیر رضایی",
    date: "۱۴۰۳/۰۹/۱۱",
    unit: "انطباق",
  },
]

const quickActions = [
  { title: "ایجاد فرم جدید", icon: FileText, href: "/forms/new" },
  { title: "مشاهده گزارش‌ها", icon: BarChart3, href: "/reports" },
  { title: "مدیریت کاربران", icon: Users, href: "/admin/users" },
  { title: "تنظیمات امنیتی", icon: Shield, href: "/admin/security" },
]

const statusBadgeVariant = {
  success: "success",
  warning: "warning",
  error: "destructive",
  info: "secondary",
  default: "outline",
} as const

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">داشبورد</h1>
        <p className="text-sm text-muted-foreground">
          خلاصه وضعیت سامانه و آخرین فعالیت‌ها
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={
                    stat.changeType === "increase"
                      ? "text-success"
                      : "text-destructive"
                  }
                >
                  {stat.change}
                </span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Submissions Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>آخرین ارسال‌ها</CardTitle>
                <CardDescription>
                  فهرست ۵ ارسال اخیر در سامانه
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                مشاهده همه
                <ArrowLeft className="h-4 w-4 me-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شناسه</TableHead>
                  <TableHead>عنوان</TableHead>
                  <TableHead>واحد</TableHead>
                  <TableHead>ارسال‌کننده</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-xs">
                      {submission.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.title}
                    </TableCell>
                    <TableCell>{submission.unit}</TableCell>
                    <TableCell>{submission.submitter}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant[submission.statusType]}
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
            <CardDescription>
              عملیات پرکاربرد
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="w-full justify-start gap-3"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="h-4 w-4" />
                  {action.title}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
          <CardDescription>
            آخرین تغییرات و رویدادهای سامانه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: CheckCircle2,
                iconColor: "text-success",
                title: "گزارش مالی فصل سوم تأیید شد",
                description: "توسط مدیر مالی - علی اکبری",
                time: "۵ دقیقه پیش",
              },
              {
                icon: Users,
                iconColor: "text-primary",
                title: "کاربر جدید اضافه شد",
                description: "سمیرا رضوی - واحد منابع انسانی",
                time: "۲ ساعت پیش",
              },
              {
                icon: AlertCircle,
                iconColor: "text-warning",
                title: "هشدار انقضای دسترسی",
                description: "۳ کاربر نیاز به تمدید دسترسی دارند",
                time: "۳ ساعت پیش",
              },
              {
                icon: Database,
                iconColor: "text-muted-foreground",
                title: "بروزرسانی دیکشنری داده",
                description: "۱۵ فیلد جدید به مدل مالی اضافه شد",
                time: "دیروز",
              },
              {
                icon: Activity,
                iconColor: "text-primary",
                title: "چرخه ارسال EPM آغاز شد",
                description: "دوره گزارش‌دهی فصل چهارم",
                time: "۲ روز پیش",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div
                  className={`p-2 rounded-full bg-muted ${activity.iconColor}`}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
