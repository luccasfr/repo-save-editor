import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSaveGame } from '@/hooks/use-save-game'
import { usePlayerUpgrades } from '@/hooks/use-player-upgrades'
import { SaveGame } from '@/model/save-game'
import { SteamAvatars } from '@/model/steam-avatars'
import { Crown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CommitInput } from './commit-input'
import { PlayerAvatar } from './player-avatar'
import { HealthBar, StaminaBar } from './player-status-bars'
import { PlayerUpgrades } from './player-upgrades'
import { RemovePlayer } from './remove-player'

type PlayerListProps = {
  saveGame: SaveGame
  steamAvatars: SteamAvatars | null
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function PlayerList({
  saveGame,
  onUpdateSaveData,
  steamAvatars
}: PlayerListProps) {
  const t = useTranslations('player_list')
  const { getUpgradeValue, setUpgradeValue } = usePlayerUpgrades(
    saveGame,
    onUpdateSaveData
  )
  const { updatePlayerName, updatePlayerCrown } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })

  return (
    saveGame?.playerNames &&
    Object.entries(saveGame?.playerNames.value).map(([key, value]) => {
      const hasCrown =
        saveGame.dictionaryOfDictionaries.value.playerHasCrown[key] > 0
      const playerNameInputId = `player-name-${key}`

      return (
        <Card key={key}>
          <CardHeader
            className="flex flex-col items-start justify-between gap-4
              sm:flex-row"
          >
            <div className="min-w-0 flex-1 space-y-3">
              <CardTitle>
                <PlayerAvatar
                  hasCrown={hasCrown}
                  url={(steamAvatars && steamAvatars[key]) || undefined}
                  name={value}
                />
              </CardTitle>
              <CardDescription className="font-mono break-all">
                {key}
              </CardDescription>
              <div className="max-w-sm space-y-1.5">
                <Label htmlFor={playerNameInputId}>{t('name')}</Label>
                <CommitInput
                  key={`${key}-${value}`}
                  id={playerNameInputId}
                  value={value}
                  onCommit={(newName) => {
                    const trimmedName = newName.trim()
                    if (!trimmedName || trimmedName === value) return false
                    updatePlayerName(key, trimmedName)
                  }}
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={hasCrown ? 'default' : 'outline'}
                aria-pressed={hasCrown}
                aria-label={t('toggle_crown', { name: value })}
                onClick={() => updatePlayerCrown(key, !hasCrown)}
              >
                <Crown className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('crown')}</span>
              </Button>
              <RemovePlayer
                saveGame={saveGame}
                onUpdateSaveData={onUpdateSaveData}
                playerId={key}
              />
            </div>
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
            <StaminaBar
              stamina={getUpgradeValue(key, 'playerUpgradeStamina')}
            />
            <Separator />
            <h1 className="font-bold">{t('upgrades')}</h1>
            <PlayerUpgrades
              saveGame={saveGame}
              onUpdateSaveData={onUpdateSaveData}
              playerId={key}
            />
          </CardContent>
        </Card>
      )
    })
  )
}
