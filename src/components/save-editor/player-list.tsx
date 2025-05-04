import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { usePlayerUpgrades } from '@/hooks/use-player-upgrades'
import { SaveGame } from '@/model/save-game'
import { SteamAvatars } from '@/model/steam-avatars'
import {
  ArrowBigUp,
  BicepsFlexed,
  CircleChevronUp,
  Cross,
  Crown,
  MoveUp,
  Users,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { HealthBar, StaminaBar } from './player-status-bars'
import { UpgradeCount } from './upgrade-count'

type PlayerListProps = {
  saveGame: SaveGame
  steamAvatars: SteamAvatars | null
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export default function PlayerList({
  saveGame,
  onUpdateSaveData,
  steamAvatars
}: PlayerListProps) {
  const t = useTranslations('player_list')
  const { getUpgradeValue, handleIncrease, handleDecrease, setUpgradeValue } =
    usePlayerUpgrades(saveGame, onUpdateSaveData)

  const handleIncreaseHealth = (key: string) => {
    handleIncrease(key, 'playerUpgradeHealth')
    const healthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    const maxHealth = 100 + healthUpgrade * 20
    setUpgradeValue(key, 'playerHealth', maxHealth)
  }

  const handleDecreaseHealth = (key: string) => {
    handleDecrease(key, 'playerUpgradeHealth')
    const healthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    const maxHealth = 100 + healthUpgrade * 20
    setUpgradeValue(key, 'playerHealth', maxHealth)
  }

  return (
    saveGame?.playerNames &&
    Object.entries(saveGame?.playerNames.value).map(([key, value]) => (
      <Card key={key}>
        <CardHeader>
          <CardTitle className="relative w-fit">
            {saveGame.dictionaryOfDictionaries.value.playerHasCrown[key] ? (
              <div className="absolute -top-4 left-1">
                <Crown className="size-3.5 text-yellow-500" />
              </div>
            ) : null}
            <div className="flex h-6 items-baseline gap-2">
              {steamAvatars && steamAvatars[key] ? (
                <Image
                  src={steamAvatars[key]}
                  alt="avatar"
                  className=""
                  width={24}
                  height={24}
                />
              ) : null}
              <p>{value}</p>
            </div>
          </CardTitle>
          <CardDescription className="font-mono">{key}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="font-bold">{t('status')}</h1>
          <HealthBar
            healthUpgrade={getUpgradeValue(key, 'playerUpgradeHealth')}
            health={getUpgradeValue(key, 'playerHealth')}
            onChange={(newHealth) =>
              setUpgradeValue(key, 'playerHealth', newHealth)
            }
          />
          <StaminaBar stamina={getUpgradeValue(key, 'playerUpgradeStamina')} />
          <Separator />
          <h1 className="font-bold">{t('upgrades')}</h1>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <UpgradeCount
              icon={Cross}
              count={getUpgradeValue(key, 'playerUpgradeHealth')}
              titleKey="health"
              onIncrease={() => handleIncreaseHealth(key)}
              onDecrease={() => handleDecreaseHealth(key)}
            />
            <UpgradeCount
              icon={Zap}
              count={getUpgradeValue(key, 'playerUpgradeStamina')}
              titleKey="stamina"
              onIncrease={() => handleIncrease(key, 'playerUpgradeStamina')}
              onDecrease={() => handleDecrease(key, 'playerUpgradeStamina')}
            />
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
