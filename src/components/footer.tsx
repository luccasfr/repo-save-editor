import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Footer() {
  const t = await getTranslations('footer')

  return (
    <div className="text-foreground/70 md:px-12 py-4 text-sm px-6">
      <p>
        {t('description')}{' '}
        <Link
          href="https://github.com/luccasfr"
          target="_blank"
          className="text-foreground underline-offset-3 hover:underline"
        >
          Lucas Ferreira
        </Link>
      </p>
    </div>
  )
}
