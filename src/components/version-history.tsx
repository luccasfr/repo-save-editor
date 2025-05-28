import version from '@/../version.json'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { LocaleType } from '@/model/locale'
import { type VersionHistoryType } from '@/model/version-history'
import { Asterisk } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Heading from './heading'

export default function VersionHistory() {
  const t = useTranslations('version_history')
  const versionHistory = version as unknown as VersionHistoryType
  const locale = useLocale() as LocaleType

  return (
    <div className="space-y-2">
      <Heading title={t(`title`)} description={t(`description`)} />
      <div className="flex flex-col-reverse gap-2">
        {versionHistory.releases.map((release) => (
          <Accordion key={release.version} type="single" collapsible>
            <AccordionItem value={release.version} className="last:border-b">
              <AccordionTrigger className="hover:bg-accent p-2 font-mono font-semibold">
                {release.version}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 p-2">
                {release.changes[locale].map((change, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    <Asterisk className="size-4" />
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
