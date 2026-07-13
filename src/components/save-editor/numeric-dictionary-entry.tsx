import { CommitInput } from '@/components/save-editor/commit-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getItemDisplayName, parseItemInstanceKey } from '@/lib/item-instance'
import type { EditableNumericDictionaryKey } from '@/model/numeric-dictionary'
import { CopyPlus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type NumericDictionaryEntryProps = {
  dictionaryName: EditableNumericDictionaryKey
  dictionaryLabel: string
  entryKey: string
  entryValue: number
  inputId: string
  onDuplicate?: () => void
  onRemove: () => void
  onUpdate?: (value: number) => void
}

export function NumericDictionaryEntry({
  dictionaryName,
  dictionaryLabel,
  entryKey,
  entryValue,
  inputId,
  onDuplicate,
  onRemove,
  onUpdate
}: NumericDictionaryEntryProps) {
  const t = useTranslations('run_stats')
  const parsedKey = parseItemInstanceKey(entryKey)
  const itemDisplayName = getItemDisplayName(entryKey)
  const translatedName = t.has(`stats.${itemDisplayName}`)
    ? t(`stats.${itemDisplayName}`)
    : itemDisplayName
  const accessibleEntryName = parsedKey
    ? `${translatedName} (${entryKey})`
    : translatedName

  return (
    <article className="bg-muted/25 grid gap-3 rounded-lg border p-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium">{translatedName}</h3>
            {parsedKey ? (
              <span
                className="bg-primary/10 text-primary rounded-full px-2 py-0.5
                  font-mono text-[0.65rem] font-semibold tracking-wide
                  uppercase"
              >
                {t('instance_number', {
                  number: parsedKey.instanceNumber
                })}
              </span>
            ) : null}
          </div>
          <code
            className="text-muted-foreground block text-[0.7rem] break-all"
            title={t('technical_key')}
          >
            {entryKey}
          </code>
        </div>
        <div className="flex shrink-0 gap-1">
          {onDuplicate ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onDuplicate}
              aria-label={t('duplicate_instance', {
                name: accessibleEntryName
              })}
              title={t('duplicate_instance', { name: accessibleEntryName })}
            >
              <CopyPlus className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive size-8"
                aria-label={t('remove_entry', { name: accessibleEntryName })}
                title={t('remove_entry', { name: accessibleEntryName })}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('remove_entry_title', { name: accessibleEntryName })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dictionaryName === 'item'
                    ? t('remove_item_instance_description', { key: entryKey })
                    : t('remove_entry_description', { key: entryKey })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 text-white"
                  onClick={onRemove}
                >
                  {t('remove')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
      {dictionaryName === 'item' || !onUpdate ? null : (
        <div className="space-y-1.5">
          <Label htmlFor={inputId}>
            {t(`dictionary_value_labels.${dictionaryName}`)}
          </Label>
          <CommitInput
            key={`${dictionaryName}-${entryKey}-${entryValue}`}
            id={inputId}
            type="number"
            step={1}
            value={entryValue}
            className="font-mono"
            aria-label={t('dictionary_entry_label', {
              dictionary: dictionaryLabel,
              key: entryKey
            })}
            onCommit={(value) => {
              const parsedValue = Number(value)
              if (!Number.isInteger(parsedValue)) return false
              onUpdate(parsedValue)
            }}
          />
        </div>
      )}
    </article>
  )
}
