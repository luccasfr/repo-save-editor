import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PURCHASED_ITEMS_ICON } from '@/consts/purchased-items-icon'
import { useRunStats } from '@/hooks/use-run-stats'
import { ItemsPurchased, SaveDataType } from '@/model/save-game'
import { Box, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StatsItem } from './stats-item'

type PurchasedItemsProps = {
  saveData: SaveDataType
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void
}

export function PurchasedItems({
  saveData,
  onUpdateSaveData
}: PurchasedItemsProps) {
  const t = useTranslations('run_stats')
  const { handleItemsPurchasedChange } = useRunStats(saveData, onUpdateSaveData)

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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(
              saveData.dictionaryOfDictionaries.value.itemsPurchased
            ).map(([key, value]) => {
              const itemName = key.replace('Item ', '').replace(/_/g, ' ')
              return (
                <StatsItem
                  key={key}
                  icon={PURCHASED_ITEMS_ICON[itemName] ?? Zap}
                  titleKey={itemName}
                  value={value.toString()}
                  onIncrease={() =>
                    handleItemsPurchasedChange(key as keyof ItemsPurchased, 1)
                  }
                  onDecrease={() =>
                    handleItemsPurchasedChange(key as keyof ItemsPurchased, -1)
                  }
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
