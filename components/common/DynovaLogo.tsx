"use client";

import { cn } from "@/lib/utils";

interface DynovaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DynovaLogo({ className, size = "md" }: DynovaLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "font-bold text-foreground tracking-tight",
          sizeClasses[size]
        )}
      >
        Dynova
      </span>
      <span
        className={cn("rounded-full bg-primary-500", dotSizes[size])}
        aria-hidden="true"
      />
    </div>
  );
}
