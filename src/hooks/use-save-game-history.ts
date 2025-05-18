import { useCallback, useEffect, useState } from 'react'
import { SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '../model/save-game-history'

const STORAGE_KEY = 'save-game-history'
const STORAGE_KEY_DISABLED = 'disable-save-game-history'
const MAX_HISTORY_ITEMS = 3

export function useSaveGameHistory() {
  const [history, setHistory] = useState<SaveGameHistoryType[]>([])
  const [disabled, setDisabled] = useState(false)

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

  useEffect(() => {
    const isDisabled = localStorage.getItem(STORAGE_KEY_DISABLED)
    if (isDisabled) {
      setDisabled(true)
      return
    }

    if (disabled) return

    const loadedHistory = loadHistoryFromLocalStorage()
    if (loadedHistory) {
      setHistory(loadedHistory)
    }
  }, [disabled, loadHistoryFromLocalStorage])

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

  const disableHistory = useCallback(() => {
    setDisabled(true)
    localStorage.setItem(STORAGE_KEY_DISABLED, 'true')
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  const enableHistory = useCallback(() => {
    setDisabled(false)
    localStorage.removeItem(STORAGE_KEY_DISABLED)

    const loadedHistory = loadHistoryFromLocalStorage()
    if (loadedHistory) {
      setHistory(loadedHistory)
    }
  }, [loadHistoryFromLocalStorage])

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
