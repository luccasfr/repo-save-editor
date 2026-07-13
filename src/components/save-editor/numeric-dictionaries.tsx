import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PURCHASED_ITEMS_ICON } from '@/consts/purchased-items-icon'
import { ITEM_CATALOG_KEYS } from '@/consts/item-catalog-index'
import { useSaveGame } from '@/hooks/use-save-game'
import { parseItemInstanceKey } from '@/lib/item-instance'
import type { EditableNumericDictionaryKey } from '@/model/numeric-dictionary'
import type { SaveGame } from '@/model/save-game'
import {
  BatteryCharging,
  Box,
  Gauge,
  ShoppingCart,
  Zap,
  type LucideIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NumericDictionaryAddForm } from './numeric-dictionary-add-form'
import { NumericDictionaryEntry } from './numeric-dictionary-entry'

type NumericDictionariesProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

type DictionaryDefinition = {
  key: EditableNumericDictionaryKey
  icon: LucideIcon
}

const DICTIONARIES: DictionaryDefinition[] = [
  { key: 'item', icon: Box },
  { key: 'itemBatteryUpgrades', icon: BatteryCharging },
  { key: 'itemStatBattery', icon: Zap },
  { key: 'itemsUpgradesPurchased', icon: Gauge },
  { key: 'itemsPurchasedTotal', icon: ShoppingCart }
]

const KNOWN_PURCHASED_ITEM_NAMES = Object.keys(PURCHASED_ITEMS_ICON).map(
  (itemName) => `Item ${itemName}`
)

function getSuggestedKeys(
  dictionaryName: EditableNumericDictionaryKey,
  itemKeys: string[]
) {
  if (dictionaryName === 'item') {
    const existingBaseNames = itemKeys.flatMap((key) => {
      const parsedKey = parseItemInstanceKey(key)
      return parsedKey ? [parsedKey.baseName] : []
    })
    return [...new Set([...existingBaseNames, ...ITEM_CATALOG_KEYS])]
  }

  if (
    dictionaryName === 'itemBatteryUpgrades' ||
    dictionaryName === 'itemStatBattery'
  ) {
    return itemKeys
  }

  return KNOWN_PURCHASED_ITEM_NAMES
}

export function NumericDictionaries({
  saveGame,
  onUpdateSaveData
}: NumericDictionariesProps) {
  const t = useTranslations('run_stats')
  const {
    addNumericDictionaryEntry,
    duplicateItemInstance,
    removeNumericDictionaryEntry,
    updateNumericDictionaryValue
  } = useSaveGame({ saveGame, onUpdateSaveData })
  const dictionaries = saveGame.dictionaryOfDictionaries.value
  const itemKeys = Object.keys(dictionaries.item)

  return (
    <section aria-labelledby="numeric-dictionaries-title">
      <div className="mb-2 space-y-0.5 px-2">
        <h2 id="numeric-dictionaries-title" className="text-sm font-semibold">
          {t('numeric_dictionaries_title')}
        </h2>
        <p className="text-muted-foreground text-xs">
          {t('numeric_dictionaries_description')}
        </p>
      </div>
      <Accordion type="multiple">
        {DICTIONARIES.map(({ key: dictionaryName, icon: Icon }) => {
          const entries = Object.entries(dictionaries[dictionaryName])
          const dictionaryLabel = t(`dictionary_names.${dictionaryName}`)

          return (
            <AccordionItem key={dictionaryName} value={dictionaryName}>
              <AccordionTrigger className="hover:bg-accent rounded-md px-2">
                <span className="flex items-center gap-1.5">
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{dictionaryLabel}</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    ({entries.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-2">
                <NumericDictionaryAddForm
                  dictionaryName={dictionaryName}
                  entries={dictionaries[dictionaryName]}
                  suggestions={getSuggestedKeys(dictionaryName, itemKeys)}
                  onAdd={(entryKey, value) =>
                    addNumericDictionaryEntry(dictionaryName, entryKey, value)
                  }
                />
                {entries.length === 0 ? (
                  <p className="text-muted-foreground py-2 text-sm">
                    {t('empty_dictionary')}
                  </p>
                ) : (
                  <div className="grid gap-3 py-2 md:grid-cols-2">
                    {entries.map(([entryKey, entryValue], index) => {
                      const inputId = `${dictionaryName}-entry-${index}`

                      return (
                        <NumericDictionaryEntry
                          key={entryKey}
                          dictionaryName={dictionaryName}
                          dictionaryLabel={dictionaryLabel}
                          entryKey={entryKey}
                          entryValue={entryValue}
                          inputId={inputId}
                          onDuplicate={
                            dictionaryName === 'item'
                              ? () => duplicateItemInstance(entryKey)
                              : undefined
                          }
                          onRemove={() =>
                            removeNumericDictionaryEntry(
                              dictionaryName,
                              entryKey
                            )
                          }
                          onUpdate={
                            dictionaryName === 'item'
                              ? undefined
                              : (value) =>
                                  updateNumericDictionaryValue(
                                    dictionaryName,
                                    entryKey,
                                    value
                                  )
                          }
                        />
                      )
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </section>
  )
}
