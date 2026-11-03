'use client'

import { CommitInput } from '@/components/save-editor/commit-input'
import { NumberChipList } from '@/components/save-editor/number-chip-list'
import { PresetRows } from '@/components/save-editor/preset-rows'
import { SaveDataActionButton } from '@/components/save-editor/save-data'
import { TokenCounts } from '@/components/save-editor/token-counts'
import { UnlockAllCosmetics } from '@/components/save-editor/unlock-all-cosmetics'
import { useMetaSave, type MetaActions } from '@/hooks/use-meta-save'
import {
  META_SAVE_KEYS,
  isNumberList,
  isNumberListList,
  unwrapTypedValue,
  type MetaSave,
  type MetaSaveKey
} from '@/model/meta-save'
import { Plus, RotateCcw, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * Editor kind for a known meta save key. `auto` decides from the actual
 * value's shape, so a key whose on-disk type is not confirmed still gets a
 * sensible editor (or a read-only view).
 */
type SectionKind = 'tokens' | 'chips' | 'presets' | 'scalar' | 'raw' | 'auto'

type Section = {
  key: MetaSaveKey
  kind: SectionKind
  titleKey: string
  descriptionKey: string
}

const SECTIONS: Section[] = [
  {
    key: 'cosmeticTokens',
    kind: 'tokens',
    titleKey: 'tokens_title',
    descriptionKey: 'tokens_description'
  },
  {
    key: 'cosmeticUnlocks',
    kind: 'chips',
    titleKey: 'unlocks_title',
    descriptionKey: 'unlocks_description'
  },
  {
    key: 'cosmeticEquipped',
    kind: 'chips',
    titleKey: 'equipped_title',
    descriptionKey: 'equipped_description'
  },
  {
    key: 'cosmeticHistory',
    kind: 'chips',
    titleKey: 'history_title',
    descriptionKey: 'history_description'
  },
  {
    key: 'cosmeticPresets',
    kind: 'presets',
    titleKey: 'cosmetics_presets_title',
    descriptionKey: 'cosmetics_presets_description'
  },
  {
    key: 'colorPresets',
    kind: 'presets',
    titleKey: 'colors_presets_title',
    descriptionKey: 'colors_presets_description'
  },
  {
    key: 'colorsEquipped',
    kind: 'scalar',
    titleKey: 'colors_equipped_title',
    descriptionKey: 'colors_equipped_description'
  },
  {
    key: 'cosmetic',
    kind: 'auto',
    titleKey: 'cosmetic_title',
    descriptionKey: 'cosmetic_description'
  }
]

type MetaSaveDataProps = {
  metaSave: MetaSave
  onUpdateMetaSave: (updatedMetaSave: MetaSave) => void
  onReset: () => void
  hasChanges: boolean
  onSave: () => void
  onNewFile: () => void
  fileName?: string | null
}

export function MetaSaveData({
  metaSave,
  onUpdateMetaSave,
  onReset,
  hasChanges,
  onSave,
  onNewFile,
  fileName
}: MetaSaveDataProps) {
  const tSave = useTranslations('save_data')
  const meta = useMetaSave({ metaSave, onUpdateMetaSave })

  const knownKeys = new Set<string>(META_SAVE_KEYS)
  const presentSections = SECTIONS.filter((section) => section.key in metaSave)
  const otherKeys = Object.keys(metaSave).filter((key) => !knownKeys.has(key))

  return (
    <div className="space-y-4">
      {fileName && (
        <div className="text-muted-foreground font-mono">{fileName}</div>
      )}
      <div className="flex items-center justify-between gap-2">
        <SaveDataActionButton
          icon={Plus}
          label={tSave('new_file')}
          onClick={onNewFile}
        />
        <div className="flex items-center gap-2">
          <SaveDataActionButton
            icon={RotateCcw}
            label={tSave('reset')}
            onClick={onReset}
            disabled={!hasChanges}
          />
          <SaveDataActionButton
            icon={Save}
            label={tSave('save')}
            onClick={onSave}
            disabled={!hasChanges}
          />
        </div>
      </div>
      <div className="space-y-6">
        {presentSections.map((section) => (
          <MetaSection
            key={section.key}
            section={section}
            metaSave={metaSave}
            meta={meta}
          />
        ))}
        {otherKeys.length > 0 && (
          <OtherKeys otherKeys={otherKeys} metaSave={metaSave} />
        )}
      </div>
    </div>
  )
}

function MetaSection({
  section,
  metaSave,
  meta
}: {
  section: Section
  metaSave: MetaSave
  meta: MetaActions
}) {
  const t = useTranslations('meta_save_data')
  const value = unwrapTypedValue(metaSave[section.key])
  const kind = section.kind === 'auto' ? kindForValue(value) : section.kind

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-bold">{t(section.titleKey)}</h2>
        <p className="text-muted-foreground text-sm">
          {t(section.descriptionKey)}
        </p>
      </div>
      {kind === 'tokens' &&
        (isNumberList(value) ? (
          <TokenCounts keyName={section.key} values={value} meta={meta} />
        ) : (
          <RawValue value={value} />
        ))}
      {kind === 'chips' &&
        (isNumberList(value) ? (
          <div className="space-y-3">
            {section.key === 'cosmeticUnlocks' ? (
              <UnlockAllCosmetics
                values={value}
                onUnlockAll={() => meta.unlockAllCosmetics(section.key)}
              />
            ) : null}
            <NumberChipList
              values={value}
              inputId={`${section.key}-add`}
              onAdd={(newValues) => meta.appendNumbers(section.key, newValues)}
              onRemove={(removed) => meta.removeValue(section.key, removed)}
              onClear={() => meta.clear(section.key)}
            />
          </div>
        ) : (
          <RawValue value={value} />
        ))}
      {kind === 'presets' &&
        (isNumberListList(value) ? (
          <PresetRows keyName={section.key} values={value} meta={meta} />
        ) : (
          <RawValue value={value} />
        ))}
      {kind === 'scalar' &&
        (typeof value === 'number' && Number.isFinite(value) ? (
          <ScalarEditor keyName={section.key} value={value} meta={meta} />
        ) : (
          <RawValue value={value} />
        ))}
      {kind === 'raw' && <RawValue value={value} />}
    </section>
  )
}

