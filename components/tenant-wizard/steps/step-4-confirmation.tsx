"use client";

import { Info, AlertTriangle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FormData {
  step1: {
    fullName: string;
    country: string;
    shortName: string;
    nationalCode: string;
    technicalName: string;
    tenantType: "company" | "holding" | null;
  };
  step2: {
    registrationType: string;
    registrationDate: string;
    tags: string[];
  };
  step3: {
    email: string;
    phone: string;
    website: string;
    logo: File | null;
    logoPreview: string;
    favicon: File | null;
    faviconPreview: string;
  };
}

interface Step4Props {
  formData: FormData;
  confirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  validationError?: string;
}

const countryLabels: Record<string, string> = {
  ir: "ایران",
  ae: "امارات",
  tr: "ترکیه",
  de: "آلمان",
};

const registrationTypeLabels: Record<string, string> = {
  private: "شرکت خصوصی",
  public: "شرکت سهامی عام",
  limited: "شرکت مسئولیت محدود",
  cooperative: "شرکت تعاونی",
};

export function Step4Confirmation({
  formData,
  confirmed,
  onConfirmChange,
  validationError,
}: Step4Props) {
  const { step1, step2, step3 } = formData;

  const summaryFields = [
    { label: "شناسه فنی", value: step1.technicalName || "-" },
    { label: "نام کامل", value: step1.fullName || "-" },
    { label: "عنوان کوتاه", value: step1.shortName || "-" },
    { label: "شناسه ملی", value: step1.nationalCode || "-" },
    { label: "کشور محل ثبت", value: countryLabels[step1.country] || "-" },
    {
      label: "نوع ثبتی",
      value: registrationTypeLabels[step2.registrationType] || "-",
    },
    { label: "تاریخ ثبت", value: step2.registrationDate || "-" },
    { label: "ایمیل", value: step3.email || "-" },
    { label: "شماره تماس", value: step3.phone || "-" },
    { label: "وب‌سایت", value: step3.website || "-" },
  ];

  return (
    <div className="space-y-6">
      {/* Validation Error Banner */}
      {validationError && (
        <div className="flex items-center gap-3 rounded-lg border border-danger-500 bg-danger-100 p-4">
          <AlertTriangle className="h-5 w-5 text-danger-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-danger-500">
              خطا در اعتبارسنجی
            </p>
            <p className="text-xs text-danger-500 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Header with Badge */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          تایید ساخت سازمان
        </h3>
        <Badge variant={step1.tenantType === "holding" ? "info" : "default"}>
          مدل سازمان: {step1.tenantType === "holding" ? "هلدینگ" : "شرکت"}
        </Badge>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4">
        {summaryFields.map((field) => (
          <div key={field.label} className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{field.label}</p>
            <p
              className={cn(
                "text-sm font-medium text-foreground",
                field.label === "شناسه فنی" && "font-mono text-left"
              )}
              dir={field.label === "شناسه فنی" ? "ltr" : "rtl"}
            >
              {field.value}
            </p>
          </div>
        ))}
      </div>

      {/* Initial Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          وضعیت اولیه سازمان بعد از ساخت
        </h4>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Switch checked={true} disabled className="data-[state=checked]:bg-success" />
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-success-500">فعال</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    سازمان پس از ساخت به صورت پیش‌فرض فعال خواهد بود و می‌توان آن
                    را غیرفعال کرد
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-warning-500 bg-warning-100 p-4">
        <AlertTriangle className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning-500">توجه</p>
          <p className="text-xs text-warning-500 mt-0.5">
            برخی از فیلدها مانند شناسه فنی پس از ساخت سازمان قابل تغییر نخواهند
            بود. لطفاً از صحت اطلاعات وارد شده اطمینان حاصل کنید.
          </p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
        <Checkbox
          id="confirm"
          checked={confirmed}
          onCheckedChange={(checked) => onConfirmChange(checked as boolean)}
        />
        <Label htmlFor="confirm" className="text-sm font-medium cursor-pointer">
          اطلاعات وارد شده را تایید می‌کنم
        </Label>
      </div>
    </div>
  );
}
