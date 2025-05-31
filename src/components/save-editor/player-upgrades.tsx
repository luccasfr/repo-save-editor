import { UpgradeCount } from '@/components/save-editor/upgrade-count'
import { UPGRADES_ICON } from '@/consts/upgrades-icon'
import {
  UpgradeType,
  upgradeType,
  usePlayerUpgrades
} from '@/hooks/use-player-upgrades'
import { SaveGame } from '@/model/save-game'
import { useMemo } from 'react'

type PlayerUpgradesProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  playerId: string
}

const BASE_HEALTH = 100
const HEALTH_INCREMENT = 20

export default function PlayerUpgrades({
  saveGame,
  onUpdateSaveData,
  playerId
}: PlayerUpgradesProps) {
  const { getUpgradeValue, handleIncrease, handleDecrease, setUpgradeValue } =
    usePlayerUpgrades(saveGame, onUpdateSaveData)

  const upgradeValues = useMemo(
    () =>
      Object.values(upgradeType).filter(
        (upgradeType: UpgradeType) => upgradeType !== 'playerHealth'
      ),
    []
  )

  const handleIncreaseHealth = (key: string) => {
    handleIncrease(key, 'playerUpgradeHealth')
    const healthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    const maxHealth = BASE_HEALTH + healthUpgrade * HEALTH_INCREMENT
    setUpgradeValue(key, 'playerHealth', maxHealth)
  }

  const handleDecreaseHealth = (key: string) => {
    handleDecrease(key, 'playerUpgradeHealth')
    const healthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    const maxHealth = BASE_HEALTH + healthUpgrade * HEALTH_INCREMENT
    setUpgradeValue(key, 'playerHealth', maxHealth)
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {upgradeValues.map(
        (upgrade: UpgradeType) =>
          saveGame.dictionaryOfDictionaries.value[upgrade] && (
            <UpgradeCount
              count={getUpgradeValue(playerId, upgrade)}
              key={upgrade}
              onIncrease={() =>
                upgrade === 'playerUpgradeHealth'
                  ? handleIncreaseHealth(playerId)
                  : handleIncrease(playerId, upgrade)
              }
              onDecrease={() =>
                upgrade === 'playerUpgradeHealth'
                  ? handleDecreaseHealth(playerId)
                  : handleDecrease(playerId, upgrade)
              }
              icon={UPGRADES_ICON[upgrade]}
              titleKey={upgrade}
            />
          )
      )}
    </div>
  )
}
