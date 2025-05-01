import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { usePlayerUpgrades } from '@/hooks/use-player-upgrades'
import { SaveDataType } from '@/model/save-game'
import {
  ArrowBigUp,
  BicepsFlexed,
  CircleChevronUp,
  Crown,
  MoveUp,
  Users,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Separator } from '../ui/separator'
import { HealthBar, StaminaBar } from './player-status-bars'
import { UpgradeCount } from './upgrade-count'

type PlayerListProps = {
  saveData: SaveDataType
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void
}

export default function PlayerList({
  saveData,
  onUpdateSaveData
}: PlayerListProps) {
  const t = useTranslations('player_list')
  const { getUpgradeValue, handleIncrease, handleDecrease } = usePlayerUpgrades(
    saveData,
    onUpdateSaveData
  )

  return (
    saveData?.playerNames &&
    Object.entries(saveData?.playerNames.value).map(([key, value]) => (
      <Card key={key}>
        <CardHeader>
          <CardTitle className="relative w-fit">
            {saveData.dictionaryOfDictionaries.value.playerHasCrown[key] ? (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="size-3.5 text-yellow-500" />
              </div>
            ) : null}
            {value}
          </CardTitle>
          <CardDescription className="font-mono">{key}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="font-bold">{t('status')}</h1>
          <HealthBar
            healthUpgrade={getUpgradeValue(key, 'playerUpgradeHealth')}
            health={getUpgradeValue(key, 'playerHealth')}
          />
          <StaminaBar stamina={getUpgradeValue(key, 'playerUpgradeStamina')} />
          <Separator />
          <h1 className="font-bold">{t('upgrades')}</h1>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <UpgradeCount
              icon={Zap}
              count={getUpgradeValue(key, 'playerUpgradeSpeed')}
              titleKey="speed"
              onIncrease={() => handleIncrease(key, 'playerUpgradeSpeed')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeSpeed')}
            />
            <UpgradeCount
              icon={BicepsFlexed}
              count={getUpgradeValue(key, 'playerUpgradeStrength')}
              titleKey="strength"
              onIncrease={() => handleIncrease(key, 'playerUpgradeStrength')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeStrength')}
            />
            <UpgradeCount
              icon={MoveUp}
              count={getUpgradeValue(key, 'playerUpgradeRange')}
              titleKey="range"
              onIncrease={() => handleIncrease(key, 'playerUpgradeRange')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeRange')}
            />
            <UpgradeCount
              icon={CircleChevronUp}
              count={getUpgradeValue(key, 'playerUpgradeLaunch')}
              titleKey="launch"
              onIncrease={() => handleIncrease(key, 'playerUpgradeLaunch')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeLaunch')}
            />
            <UpgradeCount
              icon={ArrowBigUp}
              count={getUpgradeValue(key, 'playerUpgradeExtraJump')}
              titleKey="extra_jump"
              onIncrease={() => handleIncrease(key, 'playerUpgradeExtraJump')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeExtraJump')}
            />
            <UpgradeCount
              icon={Users}
              count={getUpgradeValue(key, 'playerUpgradeMapPlayerCount')}
              titleKey="player_count"
              onIncrease={() =>
                handleIncrease(key, 'playerUpgradeMapPlayerCount')
              }
              onDecrease={() =>
                handleDecrease(key, 'playerUpgradeMapPlayerCount')
              }
            />
          </div>
        </CardContent>
      </Card>
    ))
  )
}
