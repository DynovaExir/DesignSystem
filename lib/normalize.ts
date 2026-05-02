/**
 * Text normalization utilities mirroring server-side rules
 * - NFC normalization
 * - Trim whitespace
 * - Single-line (collapse newlines)
 * - Arabic → Persian character mapping
 * - Per-field digit handling
 */

// Arabic to Persian character mappings
const arabicToPersianMap: Record<string, string> = {
  "ي": "ی", // Arabic Yeh → Persian Yeh
  "ك": "ک", // Arabic Kaf → Persian Kaf
  "٠": "۰", // Arabic-Indic 0 → Persian 0
  "١": "۱",
  "٢": "۲",
  "٣": "۳",
  "٤": "۴",
  "٥": "۵",
  "٦": "۶",
  "٧": "۷",
  "٨": "۸",
  "٩": "۹",
}

// Persian to ASCII digit mappings (for wire transfer)
const persianToAsciiMap: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
}

// ASCII to Persian digit mappings (for display)
const asciiToPersianMap: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
}

/**
 * Replace Arabic characters with their Persian equivalents
 */
function arabicToPersian(text: string): string {
  return text.split("").map(char => arabicToPersianMap[char] || char).join("")
}

/**
 * Convert Persian digits to ASCII (for API calls)
 */
export function persianToAscii(text: string): string {
  return text.split("").map(char => persianToAsciiMap[char] || char).join("")
}

/**
 * Convert ASCII digits to Persian (for display)
 */
export function asciiToPersian(text: string): string {
  return text.split("").map(char => asciiToPersianMap[char] || char).join("")
}

/**
 * Field types for normalization
 */
type FieldType = 
  | "tenant_name"
  | "company_fullname"
  | "company_shortname"
  | "national_code"
  | "phone"
  | "email"
  | "url"
  | "postal_code"
  | "address"
  | "general"

/**
 * Normalize text according to field-specific rules
 */
export function normalizeText(raw: string, field: FieldType): string {
  // Step 1: NFC normalization
  let text = raw.normalize("NFC")
  
  // Step 2: Trim whitespace
  text = text.trim()
  
  // Step 3: Single-line (collapse multiple spaces and newlines)
  text = text.replace(/\s+/g, " ")
  
  // Step 4: Field-specific handling
  switch (field) {
    case "tenant_name":
      // Lowercase only, no Persian conversion needed, keep ASCII
      text = text.toLowerCase()
      // Remove any non-allowed characters (only allow a-z, 0-9, -)
      text = text.replace(/[^a-z0-9-]/g, "")
      break
    
    case "email":
    case "url":
      // Keep ASCII, no Persian conversion
      break
    
    case "phone":
    case "postal_code":
    case "national_code":
      // Convert Persian/Arabic digits to ASCII for wire transfer
      text = arabicToPersian(text)
      text = persianToAscii(text)
      break
    
    case "company_fullname":
    case "company_shortname":
    case "address":
    case "general":
    default:
      // Convert Arabic to Persian
      text = arabicToPersian(text)
      break
  }
  
  return text
}

/**
 * Format a value for display (convert ASCII digits to Persian)
 */
export function formatForDisplay(value: string, usePersianDigits: boolean = true): string {
  if (usePersianDigits) {
    return asciiToPersian(value)
  }
  return value
}

/**
 * Validate tenant_name format
 * Must be lowercase letters, numbers, and hyphens, 3-100 characters
 */
export function isValidTenantName(name: string): boolean {
  return /^[a-z0-9-]{3,100}$/.test(name)
}
