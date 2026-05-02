export type Locale = "fa" | "en"

export const defaultLocale: Locale = "fa"

export const dictionary = {
  fa: {
    // Common
    app: {
      name: "داینووا",
      tagline: "پلتفرم مدیریت هولدینگ",
    },
    common: {
      next: "بعدی",
      previous: "قبلی",
      cancel: "انصراف",
      submit: "ثبت",
      save: "ذخیره",
      edit: "ویرایش",
      delete: "حذف",
      close: "بستن",
      search: "جستجو",
      loading: "در حال بارگذاری...",
      retry: "تلاش مجدد",
      yes: "بله",
      no: "خیر",
      required: "الزامی",
      optional: "اختیاری",
      available: "در دسترس",
      taken: "استفاده شده",
      checking: "در حال بررسی...",
      error: "خطا",
      success: "موفق",
      refresh: "بروزرسانی",
    },
    // Navigation
    nav: {
      dashboard: "داشبورد",
      tenants: "مستأجرین",
      users: "کاربران",
      settings: "تنظیمات",
      profile: "پروفایل",
      logout: "خروج",
    },
    // Tenant Wizard
    wizard: {
      title: "ایجاد مستأجر جدید",
      subtitle: "یک مستأجر جدید در سیستم ایجاد کنید",
      steps: {
        identity: "هویت",
        contacts: "تماس",
        branding: "برندینگ",
        confirm: "تأیید",
        submit: "ارسال",
      },
      identity: {
        title: "اطلاعات هویتی",
        description: "اطلاعات پایه مستأجر را وارد کنید",
        tenantName: {
          label: "نام فنی",
          placeholder: "acme-corp",
          hint: "شناسه فنی غیرقابل تغییر (حروف کوچک انگلیسی، اعداد و خط تیره)",
          immutable: "غیرقابل تغییر",
        },
        companyFullname: {
          label: "نام کامل شرکت",
          placeholder: "شرکت آکمه",
          hint: "نام رسمی و کامل شرکت",
        },
        companyShortname: {
          label: "نام کوتاه شرکت",
          placeholder: "آکمه",
          hint: "نام مختصر برای نمایش",
        },
        nationalCode: {
          label: "شناسه ملی",
          placeholder: "۱۲۳۴۵۶۷۸۹۰",
          hint: "شناسه ملی شرکت",
        },
        tenantType: {
          label: "نوع مستأجر",
          holding: {
            title: "هولدینگ",
            description: "شرکت مادر با امکان ایجاد شرکت‌های زیرمجموعه",
          },
          independent: {
            title: "شرکت مستقل",
            description: "شرکت مستقل بدون ساختار زیرمجموعه",
          },
          independentWarning: "این مستأجر امکان ایجاد ساختار زیرمجموعه را ندارد.",
        },
      },
      contacts: {
        title: "اطلاعات تماس",
        description: "آدرس و اطلاعات تماس را وارد کنید",
        address: {
          title: "آدرس",
          country: {
            label: "کشور",
            placeholder: "انتخاب کنید",
          },
          province: {
            label: "استان",
            placeholder: "انتخاب کنید",
          },
          city: {
            label: "شهر",
            placeholder: "انتخاب کنید",
          },
          postalCode: {
            label: "کد پستی",
            placeholder: "۱۲۳۴۵۶۷۸۹۰",
          },
          street: {
            label: "آدرس کامل",
            placeholder: "خیابان، کوچه، پلاک...",
          },
        },
        contact: {
          title: "راه‌های ارتباطی",
          phone: {
            label: "تلفن",
            placeholder: "۰۲۱۱۲۳۴۵۶۷۸",
          },
          email: {
            label: "ایمیل",
            placeholder: "info@example.com",
          },
          website: {
            label: "وب‌سایت",
            placeholder: "https://example.com",
          },
        },
      },
      branding: {
        title: "برندینگ",
        description: "لوگو و آیکون مستأجر را بارگذاری کنید",
        logo: {
          label: "لوگو",
          hint: "PNG یا SVG، حداکثر ۵۰۰ کیلوبایت، ۱۲۸×۱۲۸ تا ۲۰۴۸×۲۰۴۸ پیکسل",
          replace: "جایگزین",
          remove: "حذف",
          dragDrop: "بکشید و رها کنید یا",
          browse: "انتخاب فایل",
        },
        favicon: {
          label: "فاویکون",
          hint: "PNG، ICO یا SVG، حداکثر ۱۰۰ کیلوبایت، ۱۶×۱۶ تا ۵۱۲×۵۱۲ پیکسل",
        },
        defaultLocale: {
          label: "زبان پیش‌فرض",
          hint: "زبان پیش‌فرض رابط کاربری",
        },
      },
      confirm: {
        title: "تأیید نهایی",
        description: "اطلاعات وارد شده را بررسی و تأیید کنید",
        sections: {
          identity: "اطلاعات هویتی",
          contacts: "اطلاعات تماس",
          branding: "برندینگ",
        },
        immutableBanner: {
          title: "توجه: فیلدهای غیرقابل تغییر",
          description: "فیلدهای زیر پس از ایجاد قابل تغییر نیستند:",
          fields: ["نام فنی", "نوع مستأجر"],
        },
        acknowledgement: "می‌دانم این فیلدها پس از ایجاد قابل تغییر نیستند.",
        editSection: "ویرایش این بخش",
      },
      submit: {
        title: "ارسال",
        description: "در حال ایجاد مستأجر...",
        steps: {
          creating: "ایجاد مستأجر",
          uploadingLogo: "بارگذاری لوگو",
          uploadingFavicon: "بارگذاری فاویکون",
          completing: "تکمیل فرآیند",
        },
        success: {
          title: "مستأجر با موفقیت ایجاد شد",
          description: "اکنون می‌توانید به داشبورد مستأجر بروید.",
          goToDashboard: "رفتن به داشبورد",
        },
        partialSuccess: {
          title: "مستأجر ایجاد شد اما برندینگ ناقص است",
          description: "مستأجر ایجاد شد اما بارگذاری برندینگ با خطا مواجه شد.",
          retryBranding: "تلاش مجدد برای برندینگ",
        },
        error: {
          title: "خطا در ایجاد مستأجر",
          description: "لطفاً دوباره تلاش کنید.",
        },
      },
      discard: {
        title: "پیش‌نویس حذف شود؟",
        description: "تمام اطلاعات وارد شده از بین خواهد رفت.",
      },
    },
    // Tenant Selector
    tenantSelector: {
      title: "انتخاب مستأجر",
      search: "جستجوی مستأجر...",
      create: "+ ایجاد مستأجر",
      refresh: "بروزرسانی لیست",
      types: {
        holding: "هولدینگ",
        independent: "شرکت",
      },
      switchConfirm: {
        title: "تغییر مستأجر؟",
        description: "تغییرات ذخیره نشده از بین می‌رود. آیا مطمئن هستید؟",
      },
    },
    // Validation errors
    validation: {
      required: "این فیلد الزامی است",
      minLength: "حداقل {{min}} کاراکتر وارد کنید",
      maxLength: "حداکثر {{max}} کاراکتر مجاز است",
      pattern: "فرمت وارد شده صحیح نیست",
      email: "ایمیل وارد شده معتبر نیست",
      url: "آدرس وارد شده معتبر نیست",
      tenantName: "فقط حروف کوچک انگلیسی، اعداد و خط تیره مجاز است",
      uniqueConflict: "این مقدار قبلاً استفاده شده است",
      fileType: "فرمت فایل مجاز نیست",
      fileSize: "حجم فایل بیش از حد مجاز است",
      fileDimensions: "ابعاد تصویر مجاز نیست",
    },
    // Locale names
    locales: {
      fa: "فارسی",
      en: "English",
    },
    // Direction toggle
    dirToggle: {
      label: "زبان",
    },
  },
  en: {
    // Common
    app: {
      name: "Dynova",
      tagline: "Holding Management Platform",
    },
    common: {
      next: "Next",
      previous: "Previous",
      cancel: "Cancel",
      submit: "Submit",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      search: "Search",
      loading: "Loading...",
      retry: "Retry",
      yes: "Yes",
      no: "No",
      required: "Required",
      optional: "Optional",
      available: "Available",
      taken: "Taken",
      checking: "Checking...",
      error: "Error",
      success: "Success",
      refresh: "Refresh",
    },
    // Navigation
    nav: {
      dashboard: "Dashboard",
      tenants: "Tenants",
      users: "Users",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
    },
    // Tenant Wizard
    wizard: {
      title: "Create New Tenant",
      subtitle: "Create a new tenant in the system",
      steps: {
        identity: "Identity",
        contacts: "Contacts",
        branding: "Branding",
        confirm: "Confirm",
        submit: "Submit",
      },
      identity: {
        title: "Identity Information",
        description: "Enter the basic tenant information",
        tenantName: {
          label: "Technical Name",
          placeholder: "acme-corp",
          hint: "Immutable technical identifier (lowercase letters, numbers, and hyphens)",
          immutable: "Immutable",
        },
        companyFullname: {
          label: "Full Company Name",
          placeholder: "Acme Corporation",
          hint: "Official full company name",
        },
        companyShortname: {
          label: "Short Company Name",
          placeholder: "Acme",
          hint: "Short name for display",
        },
        nationalCode: {
          label: "National Code",
          placeholder: "1234567890",
          hint: "Company national registration code",
        },
        tenantType: {
          label: "Tenant Type",
          holding: {
            title: "Holding",
            description: "Parent company with subsidiary structure capability",
          },
          independent: {
            title: "Independent Company",
            description: "Standalone company without subsidiary structure",
          },
          independentWarning: "This tenant cannot have subsidiaries.",
        },
      },
      contacts: {
        title: "Contact Information",
        description: "Enter address and contact details",
        address: {
          title: "Address",
          country: {
            label: "Country",
            placeholder: "Select",
          },
          province: {
            label: "Province",
            placeholder: "Select",
          },
          city: {
            label: "City",
            placeholder: "Select",
          },
          postalCode: {
            label: "Postal Code",
            placeholder: "1234567890",
          },
          street: {
            label: "Street Address",
            placeholder: "Street, alley, number...",
          },
        },
        contact: {
          title: "Contact Methods",
          phone: {
            label: "Phone",
            placeholder: "+98 21 12345678",
          },
          email: {
            label: "Email",
            placeholder: "info@example.com",
          },
          website: {
            label: "Website",
            placeholder: "https://example.com",
          },
        },
      },
      branding: {
        title: "Branding",
        description: "Upload tenant logo and favicon",
        logo: {
          label: "Logo",
          hint: "PNG or SVG, max 500KB, 128x128 to 2048x2048 pixels",
          replace: "Replace",
          remove: "Remove",
          dragDrop: "Drag and drop or",
          browse: "Browse",
        },
        favicon: {
          label: "Favicon",
          hint: "PNG, ICO or SVG, max 100KB, 16x16 to 512x512 pixels",
        },
        defaultLocale: {
          label: "Default Language",
          hint: "Default UI language",
        },
      },
      confirm: {
        title: "Final Confirmation",
        description: "Review and confirm the entered information",
        sections: {
          identity: "Identity Information",
          contacts: "Contact Information",
          branding: "Branding",
        },
        immutableBanner: {
          title: "Warning: Immutable Fields",
          description: "The following fields cannot be changed after creation:",
          fields: ["Technical Name", "Tenant Type"],
        },
        acknowledgement: "I understand these fields cannot be changed after creation.",
        editSection: "Edit this section",
      },
      submit: {
        title: "Submit",
        description: "Creating tenant...",
        steps: {
          creating: "Creating tenant",
          uploadingLogo: "Uploading logo",
          uploadingFavicon: "Uploading favicon",
          completing: "Completing process",
        },
        success: {
          title: "Tenant created successfully",
          description: "You can now go to the tenant dashboard.",
          goToDashboard: "Go to Dashboard",
        },
        partialSuccess: {
          title: "Tenant created but branding incomplete",
          description: "Tenant was created but branding upload failed.",
          retryBranding: "Retry Branding Upload",
        },
        error: {
          title: "Error creating tenant",
          description: "Please try again.",
        },
      },
      discard: {
        title: "Discard draft?",
        description: "All entered information will be lost.",
      },
    },
    // Tenant Selector
    tenantSelector: {
      title: "Select Tenant",
      search: "Search tenants...",
      create: "+ Create Tenant",
      refresh: "Refresh list",
      types: {
        holding: "Holding",
        independent: "Company",
      },
      switchConfirm: {
        title: "Switch Tenant?",
        description: "Unsaved changes will be lost. Are you sure?",
      },
    },
    // Validation errors
    validation: {
      required: "This field is required",
      minLength: "Minimum {{min}} characters required",
      maxLength: "Maximum {{max}} characters allowed",
      pattern: "Invalid format",
      email: "Invalid email address",
      url: "Invalid URL",
      tenantName: "Only lowercase letters, numbers, and hyphens allowed",
      uniqueConflict: "This value is already in use",
      fileType: "Invalid file type",
      fileSize: "File size exceeds limit",
      fileDimensions: "Invalid image dimensions",
    },
    // Locale names
    locales: {
      fa: "فارسی",
      en: "English",
    },
    // Direction toggle
    dirToggle: {
      label: "Language",
    },
  },
} as const

export type Dictionary = typeof dictionary.fa

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale]
}

// Helper to get nested keys
export function t(dict: Dictionary, path: string): string {
  const keys = path.split(".")
  let result: unknown = dict
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof result === "string" ? result : path
}
