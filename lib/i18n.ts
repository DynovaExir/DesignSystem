import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'wizard.title': 'Create Your Tenant',
      'wizard.step1': 'Tenant Identity',
      'wizard.step2': 'Contact Information',
      'wizard.step3': 'Branding',
      'wizard.step4': 'Confirm Details',
      'wizard.step5': 'Submit',
      'wizard.progress': 'Step {{current}} of {{total}}',
      'wizard.back': 'Back',
      'wizard.next': 'Next',
      'wizard.submit': 'Create Tenant',
      
      'form.tenant_name': 'Tenant Name',
      'form.tenant_name.placeholder': 'e.g., Acme Corporation',
      'form.tenant_name.required': 'Tenant name is required',
      'form.tenant_name.minLength': 'Tenant name must be at least 3 characters',
      'form.tenant_name.maxLength': 'Tenant name must be at most 50 characters',
      'form.tenant_name.checking': 'Checking availability...',
      'form.tenant_name.available': 'Available',
      'form.tenant_name.taken': 'This name is already taken',
      'form.tenant_name.cooldown': 'Please wait before checking again',
      
      'form.tenant_type': 'Organization Type',
      'form.tenant_type.placeholder': 'Select organization type',
      'form.tenant_type.required': 'Organization type is required',
      'form.tenant_type.options.enterprise': 'Enterprise',
      'form.tenant_type.options.startup': 'Startup',
      'form.tenant_type.options.nonprofit': 'Non-Profit',
      
      'form.address': 'Address',
      'form.address.placeholder': 'Street address',
      'form.address.required': 'Address is required',
      
      'form.phone': 'Phone Number',
      'form.phone.placeholder': '+1 (555) 000-0000',
      'form.phone.required': 'Phone number is required',
      'form.phone.invalid': 'Invalid phone number',
      
      'form.email': 'Email',
      'form.email.placeholder': 'contact@example.com',
      'form.email.required': 'Email is required',
      'form.email.invalid': 'Invalid email address',
      
      'form.logo': 'Logo',
      'form.logo.upload': 'Choose logo',
      'form.logo.hint': 'PNG or SVG, max 2MB',
      'form.logo.error': 'Invalid image file',
      
      'form.favicon': 'Favicon',
      'form.favicon.upload': 'Choose favicon',
      'form.favicon.hint': 'PNG or ICO, max 500KB',
      'form.favicon.error': 'Invalid favicon file',
      
      'confirm.title': 'Confirm Your Information',
      'confirm.edit': 'Edit',
      'confirm.section.identity': 'Tenant Identity',
      'confirm.section.contact': 'Contact Information',
      'confirm.section.branding': 'Branding',
      
      'error.global': 'An error occurred',
      'error.networkError': 'Network error, please try again',
      'error.validationError': 'Please check your input',
      'error.conflict': 'This tenant already exists',
      'success.created': 'Tenant created successfully',
    }
  },
  fa: {
    translation: {
      'wizard.title': 'ایجاد مستأجر',
      'wizard.step1': 'هویت مستأجر',
      'wizard.step2': 'اطلاعات تماس',
      'wizard.step3': 'برندسازی',
      'wizard.step4': 'تأیید جزئیات',
      'wizard.step5': 'ارسال',
      'wizard.progress': 'مرحله {{current}} از {{total}}',
      'wizard.back': 'بازگشت',
      'wizard.next': 'بعدی',
      'wizard.submit': 'ایجاد مستأجر',
      
      'form.tenant_name': 'نام مستأجر',
      'form.tenant_name.placeholder': 'مثال: شرکت اکم',
      'form.tenant_name.required': 'نام مستأجر الزامی است',
      'form.tenant_name.minLength': 'نام مستأجر باید حداقل 3 حرف باشد',
      'form.tenant_name.maxLength': 'نام مستأجر می‌تواند حداکثر 50 حرف باشد',
      'form.tenant_name.checking': 'در حال بررسی دسترس‌پذیری...',
      'form.tenant_name.available': 'در دسترس',
      'form.tenant_name.taken': 'این نام قبلاً گرفته شده است',
      'form.tenant_name.cooldown': 'لطفاً قبل از بررسی دوباره منتظر بمانید',
      
      'form.tenant_type': 'نوع سازمان',
      'form.tenant_type.placeholder': 'نوع سازمان را انتخاب کنید',
      'form.tenant_type.required': 'نوع سازمان الزامی است',
      'form.tenant_type.options.enterprise': 'تجاری',
      'form.tenant_type.options.startup': 'استارتاپ',
      'form.tenant_type.options.nonprofit': 'غیرانتفاعی',
      
      'form.address': 'آدرس',
      'form.address.placeholder': 'آدرس خیابان',
      'form.address.required': 'آدرس الزامی است',
      
      'form.phone': 'شماره تلفن',
      'form.phone.placeholder': '۰۹۱۲ ۳۴۵ ۶۷۸۹',
      'form.phone.required': 'شماره تلفن الزامی است',
      'form.phone.invalid': 'شماره تلفن نامعتبر است',
      
      'form.email': 'ایمیل',
      'form.email.placeholder': 'contact@example.com',
      'form.email.required': 'ایمیل الزامی است',
      'form.email.invalid': 'آدرس ایمیل نامعتبر است',
      
      'form.logo': 'لوگو',
      'form.logo.upload': 'انتخاب لوگو',
      'form.logo.hint': 'PNG یا SVG، حداکثر 2MB',
      'form.logo.error': 'فایل تصویر نامعتبر است',
      
      'form.favicon': 'Favicon',
      'form.favicon.upload': 'انتخاب Favicon',
      'form.favicon.hint': 'PNG یا ICO، حداکثر 500KB',
      'form.favicon.error': 'فایل favicon نامعتبر است',
      
      'confirm.title': 'تأیید اطلاعات شما',
      'confirm.edit': 'ویرایش',
      'confirm.section.identity': 'هویت مستأجر',
      'confirm.section.contact': 'اطلاعات تماس',
      'confirm.section.branding': 'برندسازی',
      
      'error.global': 'خطایی رخ داد',
      'error.networkError': 'خطای شبکه، لطفاً دوباره تلاش کنید',
      'error.validationError': 'لطفاً ورودی خود را بررسی کنید',
      'error.conflict': 'این مستأجر قبلاً وجود دارد',
      'success.created': 'مستأجر با موفقیت ایجاد شد',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
