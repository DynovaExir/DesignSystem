export type Locale = "fa" | "en"

export const dictionaries = {
  fa: {
    // App
    appName: "دایناوا",
    
    // Direction Toggle
    switchToEnglish: "English",
    switchToPersian: "فارسی",
    
    // Common
    cancel: "انصراف",
    previous: "قبلی",
    next: "بعدی",
    submit: "ارسال",
    edit: "ویرایش",
    retry: "تلاش مجدد",
    remove: "حذف",
    replace: "جایگزینی",
    browse: "انتخاب فایل",
    required: "الزامی",
    optional: "اختیاری",
    immutable: "غیرقابل تغییر",
    available: "در دسترس",
    taken: "قبلاً استفاده شده",
    checking: "در حال بررسی...",
    error: "خطا",
    loading: "در حال بارگذاری...",
    
    // Tenant Types
    tenantTypeHolding: "هلدینگ",
    tenantTypeHoldingDesc: "شرکت مادر با امکان ایجاد شرکت‌های تابعه",
    tenantTypeIndependent: "شرکت مستقل",
    tenantTypeIndependentDesc: "شرکت بدون ساختار تابعه",
    independentCompanyWarning: "این مستأجر امکان ایجاد شرکت‌های تابعه را نخواهد داشت.",
    
    // Wizard Steps
    steps: {
      identity: "هویت",
      contacts: "تماس",
      branding: "برندینگ",
      confirm: "تأیید",
      submit: "ارسال",
    },
    
    // Step 1 - Identity
    identity: {
      title: "اطلاعات هویتی",
      description: "اطلاعات پایه مستأجر را وارد کنید",
      tenantName: "نام فنی",
      tenantNameHint: "فقط حروف انگلیسی کوچک، اعداد و خط تیره (۳ تا ۱۰۰ کاراکتر)",
      companyFullname: "نام کامل شرکت",
      companyShortname: "نام کوتاه شرکت",
      nationalCode: "کد ملی/شناسه",
      tenantType: "نوع مستأجر",
    },
    
    // Step 2 - Contacts
    contacts: {
      title: "اطلاعات تماس",
      description: "آدرس و اطلاعات تماس را وارد کنید",
      address: "آدرس",
      country: "کشور",
      province: "استان",
      city: "شهر",
      postalCode: "کد پستی",
      street: "آدرس خیابان",
      communication: "اطلاعات ارتباطی",
      phone: "تلفن",
      email: "ایمیل",
      website: "وب‌سایت",
    },
    
    // Step 3 - Branding
    branding: {
      title: "برندینگ",
      description: "لوگو و آیکون مستأجر را بارگذاری کنید",
      logo: "لوگو",
      logoDesc: "PNG یا SVG، حداکثر ۵۰۰ کیلوبایت، ۱۲۸×۱۲۸ تا ۲۰۴۸×۲۰۴۸ پیکسل",
      favicon: "آیکون",
      faviconDesc: "PNG، ICO یا SVG، حداکثر ۱۰۰ کیلوبایت، ۱۶×۱۶ تا ۵۱۲×۵۱۲ پیکسل",
      defaultLocale: "زبان پیش‌فرض",
      dragDrop: "فایل را اینجا بکشید یا",
      clickToBrowse: "کلیک کنید",
    },
    
    // Step 4 - Confirm
    confirm: {
      title: "تأیید نهایی",
      description: "اطلاعات وارد شده را بررسی کنید",
      identitySection: "اطلاعات هویتی",
      contactsSection: "اطلاعات تماس",
      brandingSection: "برندینگ",
      editSection: "ویرایش این بخش",
      immutabilityWarning: "فیلدهای زیر پس از ایجاد قابل تغییر نیستند:",
      acknowledgement: "می‌دانم این فیلدها پس از ایجاد قابل تغییر نیستند.",
    },
    
    // Step 5 - Submit
    submitStep: {
      title: "ایجاد مستأجر",
      description: "در حال ایجاد مستأجر...",
      creatingTenant: "ایجاد مستأجر",
      uploadingLogo: "بارگذاری لوگو",
      uploadingFavicon: "بارگذاری آیکون",
      success: "مستأجر با موفقیت ایجاد شد!",
      partialSuccess: "مستأجر ایجاد شد، اما بارگذاری برندینگ ناموفق بود.",
      retryBranding: "تلاش مجدد برای بارگذاری برندینگ",
      goToDashboard: "رفتن به داشبورد مستأجر",
    },
    
    // Cancel Dialog
    cancelDialog: {
      title: "انصراف از ایجاد مستأجر",
      description: "آیا مطمئن هستید؟ پیش‌نویس حذف خواهد شد.",
      confirm: "بله، انصراف",
      cancel: "خیر، ادامه",
    },
    
    // Tenant Selector
    tenantSelector: {
      title: "انتخاب مستأجر",
      search: "جستجو...",
      refresh: "بروزرسانی لیست",
      createNew: "+ ایجاد مستأجر",
      switchWarning: "تغییرات ذخیره نشده‌ای وجود دارد. آیا مطمئن هستید؟",
      switchConfirm: "بله، تغییر بده",
      switchCancel: "خیر، بمان",
    },
    
    // Validation Errors
    validation: {
      tenantNameRequired: "نام فنی الزامی است",
      tenantNamePattern: "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است",
      tenantNameLength: "نام فنی باید بین ۳ تا ۱۰۰ کاراکتر باشد",
      companyFullnameRequired: "نام کامل شرکت الزامی است",
      companyFullnameLength: "نام کامل شرکت باید بین ۳ تا ۲۵۵ کاراکتر باشد",
      companyShortnameRequired: "نام کوتاه شرکت الزامی است",
      companyShortnameLength: "نام کوتاه شرکت باید بین ۲ تا ۱۰۰ کاراکتر باشد",
      nationalCodeRequired: "کد ملی/شناسه الزامی است",
      nationalCodeLength: "کد ملی/شناسه باید بین ۱ تا ۵۰ کاراکتر باشد",
      tenantTypeRequired: "نوع مستأجر را انتخاب کنید",
      countryRequired: "کشور الزامی است",
      provinceRequired: "استان الزامی است",
      cityRequired: "شهر الزامی است",
      postalCodeRequired: "کد پستی الزامی است",
      streetRequired: "آدرس خیابان الزامی است",
      phoneRequired: "شماره تلفن الزامی است",
      phoneInvalid: "شماره تلفن نامعتبر است",
      emailRequired: "ایمیل الزامی است",
      emailInvalid: "ایمیل نامعتبر است",
      websiteInvalid: "آدرس وب‌سایت نامعتبر است",
      logoTooLarge: "حجم لوگو بیش از ۵۰۰ کیلوبایت است",
      logoWrongType: "فرمت لوگو باید PNG یا SVG باشد",
      logoDimensions: "ابعاد لوگو باید بین ۱۲۸×۱۲۸ تا ۲۰۴۸×۲۰۴۸ پیکسل باشد",
      faviconTooLarge: "حجم آیکون بیش از ۱۰۰ کیلوبایت است",
      faviconWrongType: "فرمت آیکون باید PNG، ICO یا SVG باشد",
      faviconDimensions: "ابعاد آیکون باید بین ۱۶×۱۶ تا ۵۱۲×۵۱۲ پیکسل باشد",
      acknowledgementRequired: "تأیید الزامی است",
    },
    
    // HTTP Errors
    httpErrors: {
      conflict: "این مقدار قبلاً استفاده شده است",
      tooManyRequests: "تعداد درخواست‌ها زیاد است. لطفاً ۱۰ ثانیه صبر کنید.",
      serverError: "خطای سرور. لطفاً دوباره تلاش کنید.",
    },
    
    // Normalized value tooltip
    normalizedTooltip: "مقدار به صورت خودکار نرمال‌سازی شد",
    
    // Locale names
    locales: {
      fa: "فارسی",
      en: "English",
    },
    
    // Countries (sample)
    countries: {
      IR: "ایران",
      AE: "امارات",
      TR: "ترکیه",
    },
  },
  
  en: {
    // App
    appName: "Dynova",
    
    // Direction Toggle
    switchToEnglish: "English",
    switchToPersian: "فارسی",
    
    // Common
    cancel: "Cancel",
    previous: "Previous",
    next: "Next",
    submit: "Submit",
    edit: "Edit",
    retry: "Retry",
    remove: "Remove",
    replace: "Replace",
    browse: "Browse",
    required: "Required",
    optional: "Optional",
    immutable: "Immutable",
    available: "Available",
    taken: "Already taken",
    checking: "Checking...",
    error: "Error",
    loading: "Loading...",
    
    // Tenant Types
    tenantTypeHolding: "Holding",
    tenantTypeHoldingDesc: "Parent company with subsidiary structure capability",
    tenantTypeIndependent: "Independent Company",
    tenantTypeIndependentDesc: "Company without subsidiary structure",
    independentCompanyWarning: "This tenant cannot have subsidiaries.",
    
    // Wizard Steps
    steps: {
      identity: "Identity",
      contacts: "Contacts",
      branding: "Branding",
      confirm: "Confirm",
      submit: "Submit",
    },
    
    // Step 1 - Identity
    identity: {
      title: "Identity Information",
      description: "Enter basic tenant information",
      tenantName: "Tenant Name",
      tenantNameHint: "Lowercase letters, numbers, and hyphens only (3-100 characters)",
      companyFullname: "Company Full Name",
      companyShortname: "Company Short Name",
      nationalCode: "National Code/ID",
      tenantType: "Tenant Type",
    },
    
    // Step 2 - Contacts
    contacts: {
      title: "Contact Information",
      description: "Enter address and contact details",
      address: "Address",
      country: "Country",
      province: "Province/State",
      city: "City",
      postalCode: "Postal Code",
      street: "Street Address",
      communication: "Communication",
      phone: "Phone",
      email: "Email",
      website: "Website",
    },
    
    // Step 3 - Branding
    branding: {
      title: "Branding",
      description: "Upload tenant logo and favicon",
      logo: "Logo",
      logoDesc: "PNG or SVG, max 500 KB, 128×128 to 2048×2048 px",
      favicon: "Favicon",
      faviconDesc: "PNG, ICO or SVG, max 100 KB, 16×16 to 512×512 px",
      defaultLocale: "Default Locale",
      dragDrop: "Drag and drop file here or",
      clickToBrowse: "click to browse",
    },
    
    // Step 4 - Confirm
    confirm: {
      title: "Final Confirmation",
      description: "Review the entered information",
      identitySection: "Identity Information",
      contactsSection: "Contact Information",
      brandingSection: "Branding",
      editSection: "Edit this section",
      immutabilityWarning: "The following fields cannot be changed after creation:",
      acknowledgement: "I understand these fields cannot be changed after creation.",
    },
    
    // Step 5 - Submit
    submitStep: {
      title: "Creating Tenant",
      description: "Creating your tenant...",
      creatingTenant: "Creating tenant",
      uploadingLogo: "Uploading logo",
      uploadingFavicon: "Uploading favicon",
      success: "Tenant created successfully!",
      partialSuccess: "Tenant created, but branding upload failed.",
      retryBranding: "Retry branding upload",
      goToDashboard: "Go to tenant dashboard",
    },
    
    // Cancel Dialog
    cancelDialog: {
      title: "Cancel tenant creation",
      description: "Are you sure? The draft will be discarded.",
      confirm: "Yes, cancel",
      cancel: "No, continue",
    },
    
    // Tenant Selector
    tenantSelector: {
      title: "Select Tenant",
      search: "Search...",
      refresh: "Refresh list",
      createNew: "+ Create tenant",
      switchWarning: "You have unsaved changes. Are you sure you want to switch?",
      switchConfirm: "Yes, switch",
      switchCancel: "No, stay",
    },
    
    // Validation Errors
    validation: {
      tenantNameRequired: "Tenant name is required",
      tenantNamePattern: "Only lowercase letters, numbers, and hyphens allowed",
      tenantNameLength: "Tenant name must be 3-100 characters",
      companyFullnameRequired: "Company full name is required",
      companyFullnameLength: "Company full name must be 3-255 characters",
      companyShortnameRequired: "Company short name is required",
      companyShortnameLength: "Company short name must be 2-100 characters",
      nationalCodeRequired: "National code/ID is required",
      nationalCodeLength: "National code/ID must be 1-50 characters",
      tenantTypeRequired: "Please select a tenant type",
      countryRequired: "Country is required",
      provinceRequired: "Province/State is required",
      cityRequired: "City is required",
      postalCodeRequired: "Postal code is required",
      streetRequired: "Street address is required",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Invalid phone number",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      websiteInvalid: "Invalid website URL",
      logoTooLarge: "Logo exceeds 500 KB",
      logoWrongType: "Logo must be PNG or SVG",
      logoDimensions: "Logo must be 128×128 to 2048×2048 px",
      faviconTooLarge: "Favicon exceeds 100 KB",
      faviconWrongType: "Favicon must be PNG, ICO, or SVG",
      faviconDimensions: "Favicon must be 16×16 to 512×512 px",
      acknowledgementRequired: "Acknowledgement is required",
    },
    
    // HTTP Errors
    httpErrors: {
      conflict: "This value is already taken",
      tooManyRequests: "Too many requests. Please wait 10 seconds.",
      serverError: "Server error. Please try again.",
    },
    
    // Normalized value tooltip
    normalizedTooltip: "Value was automatically normalized",
    
    // Locale names
    locales: {
      fa: "فارسی",
      en: "English",
    },
    
    // Countries (sample)
    countries: {
      IR: "Iran",
      AE: "UAE",
      TR: "Turkey",
    },
  },
} as const

export type Dictionary = typeof dictionaries.fa

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
