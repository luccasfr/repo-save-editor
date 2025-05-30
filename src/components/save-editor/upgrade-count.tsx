import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type UpgradeCountProps = {
  count: number
  titleKey: string
  icon: LucideIcon
  onIncrease: () => void
  onDecrease: () => void
}

export function UpgradeCount({
  count,
  titleKey,
  icon: Icon,
  onIncrease,
  onDecrease
}: UpgradeCountProps) {
  const t = useTranslations('player_list')

  return (
    <div className="flex flex-col items-center text-center text-sm">
      <p className="font-medium">
        <Icon className="inline-flex size-4 shrink-0 pr-0.5" />
        {t(`attributes.${titleKey}`)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={count <= 0}
        >
          <Minus className="size-3" />
        </Button>
        <p className="font-mono text-lg font-bold">{count}</p>
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
