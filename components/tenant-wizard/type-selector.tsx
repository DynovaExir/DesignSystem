"use client";

import { Building2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TypeSelectorProps {
  value: "company" | "holding" | null;
  onChange: (value: "company" | "holding") => void;
}

const types = [
  {
    id: "company" as const,
    title: "شرکت",
    subtitle: "یک واحد مستقل حقوقی",
    icon: Building2,
  },
  {
    id: "holding" as const,
    title: "هلدینگ",
    subtitle: "یک مجموعه مستقل با قابلیت افزودن چند شرکت",
    icon: Layers,
  },
];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-foreground">نوع سازمان</h4>
        <p className="text-xs text-muted-foreground mt-1">
          نوع سازمان را انتخاب کنید. این انتخاب بر امکانات و قابلیت‌های سازمان تاثیر می‌گذارد.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {types.map((type) => {
          const isSelected = value === type.id;
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-right transition-all hover:bg-muted/50",
                isSelected
                  ? "border-primary bg-primary-100/30"
                  : "border-border hover:border-border-strong"
              )}
            >
              {isSelected && (
                <Badge className="absolute top-2 left-2" variant="default">
                  انتخاب شده
                </Badge>
              )}
              <div
                className={cn(
                  "rounded-lg p-2",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-foreground">
                  {type.title}
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {type.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
