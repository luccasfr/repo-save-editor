import type { SaveGame } from '@/model/save-game'

/**
 * Represents the keys for run statistics that can be updated
 */
export type RunStatKey =
  | 'level'
  | 'currency'
  | 'totalHaul'
  | 'chargingStationCharge'

/**
 * Hook for managing game run statistics
 *
 * @param saveData - The current save data object
 * @param onUpdateSaveData - Callback function to update the save data
 * @returns Object with functions to get and modify run statistics
 */
export function useRunStats(
  saveData: SaveGame,
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
) {
  /**
   * Updates a specific run statistic value
   *
   * @param statName - The name of the statistic to update
   * @param newValue - The new value for the statistic
   */
  const updateRunStatValue = (statName: RunStatKey, newValue: number) => {
    const updatedSaveData = { ...saveData }
    updatedSaveData.dictionaryOfDictionaries.value.runStats[statName] = newValue
    onUpdateSaveData(updatedSaveData)
  }

  /**
   * Updates the quantity of a purchased item
   *
   * @param itemName - The name of the item to update
   * @param newValue - The new quantity value
   */
  const updatePurchasedItemValue = (itemName: string, newValue: number) => {
    const updatedSaveData = { ...saveData }
    updatedSaveData.dictionaryOfDictionaries.value.itemsPurchased[itemName] =
      newValue
    updatedSaveData.dictionaryOfDictionaries.value.itemsPurchasedTotal[
      itemName
    ] = newValue
    onUpdateSaveData(updatedSaveData)
  }

  /**
   * Handles changes to a run statistic with validation
   *
   * @param statName - The name of the statistic to change
   * @param change - The amount to change the statistic by (positive or negative)
   * @param minValue - The minimum allowed value for the statistic (default: 0)
   */
  const handleStatChange = (
    statName: RunStatKey,
    change: number,
    minValue = 0
  ) => {
    const currentValue =
      saveData.dictionaryOfDictionaries.value.runStats[statName]
    const newValue = Math.max(minValue, currentValue + change)
    updateRunStatValue(statName, newValue)
  }

  /**
   * Handles changes to purchased item quantities with validation
   *
   * @param statName - The name of the item to change
   * @param change - The quantity change amount (positive or negative)
   * @param minValue - The minimum allowed quantity (default: 0)
   */
  const handleItemsPurchasedChange = (
    statName: string,
    change: number,
    minValue = 0
  ) => {
    const currentValue =
      saveData.dictionaryOfDictionaries.value.itemsPurchased[statName]
    const newValue = Math.max(minValue, currentValue + change)
    updatePurchasedItemValue(statName, newValue)
  }

  /**
   * Gets the current value of a run statistic
   *
   * @param statName - The name of the statistic to retrieve
   * @returns The current value of the statistic
   */
  const getRunStatValue = (statName: RunStatKey) => {
    return saveData.dictionaryOfDictionaries.value.runStats[statName]
  }

  /**
   * Gets the current quantity of a purchased item
   *
   * @param itemName - The name of the item to retrieve
   * @returns The current quantity of the item
   */
  const getItemPurchasedValue = (itemName: string) => {
    return saveData.dictionaryOfDictionaries.value.itemsPurchased[itemName]
  }

  return {
    getRunStatValue,
    getItemPurchasedValue,
    handleStatChange,
    handleItemsPurchasedChange
  }
}
