import { useTranslation } from '@/locales'
import { useAuth } from '@/hooks'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export function DashboardPage() {
  const { t, locale } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t.header.welcome}, {user?.username}!
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'fa' ? 'اطلاعات کاربر' : 'User Info'}
            </CardTitle>
            <CardDescription>
              {locale === 'fa' ? 'جزئیات حساب کاربری شما' : 'Your account details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">
                  {locale === 'fa' ? 'نام کاربری' : 'Username'}
                </dt>
                <dd className="font-medium">{user?.username}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {locale === 'fa' ? 'ایمیل' : 'Email'}
                </dt>
                <dd className="font-medium">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {locale === 'fa' ? 'نقش‌ها' : 'Roles'}
                </dt>
                <dd className="font-medium">{user?.roles.join(', ')}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'fa' ? 'فعالیت اخیر' : 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {locale === 'fa' ? 'آخرین فعالیت‌های شما' : 'Your latest activities'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {locale === 'fa' 
                ? 'فعالیتی برای نمایش وجود ندارد'
                : 'No activities to display'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'fa' ? 'آمار' : 'Statistics'}
            </CardTitle>
            <CardDescription>
              {locale === 'fa' ? 'خلاصه آمار شما' : 'Your statistics summary'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {locale === 'fa'
                ? 'آماری برای نمایش وجود ندارد'
                : 'No statistics to display'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
