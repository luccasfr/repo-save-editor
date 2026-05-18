'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { PURCHASED_ITEMS_ICON } from '@/consts/purchased-items-icon'
import type { SaveGame } from '@/model/save-game'
import { BatteryCharging, BatteryFull, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

const POWERED_PREFIXES = ['Drone ', 'Gun ', 'Melee ']

type ItemBatteryProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function ItemBattery({ saveGame, onUpdateSaveData }: ItemBatteryProps) {
  const t = useTranslations('run_stats')

  const poweredEntries = Object.entries(
    saveGame.dictionaryOfDictionaries.value.itemStatBattery
  ).filter(([key]) => {
    if (!key.includes('/')) return false
    const typeName = key.replace('Item ', '').split('/')[0]
    return POWERED_PREFIXES.some((prefix) => typeName.startsWith(prefix))
  })

  if (poweredEntries.length === 0) return null

  const handleChange = (key: string, newValue: number) => {
    const next = Math.max(0, Math.min(100, newValue))
    onUpdateSaveData({
      ...saveGame,
      dictionaryOfDictionaries: {
        ...saveGame.dictionaryOfDictionaries,
        value: {
          ...saveGame.dictionaryOfDictionaries.value,
          itemStatBattery: {
            ...saveGame.dictionaryOfDictionaries.value.itemStatBattery,
            [key]: next
          }
        }
      }
    })
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-battery" className="last:border-b">
        <AccordionTrigger className="hover:bg-accent p-2">
          <div className="flex items-center gap-0.5">
            <BatteryCharging className="size-4" />
            <p>{t('battery_title')}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {poweredEntries.map(([key, value]) => {
              const withoutPrefix = key.replace('Item ', '')
              const slashIdx = withoutPrefix.lastIndexOf('/')
              const typeName = withoutPrefix.slice(0, slashIdx)
              const index = withoutPrefix.slice(slashIdx + 1)
              const Icon = PURCHASED_ITEMS_ICON[typeName] ?? Zap
              const pct = Math.min(100, value)

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex min-w-0 items-center gap-1.5 font-medium">
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">
                        {typeName} #{index}
                      </span>
                    </div>
                    <span className="ml-3 shrink-0 font-mono text-sm font-bold">
                      {value}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={0}
                      max={100}
                      value={[pct]}
                      onValueChange={([v]) => handleChange(key, v)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6 shrink-0"
                      onClick={() => handleChange(key, 100)}
                      disabled={value >= 100}
                    >
                      <BatteryFull className="size-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
