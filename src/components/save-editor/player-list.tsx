import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { SaveDataType } from '@/model/save-game'
import {
  ArrowBigUp,
  BicepsFlexed,
  CircleChevronUp,
  Cross,
  Crown,
  LucideIcon,
  Minus,
  MoveUp,
  Plus,
  Users,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

function HealthBar({
  health,
  healthUpgrade
}: {
  health: number
  healthUpgrade: number
}) {
  const maxHealth = useMemo(() => 100 + healthUpgrade * 20, [healthUpgrade])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative flex h-8 w-full items-center justify-end rounded bg-green-800 px-2
              text-white"
          >
            <div
              style={{ width: (health / maxHealth) * 100 + '%' }}
              className="absolute left-0 z-10 flex h-8 items-center justify-between rounded bg-green-600
                px-2 py-1"
            >
              <Cross className="size-4" />
              <p className="font-mono">{health}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {health} / {maxHealth}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function StaminaBar({ stamina }: { stamina: number }) {
  return (
    <div
      className="flex h-8 w-full items-center justify-between gap-1 rounded bg-yellow-500 px-2
        py-1"
    >
      <Zap className="size-4" />
      <p className="font-mono">{stamina * 10 + 40}</p>
    </div>
  )
}

function UpgradeCount({
  count,
  titleKey,
  icon: Icon,
  onIncrease,
  onDecrease
}: {
  count: number
  titleKey: string
  icon: LucideIcon
  onIncrease: () => void
  onDecrease: () => void
}) {
  const t = useTranslations('player_list')

  return (
    <div className="flex flex-col items-center text-sm">
      <p className="font-medium">
        <Icon className="inline-flex size-4 shrink-0 pr-0.5" />
        {t(`attributes.${titleKey}`)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={count <= 0}
        >
          <Minus className="size-3" />
        </Button>
        <p className="font-mono text-lg font-bold">{count}</p>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onIncrease}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}

type PlayerListProps = {
  saveData: SaveDataType
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void
}

type UpgradeType =
  | 'playerUpgradeSpeed'
  | 'playerUpgradeStrength'
  | 'playerUpgradeRange'
  | 'playerUpgradeLaunch'
  | 'playerUpgradeExtraJump'
  | 'playerUpgradeMapPlayerCount'
  | 'playerUpgradeStamina'
  | 'playerHealth'

export default function PlayerList({
  saveData,
  onUpdateSaveData
}: PlayerListProps) {
  const t = useTranslations('player_list')

  const updateUpgradeValue = (
    playerId: string,
    upgradeType: UpgradeType,
    newValue: number
  ) => {
    const updatedSaveData = { ...saveData }
    updatedSaveData.dictionaryOfDictionaries.value[upgradeType][playerId] =
      newValue
    onUpdateSaveData(updatedSaveData)
  }

  return (
    saveData?.playerNames &&
    Object.entries(saveData?.playerNames.value).map(([key, value]) => (
      <Card key={key} className="min-w-96">
        <CardHeader>
          <CardTitle className="relative w-fit">
            {saveData.dictionaryOfDictionaries.value.playerHasCrown[key] ?(
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="size-3.5 text-yellow-500" />
              </div>
            ) : null}
            {value}
          </CardTitle>
          <CardDescription>{key}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="font-bold">{t('status')}</h1>
          <HealthBar
            healthUpgrade={
              saveData?.dictionaryOfDictionaries.value.playerUpgradeHealth[
                key
              ] ?? 0
            }
            health={
              saveData?.dictionaryOfDictionaries.value.playerHealth[key] ?? 0
            }
          />
          <StaminaBar
            stamina={
              saveData?.dictionaryOfDictionaries.value.playerUpgradeStamina[
                key
              ] ?? 0
            }
          />
          <Separator />
          <h1 className="font-bold">{t('upgrades')}</h1>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <UpgradeCount
              icon={Zap}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[
                  key
                ] ?? 0
              }
              titleKey="speed"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[
                    key
                  ] ?? 0
                updateUpgradeValue(key, 'playerUpgradeSpeed', currentValue + 1)
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[
                    key
                  ] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeSpeed',
                    currentValue - 1
                  )
                }
              }}
            />
            <UpgradeCount
              icon={BicepsFlexed}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeStrength[
                  key
                ] ?? 0
              }
              titleKey="strength"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeStrength[key] ?? 0
                updateUpgradeValue(
                  key,
                  'playerUpgradeStrength',
                  currentValue + 1
                )
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeStrength[key] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeStrength',
                    currentValue - 1
                  )
                }
              }}
            />
            <UpgradeCount
              icon={MoveUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[
                  key
                ] ?? 0
              }
              titleKey="range"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[
                    key
                  ] ?? 0
                updateUpgradeValue(key, 'playerUpgradeRange', currentValue + 1)
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[
                    key
                  ] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeRange',
                    currentValue - 1
                  )
                }
              }}
            />
            <UpgradeCount
              icon={CircleChevronUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[
                  key
                ] ?? 0
              }
              titleKey="launch"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[
                    key
                  ] ?? 0
                updateUpgradeValue(key, 'playerUpgradeLaunch', currentValue + 1)
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[
                    key
                  ] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeLaunch',
                    currentValue - 1
                  )
                }
              }}
            />
            <UpgradeCount
              icon={ArrowBigUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeExtraJump[
                  key
                ] ?? 0
              }
              titleKey="extra_jump"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeExtraJump[key] ?? 0
                updateUpgradeValue(
                  key,
                  'playerUpgradeExtraJump',
                  currentValue + 1
                )
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeExtraJump[key] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeExtraJump',
                    currentValue - 1
                  )
                }
              }}
            />
            <UpgradeCount
              icon={Users}
              count={
                saveData?.dictionaryOfDictionaries.value
                  .playerUpgradeMapPlayerCount[key] ?? 0
              }
              titleKey="player_count"
              onIncrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeMapPlayerCount[key] ?? 0
                updateUpgradeValue(
                  key,
                  'playerUpgradeMapPlayerCount',
                  currentValue + 1
                )
              }}
              onDecrease={() => {
                const currentValue =
                  saveData?.dictionaryOfDictionaries.value
                    .playerUpgradeMapPlayerCount[key] ?? 0
                if (currentValue > 0) {
                  updateUpgradeValue(
                    key,
                    'playerUpgradeMapPlayerCount',
                    currentValue - 1
                  )
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    ))
  )
}
