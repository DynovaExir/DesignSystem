import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with Persian numerals if locale is 'fa'
 */
export function formatNumber(num: number, locale: string): string {
  if (locale === 'fa') {
    return num.toLocaleString('fa-IR')
  }
  return num.toString()
}

/**
 * Format time as MM:SS with Persian numerals support
 */
export function formatTime(seconds: number, locale: string): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const minsStr = mins.toString().padStart(2, '0')
  const secsStr = secs.toString().padStart(2, '0')
  
  if (locale === 'fa') {
    // Convert to Persian numerals
    const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    const toPersian = (str: string) => 
      str.replace(/[0-9]/g, (d) => persianNumerals[parseInt(d)])
    return `${toPersian(minsStr)}:${toPersian(secsStr)}`
  }
  
  return `${minsStr}:${secs.toString().padStart(2, '0')}`
}
