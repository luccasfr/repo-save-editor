import { Button } from '@/components/ui/button'
import { LucideIcon, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

type StatsItemProps = {
  titleKey: string
  value: string
  icon: LucideIcon
  onIncrease: () => void
  onDecrease: () => void
  disableDecrease?: boolean
  translationNamespace?: string
}

export function StatsItem({
  titleKey,
  value,
  icon: Icon,
  onIncrease,
  onDecrease,
  disableDecrease = false,
  translationNamespace = 'stats'
}: StatsItemProps) {
  const t = useTranslations('run_stats')

  return (
    <div className="flex flex-col items-center text-sm">
      <p className="text-center font-medium">
        <Icon className="inline-flex size-4 shrink-0 pr-0.5" />
        {t(`${translationNamespace}.${titleKey}`)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={disableDecrease}
        >
          <Minus className="size-3" />
        </Button>
        <p className="text-center font-mono text-lg font-bold">{value}</p>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onIncrease}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}
