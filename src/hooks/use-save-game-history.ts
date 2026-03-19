import { useCallback, useEffect, useState } from 'react'
import { SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'

// Storage key for save game history
const STORAGE_KEY = 'save-game-history'
// Storage key for disabling save game history
const STORAGE_KEY_DISABLED = 'disable-save-game-history'
// Maximum number of history items to keep
const MAX_HISTORY_ITEMS = 3

/**
 * Hook for managing save game history in local storage
 *
 * @returns Object with functions and state for managing save game history
 */
export function useSaveGameHistory() {
  const [disabled, setDisabled] = useState(
    () =>
      globalThis.window !== undefined &&
      Boolean(localStorage.getItem(STORAGE_KEY_DISABLED))
  )
  const [history, setHistory] = useState<SaveGameHistoryType[]>(() => {
    if (globalThis.window === undefined) return []
    if (localStorage.getItem(STORAGE_KEY_DISABLED)) return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      return JSON.parse(stored) as SaveGameHistoryType[]
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  })

  /**
   * Loads save game history from local storage
   *
   * @returns The parsed history array or null if not found or invalid
   */
  const loadHistoryFromLocalStorage = useCallback(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY)
    if (!storedHistory) return null

    try {
      const parsedHistory = JSON.parse(storedHistory) as SaveGameHistoryType[]
      return parsedHistory
    } catch (error) {
      console.error('Failed to parse save game history:', error)
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  }, [])

  /**
   * Adds a save game to the history
   *
   * @param fileName - The name of the save game file
   * @param saveGame - The save game data to add to history
   */
  const addToHistory = useCallback(
    (fileName: string, saveGame: SaveGame) => {
      if (disabled) return

      const summary = {
        level:
          (saveGame.dictionaryOfDictionaries.value.runStats.level || 0) + 1,
        totalHaul:
          saveGame.dictionaryOfDictionaries.value.runStats.totalHaul || 0,
        playerCount: Object.keys(saveGame.playerNames?.value || {}).length
      }

      const newItem: SaveGameHistoryType = {
        fileName,
        saveGame,
        timestamp: Date.now(),
        summary
      }

      const currentHistory = loadHistoryFromLocalStorage()

      const isDuplicate = currentHistory?.some(
        (item) =>
          JSON.stringify(item.saveGame) === JSON.stringify(newItem.saveGame) &&
          item.fileName === newItem.fileName
      )

      if (isDuplicate) return

      const updatedHistory = [newItem, ...(currentHistory || [])].slice(
        0,
        MAX_HISTORY_ITEMS
      )

      setHistory(updatedHistory)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    },
    [disabled, loadHistoryFromLocalStorage]
  )

  /**
   * Disables history tracking and clears stored history
   */
  const disableHistory = useCallback(() => {
    setDisabled(true)
    localStorage.setItem(STORAGE_KEY_DISABLED, 'true')
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  /**
   * Enables history tracking and loads any existing history
   */
  const enableHistory = useCallback(() => {
    setDisabled(false)
    localStorage.removeItem(STORAGE_KEY_DISABLED)

    const loadedHistory = loadHistoryFromLocalStorage()
    if (loadedHistory) {
      setHistory(loadedHistory)
    }
  }, [loadHistoryFromLocalStorage])

  /**
   * Clears the save game history from storage and state
   */
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    disabled,
    disableHistory,
    enableHistory
  }
}
