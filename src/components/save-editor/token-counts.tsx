import { CommitInput } from '@/components/save-editor/commit-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MetaActions } from '@/hooks/use-meta-save'
import { TOKEN_RARITY_COUNT, countTokensByRarity } from '@/model/meta-save'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

/**
 * Tax-token rarities, in the order of the game's `Rarity` enum
 * (`Common = 0` … `UltraRare = 3`).
 */
const TOKEN_RARITY_KEYS = [
  'token_rarity_0',
  'token_rarity_1',
  'token_rarity_2',
  'token_rarity_3'
] as const

type TokenCountsProps = {
  keyName: string
  values: number[]
  meta: MetaActions
}

/**
 * Edits tax tokens as one count per rarity. The underlying save value is a
 * stack with one entry per token (the entry is the token's rarity), so the
 * stack is rebuilt from these counts on every change.
 */
export function TokenCounts({ keyName, values, meta }: TokenCountsProps) {
  const t = useTranslations('meta_save_data')
  const { counts, invalid } = countTokensByRarity(values)
  const [allValue, setAllValue] = useState('')

  const setCount = (rarity: number, draft: string) => {
    const parsed = Number(draft)
    if (!Number.isInteger(parsed) || parsed < 0) return false
    const next = [...counts]
    next[rarity] = parsed
    meta.setTokenCounts(keyName, next)
  }

  const handleSetAll = () => {
    const parsed = Number(allValue)
    if (!Number.isInteger(parsed) || parsed < 0) return
    meta.setTokenCounts(
      keyName,
      Array.from({ length: TOKEN_RARITY_COUNT }, () => parsed)
    )
    setAllValue('')
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {counts.map((count, rarity) => {
          const rarityKey = TOKEN_RARITY_KEYS[rarity]
          const label = rarityKey ? t(rarityKey) : String(rarity)
          return (
            <div key={rarity} className="flex items-center gap-2">
              <Label
                htmlFor={`${keyName}-token-${rarity}`}
                className="text-muted-foreground w-32 shrink-0 text-sm
                  font-medium"
              >
                {label}
              </Label>
              <CommitInput
                key={`${keyName}-${rarity}-${count}`}
                id={`${keyName}-token-${rarity}`}
                type="number"
                step={1}
                min={0}
                value={count}
                className="max-w-32 font-mono"
                aria-label={t('token_count_label', { rarity: label })}
                onCommit={(draft) => setCount(rarity, draft)}
              />
              <span className="text-muted-foreground text-xs">
                {t('tokens_suffix')}
              </span>
            </div>
          )
        })}
      </div>
      {invalid > 0 ? (
        <div
          className="border-destructive/40 bg-destructive/5 space-y-2 rounded-lg
            border p-3"
        >
          <p className="text-sm">{t('invalid_tokens', { count: invalid })}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => meta.dropInvalidTokens(keyName)}
          >
            {t('remove_invalid')}
          </Button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label
            htmlFor={`${keyName}-set-all`}
            className="text-muted-foreground text-xs"
          >
            {t('set_all_label')}
          </Label>
          <Input
            id={`${keyName}-set-all`}
            type="number"
            step={1}
            min={0}
            value={allValue}
            onChange={(event) => setAllValue(event.currentTarget.value)}
            className="h-8 w-24 font-mono"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSetAll}
        >
          {t('set_all')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => meta.clear(keyName)}
        >
          {t('clear')}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">{t('tokens_stack_note')}</p>
    </div>
  )
}
