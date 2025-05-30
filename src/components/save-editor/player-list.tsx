import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { usePlayerUpgrades } from '@/hooks/use-player-upgrades'
import { SaveGame } from '@/model/save-game'
import { SteamAvatars } from '@/model/steam-avatars'
import { Crown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import PlayerUpgrades from './player-upgrades'
import { HealthBar, StaminaBar } from './player-status-bars'

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
  const { getUpgradeValue, setUpgradeValue } = usePlayerUpgrades(
    saveGame,
    onUpdateSaveData
  )

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
          <PlayerUpgrades
            saveGame={saveGame}
            onUpdateSaveData={onUpdateSaveData}
            playerId={key}
          />
        </CardContent>
      </Card>
    ))
  )
}
