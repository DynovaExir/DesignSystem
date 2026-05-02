import { useI18n } from '@/locales'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'fa' : 'en')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-2"
      aria-label={`${t.language.switchTo} ${locale === 'en' ? t.language.persian : t.language.english}`}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === 'en' ? 'فارسی' : 'English'}</span>
    </Button>
  )
}
