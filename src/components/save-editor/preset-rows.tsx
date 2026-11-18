import { NumberChipList } from '@/components/save-editor/number-chip-list'
import { Button } from '@/components/ui/button'
import type { MetaActions } from '@/hooks/use-meta-save'
import { isNumberList } from '@/model/meta-save'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type PresetRowsProps = {
  keyName: string
  values: number[][]
  meta: MetaActions
}

/**
 * Editor for a `List<List<int>>` field (cosmetic and color presets). Each row
 * is one preset and holds its own list of ids.
 */
export function PresetRows({ keyName, values, meta }: PresetRowsProps) {
  const t = useTranslations('meta_save_data')

  return (
    <div className="space-y-3">
      {values.map((row, index) => (
        <article
          key={index}
          className="bg-muted/25 space-y-2 rounded-lg border p-3"
        >
          <header className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">
              {t('preset', { number: index + 1 })}
            </h3>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive size-8"
              aria-label={t('remove_preset', { number: index + 1 })}
              title={t('remove_preset', { number: index + 1 })}
              onClick={() => meta.removePreset(keyName, index)}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </header>
          <NumberChipList
            values={isNumberList(row) ? row : []}
            inputId={`${keyName}-preset-${index}-add`}
            onAdd={(newValues) =>
              meta.presetAppendNumbers(keyName, index, newValues)
            }
            onRemove={(removed) =>
              meta.presetRemoveValue(keyName, index, removed)
            }
            onClear={() => meta.presetClear(keyName, index)}
          />
        </article>
      ))}
      {values.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('empty')}</p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => meta.appendPreset(keyName)}
      >
        {t('add_preset')}
      </Button>
    </div>
  )
}
