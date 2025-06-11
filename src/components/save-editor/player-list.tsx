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
import { useTranslations } from 'next-intl'
import PlayerAvatar from './player-avatar'
import { HealthBar, StaminaBar } from './player-status-bars'
import PlayerUpgrades from './player-upgrades'
import RemovePlayer from './remove-player'

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
        <CardHeader className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle>
              <PlayerAvatar
                hasCrown={
                  saveGame.dictionaryOfDictionaries.value.playerHasCrown[key] >
                  0
                }
                url={(steamAvatars && steamAvatars[key]) || undefined}
                name={value}
              />
            </CardTitle>
            <CardDescription className="font-mono">{key}</CardDescription>
          </div>
          <RemovePlayer
            saveGame={saveGame}
            onUpdateSaveData={onUpdateSaveData}
            playerId={key}
          />
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
