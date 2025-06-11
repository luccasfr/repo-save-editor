import { SaveGame } from '@/model/save-game'

/**
 * Available player upgrade types that can be modified
 */
export enum upgradeType {
  Speed = 'playerUpgradeSpeed',
  Strength = 'playerUpgradeStrength',
  Range = 'playerUpgradeRange',
  Launch = 'playerUpgradeLaunch',
  ExtraJump = 'playerUpgradeExtraJump',
  MapPlayerCount = 'playerUpgradeMapPlayerCount',
  Stamina = 'playerUpgradeStamina',
  Health = 'playerHealth',
  UpgradeHealth = 'playerUpgradeHealth',
  CrouchRest = 'playerUpgradeCrouchRest',
  TumbleWings = 'playerUpgradeTumbleWings'
}

/**
 * Type representing the keys of player upgrades
 */
export type UpgradeType = `${upgradeType}`

/**
 * Hook for managing player upgrades in the save data
 *
 * @param saveData - The current save data object
 * @param onUpdateSaveData - Callback function to update the save data
 * @returns Object with functions to get and modify player upgrades
 */
export function usePlayerUpgrades(
  saveData: SaveGame,
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
) {
  /**
   * Updates a specific player upgrade value
   *
   * @param playerId - The ID of the player to update
   * @param upgradeType - The type of upgrade to modify
   * @param newValue - The new value for the upgrade
   */
  const updateUpgradeValue = (
    playerId: string,
    upgradeType: UpgradeType,
    newValue: number
  ) => {
    const updatedSaveData = { ...saveData }
    if (!updatedSaveData.dictionaryOfDictionaries.value[upgradeType]) return
    updatedSaveData.dictionaryOfDictionaries.value[upgradeType][playerId] =
      newValue
    onUpdateSaveData(updatedSaveData)
  }

  /**
   * Increases a player's upgrade value by 1
   *
   * @param playerId - The ID of the player
   * @param upgradeType - The type of upgrade to increase
   */
  const handleIncrease = (playerId: string, upgradeType: UpgradeType) => {
    if (!saveData?.dictionaryOfDictionaries.value[upgradeType]) return
    const currentValue =
      saveData?.dictionaryOfDictionaries.value[upgradeType][playerId] ?? 0
    updateUpgradeValue(playerId, upgradeType, currentValue + 1)
  }

  /**
   * Decreases a player's upgrade value by 1 if greater than 0
   *
   * @param playerId - The ID of the player
   * @param upgradeType - The type of upgrade to decrease
   */
  const handleDecrease = (playerId: string, upgradeType: UpgradeType) => {
    if (!saveData?.dictionaryOfDictionaries.value[upgradeType]) return
    const currentValue =
      saveData?.dictionaryOfDictionaries.value[upgradeType][playerId] ?? 0
    if (currentValue > 0) {
      updateUpgradeValue(playerId, upgradeType, currentValue - 1)
    }
  }

  /**
   * Sets a player's upgrade value to a specific number
   *
   * @param playerId - The ID of the player
   * @param upgradeType - The type of upgrade to set
   * @param newValue - The new value for the upgrade
   */
  const setUpgradeValue = (
    playerId: string,
    upgradeType: UpgradeType,
    newValue: number
  ) => {
    updateUpgradeValue(playerId, upgradeType, newValue)
  }

  /**
   * Gets the current value of a player's upgrade
   *
   * @param playerId - The ID of the player
   * @param upgradeType - The type of upgrade to retrieve
   * @returns The current value of the upgrade or 0 if not set
   */
  const getUpgradeValue = (
    playerId: string,
    upgradeType: UpgradeType
  ): number => {
    if (!saveData?.dictionaryOfDictionaries.value[upgradeType]) return 0
    return saveData?.dictionaryOfDictionaries.value[upgradeType][playerId] ?? 0
  }

  return {
    getUpgradeValue,
    handleIncrease,
    handleDecrease,
    setUpgradeValue
  }
}
