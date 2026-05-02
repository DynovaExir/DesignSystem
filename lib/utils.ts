/**
 * Convert English digits to Persian
 */
export function toPersianDigits(str: string): string {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(englishDigits[i], 'g'), persianDigits[i]);
  }
  return result;
}

/**
 * Convert Persian digits to English
 */
export function fromPersianDigits(str: string): string {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  return result;
}

/**
 * Normalize phone number (remove formatting, keep digits only)
 */
export function normalizePhoneNumber(phone: string): string {
  const normalized = fromPersianDigits(phone).replace(/\D/g, '');
  return normalized;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digits = normalizePhoneNumber(phone);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return normalized.length >= 10;
}

/**
 * Create a correlation ID for tracking API calls
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep function for simulating network latency
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
