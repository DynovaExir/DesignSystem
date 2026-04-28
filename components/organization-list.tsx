"use client";

import { Building2, Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface OrganizationListProps {
  onAddOrganization: () => void;
  showStickyBar?: boolean;
  isEmpty?: boolean;
}

const sampleOrganizations = [
  {
    id: 1,
    name: "شرکت نمونه ایرانیان",
    shortName: "نمونه",
    type: "company",
    status: "active",
    nationalCode: "۱۰۱۰۱۲۳۴۵۶۷",
  },
  {
    id: 2,
    name: "هلدینگ توسعه پایدار",
    shortName: "توسعه",
    type: "holding",
    status: "active",
    nationalCode: "۱۰۱۰۹۸۷۶۵۴۳",
  },
  {
    id: 3,
    name: "شرکت فناوری اطلاعات آینده",
    shortName: "آینده",
    type: "company",
    status: "inactive",
    nationalCode: "۱۰۱۰۵۵۵۴۴۴۳",
  },
];

export function OrganizationList({
  onAddOrganization,
  showStickyBar = false,
  isEmpty = false,
}: OrganizationListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">مدیریت سازمان‌ها</h1>
        <Button variant="default" onClick={onAddOrganization}>
          <Plus className="h-4 w-4 ml-2" />
          افزودن سازمان
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در سازمان‌ها..."
            className="pr-10"
          />
        </div>
        <Button variant="tertiary">
          <Filter className="h-4 w-4 ml-2" />
          فیلترها
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              هنوز سازمانی ثبت نشده است
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              برای شروع، اولین سازمان خود را ایجاد کنید. می‌توانید شرکت یا هلدینگ
              بسازید.
            </p>
            <Button variant="default" onClick={onAddOrganization}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن سازمان
            </Button>
          </div>
        ) : (
          /* Organization Table */
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                    نام سازمان
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                    نوع
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                    شناسه ملی
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                    وضعیت
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 w-12">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleOrganizations.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {org.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {org.shortName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={org.type === "holding" ? "info" : "secondary"}>
                        {org.type === "holding" ? "هلدینگ" : "شرکت"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{org.nationalCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={org.status === "active" ? "success" : "secondary"}>
                        {org.status === "active" ? "فعال" : "غیرفعال"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar (for creation in progress) */}
      {showStickyBar && (
        <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-primary-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary p-2">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                تایید ساخت سازمان
              </p>
              <p className="text-xs text-muted-foreground">
                در حال ایجاد سازمان جدید هستید
              </p>
            </div>
          </div>
          <Button variant="default" onClick={onAddOrganization}>
            ادامه
          </Button>
        </div>
      )}
    </div>
  );
}
