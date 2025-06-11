import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PURCHASED_ITEMS_ICON } from '@/consts/purchased-items-icon'
import { useRunStats } from '@/hooks/use-run-stats'
import { SaveGame } from '@/model/save-game'
import { Box, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StatsItem } from './stats-item'

type PurchasedItemsProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function PurchasedItems({
  saveGame,
  onUpdateSaveData
}: PurchasedItemsProps) {
  const t = useTranslations('run_stats')
  const { handleItemsPurchasedChange } = useRunStats(saveGame, onUpdateSaveData)

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="last:border-b">
        <AccordionTrigger className="hover:bg-accent p-2">
          <div className="flex items-center gap-0.5">
            <Box className="size-4" />
            <p>{t(`items_title`)}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(
              saveGame.dictionaryOfDictionaries.value.itemsPurchased
            ).map(([key, value]) => {
              const itemName = key.replace('Item ', '').replaceAll('_', ' ')
              return (
                <StatsItem
                  key={key}
                  icon={PURCHASED_ITEMS_ICON[itemName] ?? Zap}
                  titleKey={itemName}
                  value={value.toString()}
                  onIncrease={() => handleItemsPurchasedChange(key, 1)}
                  onDecrease={() => handleItemsPurchasedChange(key, -1)}
                  disableDecrease={value <= 0}
                />
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
