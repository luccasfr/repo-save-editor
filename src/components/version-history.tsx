import version from '@/../version.json'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { DATE_LOCALE } from '@/consts/date-locale'
import { LocaleType } from '@/model/locale'
import { type VersionHistoryType } from '@/model/version-history'
import { Asterisk } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback } from 'react'
import Heading from './heading'

export default function VersionHistory() {
  const t = useTranslations('version_history')
  const versionHistory = version as unknown as VersionHistoryType
  const locale = useLocale() as LocaleType

  const date = useCallback(
    (date: string) => new Date(date).toLocaleDateString(DATE_LOCALE[locale]),
    [locale]
  )

  return (
    <div className="space-y-2">
      <Heading title={t(`title`)} description={t(`description`)} />
      <div className="flex flex-col-reverse gap-2 font-mono">
        {versionHistory.releases.map((release) => (
          <Accordion key={release.version} type="single" collapsible>
            <AccordionItem value={release.version} className="last:border-b">
              <AccordionTrigger className="hover:bg-accent p-2 font-semibold">
                {release.version}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 p-2">
                <p className="w-fit font-mono text-sm">
                  <span className="font-semibold">{t(`release_date`)}:</span>{' '}
                  {date(release.date)}
                </p>
                <p className="w-fit font-mono text-sm font-semibold">
                  {t(`changes`)} ({release.changes[locale].length})
                </p>
                {release.changes[locale].map((change, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    <Asterisk className="size-4 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{change}</span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  )
}
