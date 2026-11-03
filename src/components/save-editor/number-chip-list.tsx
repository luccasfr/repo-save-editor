import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

type NumberChipListProps = {
  values: number[]
  inputId: string
  onAdd: (values: number[]) => void
  onRemove: (value: number) => void
  onClear: () => void
}

/**
 * Compact editor for a `List<int>` field: chips with a remove button plus a
 * single-value / range add form. Duplicate values are rejected because these
 * lists (unlocks, equipped, history) are sets in game.
 */
export function NumberChipList({
  values,
  inputId,
  onAdd,
  onRemove,
  onClear
}: NumberChipListProps) {
  const t = useTranslations('meta_save_data')

  const handleAdd = (newValues: number[]) => {
    const existing = new Set(values)
    const fresh = newValues.filter((value) => !existing.has(value))
    if (fresh.length === 0) {
      toast(t('duplicate_value'))
      return
    }
    onAdd(fresh)
  }

  return (
    <div className="space-y-2">
      {values.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="bg-muted/25 inline-flex items-center gap-1 rounded-full
                border px-2 py-0.5 font-mono text-xs"
            >
              <span>{value}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-5"
                aria-label={t('remove_value', { value })}
                title={t('remove_value', { value })}
                onClick={() => onRemove(value)}
              >
                <X className="size-3" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">{t('empty')}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <AddValuesForm onAdd={handleAdd} inputId={inputId} />
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          {t('clear')}
        </Button>
      </div>
    </div>
  )
}

/**
 * Adds one value or a whole range (`from` and optional `to`) to a list.
 */
function AddValuesForm({
  onAdd,
  inputId
}: {
  onAdd: (values: number[]) => void
  inputId: string
}) {
  const t = useTranslations('meta_save_data')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const fromTrimmed = from.trim()
    const start = Number(fromTrimmed)
    if (fromTrimmed === '' || !Number.isInteger(start)) return

    const toTrimmed = to.trim()
    if (toTrimmed === '') {
      onAdd([start])
      setFrom('')
      return
    }

    const end = Number(toTrimmed)
    if (!Number.isInteger(end) || end < start) return

    const range: number[] = []
    for (let value = start; value <= end; value += 1) {
      range.push(value)
    }
    onAdd(range)
    setFrom('')
    setTo('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <Input
        id={inputId}
        type="number"
        step={1}
        value={from}
        onChange={(event) => setFrom(event.currentTarget.value)}
        placeholder={t('value_placeholder')}
        aria-label={t('value_placeholder')}
        className="h-8 w-24 font-mono"
      />
      <span className="text-muted-foreground text-sm">{t('range_to')}</span>
      <Input
        id={`${inputId}-to`}
        type="number"
        step={1}
        value={to}
        onChange={(event) => setTo(event.currentTarget.value)}
        placeholder={t('range_to_placeholder')}
        aria-label={t('range_to_placeholder')}
        className="h-8 w-24 font-mono"
      />
      <Button type="submit" variant="outline" size="sm">
        {t('add_value')}
      </Button>
    </form>
  )
}
