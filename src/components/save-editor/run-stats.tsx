import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useRunStats } from '@/hooks/use-run-stats'
import type { SaveGame } from '@/model/save-game'
import {
  BatteryCharging,
  DollarSign,
  Gauge,
  HeartPulse,
  Save,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NumericDictionaries } from './numeric-dictionaries'
import { PurchasedItems } from './purchased-items'
import { SaveMetadata } from './save-metadata'
import { StatsItem } from './stats-item'
import { TimePlayedEditor } from './time-played-editor'
import { useSaveGame } from '@/hooks/use-save-game'

type RunStatsProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function RunStats({ saveGame, onUpdateSaveData }: RunStatsProps) {
  const t = useTranslations('run_stats')
  const { getRunStatValue, handleStatChange } = useRunStats(
    saveGame,
    onUpdateSaveData
  )
  const { updateTimePlayed } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })

  const handleTimePlayedChange = (newTimePlayed: number) => {
    updateTimePlayed(newTimePlayed)
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          <TimePlayedEditor
            timePlayed={saveGame.timePlayed.value}
            onTimePlayedChange={handleTimePlayedChange}
          />
        </CardDescription>
        <SaveMetadata saveGame={saveGame} onUpdateSaveData={onUpdateSaveData} />
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
          <StatsItem
            icon={HeartPulse}
            titleKey="lives"
            value={getRunStatValue('lives').toString()}
            onIncrease={() => handleStatChange('lives', 1)}
            onDecrease={() => handleStatChange('lives', -1)}
            disableDecrease={getRunStatValue('lives') <= 0}
          />
          <StatsItem
            icon={BatteryCharging}
            titleKey="charging_station_total"
            value={getRunStatValue('chargingStationChargeTotal').toString()}
            onIncrease={() => handleStatChange('chargingStationChargeTotal', 1)}
            onDecrease={() =>
              handleStatChange('chargingStationChargeTotal', -1)
            }
            disableDecrease={getRunStatValue('chargingStationChargeTotal') <= 0}
          />
          <StatsItem
            icon={Save}
            titleKey="save_level"
            value={getRunStatValue('save level').toString()}
            onIncrease={() => handleStatChange('save level', 1)}
            onDecrease={() => handleStatChange('save level', -1)}
            disableDecrease={getRunStatValue('save level') <= 0}
          />
        </div>
        <Separator />
        <PurchasedItems
          saveGame={saveGame}
          onUpdateSaveData={onUpdateSaveData}
        />
        <Separator />
        <NumericDictionaries
          saveGame={saveGame}
          onUpdateSaveData={onUpdateSaveData}
        />
      </CardContent>
    </Card>
  )
}
