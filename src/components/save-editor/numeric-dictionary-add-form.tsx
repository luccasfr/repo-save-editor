import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ITEM_CATALOG_INDEX } from '@/consts/item-catalog-index'
import {
  getItemDisplayName,
  normalizeItemInstanceKey,
  parseItemInstanceKey
} from '@/lib/item-instance'
import type { EditableNumericDictionaryKey } from '@/model/numeric-dictionary'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'

type NumericDictionaryAddFormProps = {
  dictionaryName: EditableNumericDictionaryKey
  entries: Record<string, number>
  suggestions: string[]
  onAdd: (entryKey: string, value: number) => boolean
}

export function NumericDictionaryAddForm({
  dictionaryName,
  entries,
  suggestions,
  onAdd
}: NumericDictionaryAddFormProps) {
  const t = useTranslations('run_stats')
  const [entryKey, setEntryKey] = useState('')
  const [entryValue, setEntryValue] = useState('0')
  const normalizedKey =
    dictionaryName === 'item'
      ? normalizeItemInstanceKey(entryKey, Object.keys(entries))
      : entryKey.trim()
  const parsedItemKey =
    dictionaryName === 'item' ? parseItemInstanceKey(normalizedKey) : null
  const matchingItemEntry = parsedItemKey
    ? Object.entries(entries).find(
        ([existingKey]) =>
          parseItemInstanceKey(existingKey)?.baseName === parsedItemKey.baseName
      )
    : undefined
  const resolvedItemIndex = parsedItemKey
    ? (matchingItemEntry?.[1] ?? ITEM_CATALOG_INDEX[parsedItemKey.baseName])
    : undefined
  const parsedValue =
    dictionaryName === 'item' ? resolvedItemIndex : Number(entryValue)
  const isDuplicate = normalizedKey in entries
  const hasInvalidItemSuffix =
    dictionaryName === 'item' &&
    entryKey.includes('/') &&
    normalizedKey.length === 0
  const isValid =
    normalizedKey.length > 0 &&
    (dictionaryName === 'item' || entryValue.trim().length > 0) &&
    parsedValue !== undefined &&
    Number.isInteger(parsedValue) &&
    !isDuplicate
  const keyInputId = `${dictionaryName}-new-entry-key`
  const valueInputId = `${dictionaryName}-new-entry-value`

  const getSuggestionLabel = (suggestion: string) => {
    const displayName = getItemDisplayName(suggestion)
    return t.has(`stats.${displayName}`)
      ? t(`stats.${displayName}`)
      : displayName
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      !isValid ||
      parsedValue === undefined ||
      !onAdd(normalizedKey, parsedValue)
    )
      return

    setEntryKey('')
    setEntryValue('0')
  }

  return (
    <form
      className="border-primary/20 bg-primary/3 grid gap-3 rounded-lg border
        border-dashed p-3"
      onSubmit={handleSubmit}
    >
      <div
        className={
          dictionaryName === 'item'
            ? undefined
            : 'grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]'
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor={keyInputId}>
            {dictionaryName === 'item'
              ? t('new_item_type')
              : t('new_entry_key')}
          </Label>
          {dictionaryName === 'item' ? (
            <Combobox<string>
              items={suggestions}
              value={entryKey || null}
              autoHighlight
              onValueChange={(value) => setEntryKey(value ?? '')}
            >
              <ComboboxInput
                id={keyInputId}
                aria-label={t('new_item_type')}
                className="w-full"
                placeholder={t('select_item_type')}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>{t('no_matching_item')}</ComboboxEmpty>
                <ComboboxList>
                  {(suggestion) => (
                    <ComboboxItem key={suggestion} value={suggestion}>
                      {getSuggestionLabel(suggestion)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : (
            <Combobox<string>
              items={suggestions}
              inputValue={entryKey}
              autoHighlight
              onInputValueChange={setEntryKey}
              onValueChange={(value) => setEntryKey(value ?? '')}
            >
              <ComboboxInput
                id={keyInputId}
                aria-label={t('new_entry_key')}
                placeholder={t(`dictionary_key_placeholders.${dictionaryName}`)}
                className="w-full font-mono"
                showClear
                aria-invalid={isDuplicate || hasInvalidItemSuffix}
              />
              <ComboboxContent>
                <ComboboxEmpty>{t('no_matching_key')}</ComboboxEmpty>
                <ComboboxList>
                  {(suggestion) => (
                    <ComboboxItem key={suggestion} value={suggestion}>
                      {suggestion}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
          {dictionaryName === 'item' ? null : (
            <p className="text-muted-foreground text-xs">
              {t(`dictionary_add_help.${dictionaryName}`)}
            </p>
          )}
          {isDuplicate ? (
            <p className="text-destructive text-xs" role="alert">
              {t('duplicate_entry')}
            </p>
          ) : null}
          {hasInvalidItemSuffix ? (
            <p className="text-destructive text-xs" role="alert">
              {t('invalid_item_suffix')}
            </p>
          ) : null}
        </div>
        {dictionaryName === 'item' ? null : (
          <div className="space-y-1.5">
            <Label htmlFor={valueInputId}>
              {t(`dictionary_value_labels.${dictionaryName}`)}
            </Label>
            <Input
              id={valueInputId}
              type="number"
              step={1}
              value={entryValue}
              className="font-mono"
              onChange={(event) => setEntryValue(event.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!isValid}>
          <Plus className="size-4" aria-hidden="true" />
          {t('add_entry')}
        </Button>
      </div>
    </form>
  )
}
