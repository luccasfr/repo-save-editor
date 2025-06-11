import { type SaveGame } from '@/model/save-game'

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
    removePlayer
  }
}
