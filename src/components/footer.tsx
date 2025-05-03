import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Footer() {
  const t = await getTranslations('footer')

  return (
    <div className="px-6 py-4 text-sm md:px-12">
      <p className="text-foreground/70">
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