function kindForValue(value: unknown): SectionKind {
  if (isNumberListList(value)) return 'presets'
  if (isNumberList(value)) return 'chips'
  if (typeof value === 'number' && Number.isFinite(value)) return 'scalar'
  return 'raw'
}

function ScalarEditor({
  keyName,
  value,
  meta
}: {
  keyName: string
  value: number
  meta: MetaActions
}) {
  const t = useTranslations('meta_save_data')

  return (
    <CommitInput
      key={`${keyName}-${value}`}
      id={`${keyName}-value`}
      type="number"
      step={1}
      min={0}
      value={value}
      className="max-w-40 font-mono"
      aria-label={t('scalar_value')}
      onCommit={(draft) => {
        const parsed = Number(draft)
        if (!Number.isInteger(parsed) || parsed < 0) return false
        meta.setNumber(keyName, parsed)
      }}
    />
  )
}

/**
 * Read-only fallback for a value whose shape is not recognized. The value is
 * preserved unchanged when the file is saved.
 */
function RawValue({ value }: { value: unknown }) {
  const t = useTranslations('meta_save_data')

  return (
    <div className="space-y-1">
      <pre
        className="bg-muted/25 overflow-x-auto rounded-lg border p-3 font-mono
          text-xs"
      >
        {JSON.stringify(value, null, 2) ?? 'null'}
      </pre>
      <p className="text-muted-foreground text-xs">{t('raw_note')}</p>
    </div>
  )
}

function OtherKeys({
  otherKeys,
  metaSave
}: {
  otherKeys: string[]
  metaSave: MetaSave
}) {
  const t = useTranslations('meta_save_data')

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-bold">{t('other_keys_title')}</h2>
        <p className="text-muted-foreground text-sm">
          {t('other_keys_description')}
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left">
          <tbody>
            {otherKeys.map((key) => (
              <tr key={key} className="border-border border-b last:border-0">
                <td
                  className="bg-muted/25 border-border border-r px-3 py-2
                    align-top font-mono text-xs whitespace-nowrap"
                >
                  {key}
                </td>
                <td className="px-3 py-2 align-top font-mono text-xs break-all">
                  {JSON.stringify(unwrapTypedValue(metaSave[key]), null, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
