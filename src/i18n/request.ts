import { getCookie } from '@/lib/cookie'
import { getRequestConfig } from 'next-intl/server'

/**
 * This function retrieves the locale from a cookie and loads the corresponding
 * messages file. It is used to configure internationalization settings for the
 * application.
 *
 * @returns An object containing the locale and messages for that locale.
 */
export default getRequestConfig(async () => {
  const localeCookie = await getCookie('locale')
  const locale = localeCookie?.value || 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
