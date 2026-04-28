"use client";

import { useState } from "react";
import { CalendarIcon, Info } from "lucide-react";
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
import { TagInput } from "../tag-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step2Data {
  registrationType: string;
  registrationDate: string;
  tags: string[];
}

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  tenantType: "company" | "holding" | null;
}

const registrationTypes = [
  { value: "private", label: "شرکت خصوصی" },
  { value: "public", label: "شرکت سهامی عام" },
  { value: "limited", label: "شرکت مسئولیت محدود" },
  { value: "cooperative", label: "شرکت تعاونی" },
];

export function Step2SupplementaryInfo({ data, onChange, tenantType }: Step2Props) {
  const updateField = <K extends keyof Step2Data>(
    field: K,
    value: Step2Data[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const dateLabel =
    tenantType === "holding" ? "تاریخ ایجاد هلدینگ" : "تاریخ ثبت سازمان";

  return (
    <div className="space-y-6">
      {/* Legal Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">اطلاعات حقوقی</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Registration Type */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">نوع ثبتی</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>نوع ثبت حقوقی سازمان</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={data.registrationType}
              onValueChange={(value) => updateField("registrationType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {registrationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-[19px] mt-1" />
          </div>

          {/* Registration Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">{dateLabel}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تاریخ ثبت رسمی سازمان در اداره ثبت شرکت‌ها</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={data.registrationDate}
                onChange={(e) => updateField("registrationDate", e.target.value)}
                placeholder="۱۴۰۳/۰۱/۰۱"
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-[19px] mt-1" />
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <TagInput
          label="تگ‌ها"
          tooltip="برچسب‌هایی برای دسته‌بندی و جستجوی آسان‌تر سازمان"
          value={data.tags}
          onChange={(tags) => updateField("tags", tags)}
        />
      </div>
    </div>
  );
}
