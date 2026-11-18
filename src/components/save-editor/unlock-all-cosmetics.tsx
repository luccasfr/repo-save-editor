import { Button } from '@/components/ui/button'
import { COSMETIC_ASSET_COUNT } from '@/model/meta-save'
import { Unlock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type UnlockAllCosmeticsProps = {
  values: number[]
  onUnlockAll: () => void
}

/**
 * Bulk action for the `cosmeticUnlocks` list. Mirrors the game's
 * `MetaManager.CosmeticUnlockAll()`: every cosmetic index in the current
 * build is added to the unlock list.
 */
export function UnlockAllCosmetics({
  values,
  onUnlockAll
}: UnlockAllCosmeticsProps) {
  const t = useTranslations('meta_save_data')
  const unlocked = new Set(values)
  let hasAll = true

  for (let index = 0; index < COSMETIC_ASSET_COUNT; index += 1) {
    if (!unlocked.has(index)) {
      hasAll = false
      break
    }
  }

  const handleClick = () => {
    onUnlockAll()
    toast.success(t('unlock_all_success', { count: COSMETIC_ASSET_COUNT }))
  }

  return (
    <div
      className="bg-muted/25 flex flex-wrap items-center justify-between gap-3
        rounded-lg border p-3"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium">{t('unlock_all_title')}</p>
        <p className="text-muted-foreground text-xs">
          {t('unlock_all_description', { count: COSMETIC_ASSET_COUNT })}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleClick}
        disabled={hasAll}
      >
        <Unlock className="size-3.5" aria-hidden="true" />
        {hasAll ? t('unlock_all_done') : t('unlock_all_action')}
      </Button>
    </div>
  )
}
