import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format Persian numbers - converts Western digits to Persian/Farsi digits
 */
export function toPersianDigits(value: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(value).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)])
}

/**
 * Format date to Persian format
 */
export function formatPersianDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format time to Persian format
 */
export function formatPersianTime(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Get relative time in Persian
 */
export function getRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('fa-IR', { numeric: 'auto' })
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const diffInSeconds = Math.round(diff / 1000)
  const diffInMinutes = Math.round(diffInSeconds / 60)
  const diffInHours = Math.round(diffInMinutes / 60)
  const diffInDays = Math.round(diffInHours / 24)

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second')
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute')
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour')
  } else {
    return rtf.format(diffInDays, 'day')
  }
}
