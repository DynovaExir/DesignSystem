"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileUpload } from "../file-upload";

interface Step3Data {
  email: string;
  phone: string;
  website: string;
  logo: File | null;
  logoPreview: string;
  favicon: File | null;
  faviconPreview: string;
}

interface Step3Props {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  fileErrors: {
    logo?: string;
    favicon?: string;
  };
  onFileError?: (field: "logo" | "favicon", error: string | undefined) => void;
}

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function Step3BrandContact({
  data,
  onChange,
  fileErrors,
  onFileError,
}: Step3Props) {
  const updateField = <K extends keyof Step3Data>(
    field: K,
    value: Step3Data[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const validateFile = (file: File, field: "logo" | "favicon"): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      onFileError?.(field, "ابعاد فایل بارگذاری‌شده بیش از حد مجاز است");
      return false;
    }
    onFileError?.(field, undefined);
    return true;
  };

  const handleLogoChange = (file: File | null) => {
    if (file) {
      if (!validateFile(file, "logo")) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          logo: file,
          logoPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      onFileError?.("logo", undefined);
      onChange({
        ...data,
        logo: null,
        logoPreview: "",
      });
    }
  };

  const handleFaviconChange = (file: File | null) => {
    if (file) {
      if (!validateFile(file, "favicon")) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          favicon: file,
          faviconPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      onFileError?.("favicon", undefined);
      onChange({
        ...data,
        favicon: null,
        faviconPreview: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          اطلاعات تماس سازمان
        </h3>

        {/* Row 1: Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">
                ایمیل <span className="text-danger-500">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>آدرس ایمیل رسمی سازمان</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="info@example.com"
              dir="ltr"
              className="text-left"
            />
            <div className="h-[19px] mt-1" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-foreground">
                شماره تماس <span className="text-danger-500">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>شماره تلفن ثابت یا همراه سازمان</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
              dir="ltr"
              className="text-left"
            />
            <div className="h-[19px] mt-1" />
          </div>
        </div>

        {/* Row 2: Website */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Label className="text-foreground">وب‌سایت</Label>
            <span className="text-xs text-muted-foreground">(اختیاری)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>آدرس وب‌سایت رسمی سازمان</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="url"
            value={data.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://example.com"
            dir="ltr"
            className="text-left"
          />
          <div className="h-[19px] mt-1" />
        </div>
      </div>

      {/* Branding Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">برندینگ</h3>

        <div className="grid grid-cols-2 gap-4">
          <FileUpload
            label="لوگوی سازمان (PNG/JPG)"
            accept="image/png,image/jpeg"
            value={data.logo}
            previewUrl={data.logoPreview}
            onChange={handleLogoChange}
            error={fileErrors.logo}
          />

          <FileUpload
            label="فاوآیکن (ICO/PNG/JPEG)"
            accept="image/x-icon,image/png,image/jpeg"
            value={data.favicon}
            previewUrl={data.faviconPreview}
            onChange={handleFaviconChange}
            error={fileErrors.favicon}
          />
        </div>
      </div>
    </div>
  );
}
