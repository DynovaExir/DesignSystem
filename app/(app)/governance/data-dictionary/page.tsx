"use client"

import { useState } from "react"
import {
  Database,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  FileText,
  Tag,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataEntity {
  id: string
  name: string
  technicalName: string
  domain: string
  model: string
  dataType: string
  description: string
  businessOwner: string
  status: "active" | "draft" | "deprecated"
  tags: string[]
  updatedAt: string
}

const entitiesData: DataEntity[] = [
  {
    id: "1",
    name: "شناسه مشتری",
    technicalName: "customer_id",
    domain: "مشتریان",
    model: "مشتری",
    dataType: "UUID",
    description: "شناسه یکتای مشتری در سیستم",
    businessOwner: "واحد CRM",
    status: "active",
    tags: ["کلید اصلی", "الزامی"],
    updatedAt: "۱۴۰۳/۰۹/۱۵",
  },
  {
    id: "2",
    name: "نام مشتری",
    technicalName: "customer_name",
    domain: "مشتریان",
    model: "مشتری",
    dataType: "String(100)",
    description: "نام کامل مشتری حقیقی یا حقوقی",
    businessOwner: "واحد CRM",
    status: "active",
    tags: ["الزامی", "قابل جستجو"],
    updatedAt: "۱۴۰۳/۰۹/۱۵",
  },
  {
    id: "3",
    name: "مانده حساب",
    technicalName: "account_balance",
    domain: "مالی",
    model: "حساب",
    dataType: "Decimal(18,2)",
    description: "مانده فعلی حساب به ریال",
    businessOwner: "واحد مالی",
    status: "active",
    tags: ["مالی", "محرمانه"],
    updatedAt: "۱۴۰۳/۰۹/۱۴",
  },
  {
    id: "4",
    name: "تاریخ ثبت‌نام",
    technicalName: "registration_date",
    domain: "مشتریان",
    model: "مشتری",
    dataType: "Date",
    description: "تاریخ ثبت‌نام اولیه مشتری",
    businessOwner: "واحد CRM",
    status: "active",
    tags: ["تاریخ"],
    updatedAt: "۱۴۰۳/۰۹/۱۳",
  },
  {
    id: "5",
    name: "کد محصول قدیم",
    technicalName: "legacy_product_code",
    domain: "محصولات",
    model: "محصول",
    dataType: "String(20)",
    description: "کد محصول در سیستم قدیمی - منسوخ شده",
    businessOwner: "واحد محصول",
    status: "deprecated",
    tags: ["منسوخ", "مهاجرت"],
    updatedAt: "۱۴۰۲/۰۶/۱۰",
  },
  {
    id: "6",
    name: "امتیاز ریسک",
    technicalName: "risk_score",
    domain: "ریسک",
    model: "ارزیابی ریسک",
    dataType: "Integer",
    description: "امتیاز ریسک مشتری از ۰ تا ۱۰۰",
    businessOwner: "واحد ریسک",
    status: "draft",
    tags: ["ریسک", "در حال توسعه"],
    updatedAt: "۱۴۰۳/۰۹/۱۰",
  },
]

const domainsData = [
  { id: "1", name: "مشتریان", entitiesCount: 25, modelsCount: 4 },
  { id: "2", name: "مالی", entitiesCount: 42, modelsCount: 8 },
  { id: "3", name: "محصولات", entitiesCount: 18, modelsCount: 3 },
  { id: "4", name: "ریسک", entitiesCount: 15, modelsCount: 2 },
  { id: "5", name: "منابع انسانی", entitiesCount: 30, modelsCount: 5 },
]

const statusLabels = {
  active: "فعال",
  draft: "پیش‌نویس",
  deprecated: "منسوخ",
}

const statusVariants = {
  active: "success" as const,
  draft: "warning" as const,
  deprecated: "secondary" as const,
}

export default function DataDictionaryPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")

  const filteredEntities = entitiesData.filter((entity) => {
    const matchesSearch =
      entity.name.includes(searchQuery) ||
      entity.technicalName.includes(searchQuery) ||
      entity.description.includes(searchQuery)
    const matchesDomain =
      selectedDomain === "all" || entity.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full mb-3" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            دیکشنری داده
          </h1>
          <p className="text-sm text-muted-foreground">
            مدیریت تعاریف و متادیتای داده‌های سازمانی
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 me-2" />
          موجودیت جدید
        </Button>
      </div>

      {/* Domain Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {domainsData.map((domain) => (
          <Card
            key={domain.id}
            className={`cursor-pointer transition-colors hover:border-primary ${
              selectedDomain === domain.name ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() =>
              setSelectedDomain(
                selectedDomain === domain.name ? "all" : domain.name
              )
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-5 w-5 text-primary" />
                {selectedDomain === domain.name && (
                  <Badge variant="secondary" className="text-xs">
                    فعال
                  </Badge>
                )}
              </div>
              <h3 className="font-medium text-sm">{domain.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {domain.entitiesCount} موجودیت · {domain.modelsCount} مدل
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">موجودیت‌ها</TabsTrigger>
          <TabsTrigger value="models">مدل‌ها</TabsTrigger>
          <TabsTrigger value="lineage">تبارنامه داده</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجوی نام، نام فنی یا توضیحات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="deprecated">منسوخ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="نوع داده" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="integer">Integer</SelectItem>
                      <SelectItem value="decimal">Decimal</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="uuid">UUID</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entities Table */}
          <Card>
            <CardContent className="p-0">
              {filteredEntities.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Database}
                    title="موجودیتی یافت نشد"
                    description="با معیارهای جستجوی فعلی هیچ موجودیتی یافت نشد."
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام موجودیت</TableHead>
                      <TableHead>نام فنی</TableHead>
                      <TableHead>دامین / مدل</TableHead>
                      <TableHead>نوع داده</TableHead>
                      <TableHead>مالک کسب‌وکار</TableHead>
                      <TableHead>برچسب‌ها</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.map((entity) => (
                      <TableRow key={entity.id}>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {entity.name}
                                  </span>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <p>{entity.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                              {entity.technicalName}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  entity.technicalName
                                )
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{entity.domain}</div>
                            <div className="text-xs text-muted-foreground">
                              {entity.model}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {entity.dataType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {entity.businessOwner}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entity.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                <Tag className="h-3 w-3 me-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[entity.status]}>
                            {statusLabels[entity.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 me-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 me-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 me-2" />
                                مستندات
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 me-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <Card>
            <CardContent className="p-8">
              <EmptyState
                icon={Database}
                title="مدل‌های داده"
                description="مدیریت مدل‌های داده به زودی در دسترس خواهد بود."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineage" className="mt-4">
          <Card>
            <CardContent className="p-8">
              <EmptyState
                icon={Database}
                title="تبارنامه داده"
                description="نمایش گرافیکی تبارنامه داده به زودی در دسترس خواهد بود."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
