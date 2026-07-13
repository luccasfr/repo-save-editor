import { type SaveGame } from '@/model/save-game'
import {
  parseItemInstanceKey,
  getNextItemInstanceKey
} from '@/lib/item-instance'
import type { EditableNumericDictionaryKey } from '@/model/numeric-dictionary'

/**
 * Props for the useSaveGame hook
 * @typedef {Object} UseSaveGameProps
 * @property {SaveGame} saveGame - The save game data to manage
 * @property {function} onUpdateSaveData - Callback function to handle updates to the save game
 */
type UseSaveGameProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

/**
 * Hook to manage save game data operations
 * @param {UseSaveGameProps} props - The props for the hook
 * @returns {Object} Object containing save game data and methods to manipulate it
 */
export function useSaveGame({ saveGame, onUpdateSaveData }: UseSaveGameProps) {
  /**
   * Updates the time played in the save game data
   * @param newTimePlayed - The new time played value to set
   * @description Updates the timePlayed field in the save game object
   */
  const updateTimePlayed = (newTimePlayed: number) => {
    const updatedSaveGame = {
      ...saveGame,
      timePlayed: {
        ...saveGame.timePlayed,
        value: newTimePlayed
      }
    }
    onUpdateSaveData(updatedSaveGame)
  }

  const updateTeamName = (newTeamName: string) => {
    if (newTeamName === saveGame.teamName.value) return

    const updatedSaveGame = structuredClone(saveGame)
    updatedSaveGame.teamName.value = newTeamName
    updatedSaveGame.teamNameChanged.value = true
    onUpdateSaveData(updatedSaveGame)
  }

  const updateDateAndTime = (newDateAndTime: string) => {
    if (newDateAndTime === saveGame.dateAndTime.value) return

    const updatedSaveGame = structuredClone(saveGame)
    updatedSaveGame.dateAndTime.value = newDateAndTime
    onUpdateSaveData(updatedSaveGame)
  }

  const updatePlayerName = (playerId: string, newPlayerName: string) => {
    if (newPlayerName === saveGame.playerNames.value[playerId]) return

    const updatedSaveGame = structuredClone(saveGame)
    updatedSaveGame.playerNames.value[playerId] = newPlayerName
    onUpdateSaveData(updatedSaveGame)
  }

  const updatePlayerCrown = (playerId: string, hasCrown: boolean) => {
    const updatedSaveGame = structuredClone(saveGame)
    const crowns = updatedSaveGame.dictionaryOfDictionaries.value.playerHasCrown

    if (hasCrown) {
      for (const crownedPlayerId of Object.keys(crowns)) {
        crowns[crownedPlayerId] = 0
      }
    }

    crowns[playerId] = hasCrown ? 1 : 0
    onUpdateSaveData(updatedSaveGame)
  }

  const updateNumericDictionaryValue = (
    dictionaryName: EditableNumericDictionaryKey,
    entryKey: string,
    newValue: number
  ) => {
    const updatedSaveGame = structuredClone(saveGame)
    updatedSaveGame.dictionaryOfDictionaries.value[dictionaryName][entryKey] =
      newValue
    onUpdateSaveData(updatedSaveGame)
  }

  const addNumericDictionaryEntry = (
    dictionaryName: EditableNumericDictionaryKey,
    entryKey: string,
    value: number
  ) => {
    const updatedSaveGame = structuredClone(saveGame)
    const dictionaries = updatedSaveGame.dictionaryOfDictionaries.value
    if (entryKey in dictionaries[dictionaryName]) return false

    dictionaries[dictionaryName][entryKey] = value

    if (dictionaryName === 'item') {
      const parsedKey = parseItemInstanceKey(entryKey)
      if (parsedKey) {
        const currentCount =
          dictionaries.itemsPurchased[parsedKey.baseName] ?? 0
        const totalCount =
          dictionaries.itemsPurchasedTotal[parsedKey.baseName] ?? 0
        dictionaries.itemsPurchased[parsedKey.baseName] = currentCount + 1
        dictionaries.itemsPurchasedTotal[parsedKey.baseName] = totalCount + 1
      }
    }

    onUpdateSaveData(updatedSaveGame)
    return true
  }

  const duplicateItemInstance = (entryKey: string) => {
    const parsedKey = parseItemInstanceKey(entryKey)
    const sourceValue = saveGame.dictionaryOfDictionaries.value.item[entryKey]
    if (!parsedKey || sourceValue === undefined) return

    const updatedSaveGame = structuredClone(saveGame)
    const dictionaries = updatedSaveGame.dictionaryOfDictionaries.value
    const newEntryKey = getNextItemInstanceKey(
      parsedKey.baseName,
      Object.keys(dictionaries.item)
    )

    dictionaries.item[newEntryKey] = sourceValue

    for (const relatedDictionary of [
      'itemBatteryUpgrades',
      'itemStatBattery'
    ] as const) {
      const relatedValue = dictionaries[relatedDictionary][entryKey]
      if (relatedValue !== undefined) {
        dictionaries[relatedDictionary][newEntryKey] = relatedValue
      }
    }

    dictionaries.itemsPurchased[parsedKey.baseName] =
      (dictionaries.itemsPurchased[parsedKey.baseName] ?? 0) + 1
    dictionaries.itemsPurchasedTotal[parsedKey.baseName] =
      (dictionaries.itemsPurchasedTotal[parsedKey.baseName] ?? 0) + 1

    onUpdateSaveData(updatedSaveGame)
  }

  const removeNumericDictionaryEntry = (
    dictionaryName: EditableNumericDictionaryKey,
    entryKey: string
  ) => {
    const updatedSaveGame = structuredClone(saveGame)
    const dictionaries = updatedSaveGame.dictionaryOfDictionaries.value
    if (!(entryKey in dictionaries[dictionaryName])) return

    delete dictionaries[dictionaryName][entryKey]

    if (dictionaryName === 'item') {
      delete dictionaries.itemBatteryUpgrades[entryKey]
      delete dictionaries.itemStatBattery[entryKey]

      const parsedKey = parseItemInstanceKey(entryKey)
      if (parsedKey && parsedKey.baseName in dictionaries.itemsPurchased) {
        dictionaries.itemsPurchased[parsedKey.baseName] = Math.max(
          0,
          dictionaries.itemsPurchased[parsedKey.baseName] - 1
        )
      }
    }

    onUpdateSaveData(updatedSaveGame)
  }

  /**
   * Removes a player from the save game data
   * @param playerId - The ID of the player to remove
   * @description Deletes the player from playerNames and all player-related dictionaries
   * in the dictionaryOfDictionaries object
   */
  const removePlayer = (playerId: string) => {
    const updatedSaveGame = structuredClone(saveGame)

    if (
      updatedSaveGame.playerNames?.value &&
      playerId in updatedSaveGame.playerNames.value
    ) {
      delete updatedSaveGame.playerNames.value[playerId]
    }

    if (updatedSaveGame.dictionaryOfDictionaries?.value) {
      const dictionaries = updatedSaveGame.dictionaryOfDictionaries.value

      for (const key of Object.keys(dictionaries).filter((key) =>
        key.startsWith('player')
      )) {
        const dict = dictionaries[key as keyof typeof dictionaries]
        if (dict && playerId in dict) {
          const playerDict = dict as Record<string, unknown>
          delete playerDict[playerId]
        }
      }
    }

    onUpdateSaveData(updatedSaveGame)
  }

  /**
   * @typedef {Object} UseSaveGameReturn
   * @property {SaveGame} saveGame - The current save game data
   * @property {function} updateTimePlayed - Function to update the time played value
   * @property {function} removePlayer - Function to remove a player from the save game
   */
  return {
    saveGame,
    updateTimePlayed,
    updateTeamName,
    updateDateAndTime,
    updatePlayerName,
    updatePlayerCrown,
    updateNumericDictionaryValue,
    addNumericDictionaryEntry,
    duplicateItemInstance,
    removeNumericDictionaryEntry,
    removePlayer
  }
}
