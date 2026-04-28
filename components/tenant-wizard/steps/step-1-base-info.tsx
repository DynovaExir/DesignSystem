"use client";

import { Info, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypeSelector } from "../type-selector";

interface Step1Data {
  fullName: string;
  country: string;
  shortName: string;
  nationalCode: string;
  technicalName: string;
  tenantType: "company" | "holding" | null;
}

interface ValidationState {
  fullName?: { error?: string; success?: boolean };
  shortName?: { error?: string; success?: boolean };
  nationalCode?: { error?: string; success?: boolean };
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  validation: ValidationState;
  onValidate?: (field: keyof ValidationState) => void;
}

const countries = [
  { value: "ir", label: "ایران" },
  { value: "ae", label: "امارات" },
  { value: "tr", label: "ترکیه" },
  { value: "de", label: "آلمان" },
];

export function Step1BaseInfo({ data, onChange, validation, onValidate }: Step1Props) {
  const updateField = <K extends keyof Step1Data>(
    field: K,
    value: Step1Data[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Base Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          مشخصات پایه
        </h3>

        {/* Row 1: Full Name + Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">نام کامل سازمان</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>نام رسمی و کامل سازمان طبق اسناد ثبتی</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                value={data.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                onBlur={() => onValidate?.("fullName")}
                placeholder="مثال: شرکت نمونه ایرانیان"
                className={cn(
                  "pl-10",
                  validation.fullName?.error &&
                    "border-danger-500 focus-visible:ring-danger-500",
                  validation.fullName?.success &&
                    !validation.fullName?.error &&
                    "border-success-500"
                )}
              />
              {(validation.fullName?.success || validation.fullName?.error) && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {validation.fullName?.success && !validation.fullName?.error && (
                    <Check className="h-4 w-4 text-success-500" />
                  )}
                  {validation.fullName?.error && (
                    <AlertCircle className="h-4 w-4 text-danger-500" />
                  )}
                </div>
              )}
            </div>
            <div className="h-[19px] mt-1">
              {validation.fullName?.error && (
                <p className="text-xs text-danger-500">{validation.fullName.error}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">کشور محل ثبت</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>کشوری که سازمان در آن ثبت شده است</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={data.country}
              onValueChange={(value) => updateField("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-[19px] mt-1" />
          </div>
        </div>

        {/* Row 2: Short Name + National Code */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">عنوان کوتاه</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>نام مختصر برای نمایش در لیست‌ها و داشبورد (باید یکتا باشد)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                value={data.shortName}
                onChange={(e) => updateField("shortName", e.target.value)}
                onBlur={() => onValidate?.("shortName")}
                placeholder="مثال: نمونه"
                className={cn(
                  "pl-10",
                  validation.shortName?.error &&
                    "border-danger-500 focus-visible:ring-danger-500",
                  validation.shortName?.success &&
                    !validation.shortName?.error &&
                    "border-success-500"
                )}
              />
              {(validation.shortName?.success || validation.shortName?.error) && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {validation.shortName?.success && !validation.shortName?.error && (
                    <Check className="h-4 w-4 text-success-500" />
                  )}
                  {validation.shortName?.error && (
                    <AlertCircle className="h-4 w-4 text-danger-500" />
                  )}
                </div>
              )}
            </div>
            <div className="h-[19px] mt-1">
              {validation.shortName?.error && (
                <p className="text-xs text-danger-500">{validation.shortName.error}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">شناسه ملی</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>شناسه ملی ۱۱ رقمی سازمان (یکتا برای هر نوع سازمان)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                value={data.nationalCode}
                onChange={(e) => updateField("nationalCode", e.target.value)}
                onBlur={() => onValidate?.("nationalCode")}
                placeholder="مثال: ۱۰۱۰۱۲۳۴۵۶۷"
                className={cn(
                  "pl-10",
                  validation.nationalCode?.error &&
                    "border-danger-500 focus-visible:ring-danger-500",
                  validation.nationalCode?.success &&
                    !validation.nationalCode?.error &&
                    "border-success-500"
                )}
              />
              {(validation.nationalCode?.success ||
                validation.nationalCode?.error) && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {validation.nationalCode?.success &&
                    !validation.nationalCode?.error && (
                      <Check className="h-4 w-4 text-success-500" />
                    )}
                  {validation.nationalCode?.error && (
                    <AlertCircle className="h-4 w-4 text-danger-500" />
                  )}
                </div>
              )}
            </div>
            <div className="h-[19px] mt-1">
              {validation.nationalCode?.error && (
                <p className="text-xs text-danger-500">
                  {validation.nationalCode.error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Technical Name */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Label className="text-foreground">شناسه فنی (tenant_name)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>شناسه یکتا برای استفاده در سیستم - فقط حروف انگلیسی و اعداد</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            value={data.technicalName}
            onChange={(e) =>
              updateField("technicalName", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
            }
            placeholder="مثال: sample_company"
            dir="ltr"
            className="text-left font-mono"
          />
          <div className="h-[19px] mt-1" />
        </div>
      </div>

      {/* Tenant Type Section */}
      <TypeSelector
        value={data.tenantType}
        onChange={(value) => updateField("tenantType", value)}
      />
    </div>
  );
}
