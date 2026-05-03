import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert ASCII digits to Persian digits
export function toPersianDigits(num: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)])
}

// Convert Persian digits to ASCII digits
export function toAsciiDigits(str: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  let result = str
  persianDigits.forEach((pd, i) => {
    result = result.replace(new RegExp(pd, "g"), String(i))
  })
  return result
}

// Simulate network delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Random delay between min and max
export function randomDelay(min: number = 300, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}
