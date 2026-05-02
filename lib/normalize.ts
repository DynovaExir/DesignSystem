/**
 * Text normalization utilities mirroring server-side rules:
 * - NFC normalization
 * - Trim whitespace
 * - Single-line (remove newlines)
 * - Arabic to Persian character conversion (ي→ی, ك→ک)
 * - Per-field digit handling
 */

// Persian digit mapping
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
const ARABIC_DIGITS = ["٠", "٠", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]

// Arabic to Persian character mapping
const ARABIC_TO_PERSIAN: Record<string, string> = {
  ي: "ی",
  ك: "ک",
  ة: "ه",
  ؤ: "و",
  إ: "ا",
  أ: "ا",
  ٱ: "ا",
}

export type FieldType =
  | "tenant_name"
  | "company_fullname"
  | "company_shortname"
  | "national_code"
  | "phone"
  | "postal_code"
  | "default"

/**
 * Convert Arabic characters to Persian equivalents
 */
function arabicToPersian(text: string): string {
  return text
    .split("")
    .map((char) => ARABIC_TO_PERSIAN[char] || char)
    .join("")
}

/**
 * Convert Persian/Arabic digits to ASCII
 */
function digitsToAscii(text: string): string {
  let result = text
  
  // Convert Persian digits
  PERSIAN_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, "g"), String(index))
  })
  
  // Convert Arabic digits
  ARABIC_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, "g"), String(index))
  })
  
  return result
}

/**
 * Convert ASCII digits to Persian
 */
export function digitsToPersian(text: string): string {
  return text
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10)
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        return PERSIAN_DIGITS[digit]
      }
      return char
    })
    .join("")
}

/**
 * Normalize text based on field type
 */
export function normalizeText(raw: string, field: FieldType = "default"): string {
  if (!raw) return ""
  
  // Step 1: NFC normalization
  let text = raw.normalize("NFC")
  
  // Step 2: Trim whitespace
  text = text.trim()
  
  // Step 3: Single-line (remove newlines, collapse multiple spaces)
  text = text.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ")
  
  // Step 4: Arabic to Persian character conversion (for text fields)
  if (field !== "tenant_name") {
    text = arabicToPersian(text)
  }
  
  // Step 5: Per-field digit handling
  switch (field) {
    case "tenant_name":
      // Lowercase, ASCII only, convert any Persian/Arabic digits to ASCII
      text = digitsToAscii(text.toLowerCase())
      break
      
    case "phone":
    case "postal_code":
      // Convert to ASCII digits for wire format
      text = digitsToAscii(text)
      break
      
    case "national_code":
      // National code: convert to ASCII digits
      text = digitsToAscii(text)
      break
      
    case "company_fullname":
    case "company_shortname":
    default:
      // Keep original digits (but apply Arabic→Persian conversion done above)
      break
  }
  
  return text
}

/**
 * Validate tenant_name format
 */
export function validateTenantNameFormat(name: string): boolean {
  return /^[a-z0-9-]{3,100}$/.test(name)
}

/**
 * Format display value based on field type and locale
 */
export function formatDisplayValue(
  value: string,
  field: FieldType,
  locale: "fa" | "en"
): string {
  if (!value) return ""
  
  // For Persian locale, convert digits to Persian for display
  if (locale === "fa") {
    switch (field) {
      case "phone":
      case "postal_code":
      case "national_code":
        return digitsToPersian(value)
      default:
        return value
    }
  }
  
  return value
}
