import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { SaveDataType } from '@/model/save-game'
import { DollarSign, Gauge, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StatsItem } from './stats-item'
import { formatPlayTime } from '@/utils/format-utils'
import { PurchasedItems } from './purchased-items'
import { useRunStats } from '@/hooks/use-run-stats'

type RunStatsProps = {
  saveData: SaveDataType
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void
}

export default function RunStats({
  saveData,
  onUpdateSaveData
}: RunStatsProps) {
  const t = useTranslations('run_stats')
  const { getRunStatValue, handleStatChange } = useRunStats(
    saveData,
    onUpdateSaveData
  )

  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>{saveData.teamName.value}</CardTitle>
        <CardDescription>
          {formatPlayTime(saveData.timePlayed.value)} {t('played_time')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatsItem
            icon={Gauge}
            titleKey="level"
            value={(getRunStatValue('level') + 1).toString()}
            onIncrease={() => handleStatChange('level', 1, 1)}
            onDecrease={() => handleStatChange('level', -1, 1)}
            disableDecrease={getRunStatValue('level') <= 1}
          />
          <StatsItem
            icon={DollarSign}
            titleKey="currency"
            value={getRunStatValue('currency').toString()}
            onIncrease={() => handleStatChange('currency', 1)}
            onDecrease={() => handleStatChange('currency', -1)}
            disableDecrease={getRunStatValue('currency') <= 0}
          />
          <StatsItem
            icon={DollarSign}
            titleKey="total_haul"
            value={getRunStatValue('totalHaul').toString()}
            onIncrease={() => handleStatChange('totalHaul', 1)}
            onDecrease={() => handleStatChange('totalHaul', -1)}
            disableDecrease={getRunStatValue('totalHaul') <= 0}
          />
          <StatsItem
            icon={Zap}
            titleKey="charging_station"
            value={getRunStatValue('chargingStationCharge').toString()}
            onIncrease={() => handleStatChange('chargingStationCharge', 1)}
            onDecrease={() => handleStatChange('chargingStationCharge', -1)}
            disableDecrease={getRunStatValue('chargingStationCharge') <= 0}
          />
        </div>
        <Separator />
        <PurchasedItems
          saveData={saveData}
          onUpdateSaveData={onUpdateSaveData}
        />
      </CardContent>
    </Card>
  )
}
