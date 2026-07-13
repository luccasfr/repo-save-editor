import { useSyncExternalStore } from 'react'
import { SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'

const LEGACY_STORAGE_KEY = 'save-game-history'
const STORAGE_VERSION = 'v1'
// Versioned storage key prevents future history schemas from conflicting.
const STORAGE_KEY = `${LEGACY_STORAGE_KEY}:${STORAGE_VERSION}`
// Storage key for disabling save game history
const STORAGE_KEY_DISABLED = 'disable-save-game-history'
// Maximum number of history items to keep
const MAX_HISTORY_ITEMS = 3
const TRACKED_STORAGE_KEYS = new Set([
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  STORAGE_KEY_DISABLED
])

type HistorySnapshot = {
  disabled: boolean
  history: SaveGameHistoryType[]
  serializedHistory: string | null
}

const EMPTY_HISTORY: SaveGameHistoryType[] = []
const SERVER_SNAPSHOT: HistorySnapshot = {
  disabled: false,
  history: EMPTY_HISTORY,
  serializedHistory: null
}

const listeners = new Set<() => void>()
let clientSnapshot = SERVER_SNAPSHOT
let clientSnapshotInitialized = false

function readStorageItem(key: string) {
  if (globalThis.window === undefined) return null

  try {
    return globalThis.window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorageItem(key: string, value: string) {
  if (globalThis.window === undefined) return false

  try {
    globalThis.window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function removeStorageItem(key: string) {
  if (globalThis.window === undefined) return

  try {
    globalThis.window.localStorage.removeItem(key)
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

function parseStoredHistory(
  storedHistory: string
): SaveGameHistoryType[] | null {
  try {
    const parsedHistory: unknown = JSON.parse(storedHistory)
    if (!Array.isArray(parsedHistory)) return null
    return parsedHistory as SaveGameHistoryType[]
  } catch {
    return null
  }
}

function readHistoryFromStorage() {
  const versionedHistory = readStorageItem(STORAGE_KEY)
  const serializedHistory =
    versionedHistory ?? readStorageItem(LEGACY_STORAGE_KEY)

  if (serializedHistory === null) {
    return { history: EMPTY_HISTORY, serializedHistory: null }
  }

  const history = parseStoredHistory(serializedHistory)
  if (history === null) {
    return { history: EMPTY_HISTORY, serializedHistory: null }
  }

  return { history, serializedHistory }
}

function readSnapshotFromStorage(): HistorySnapshot {
  const disabled = Boolean(readStorageItem(STORAGE_KEY_DISABLED))
  if (disabled) {
    return {
      disabled: true,
      history: EMPTY_HISTORY,
      serializedHistory: null
    }
  }

  return { disabled: false, ...readHistoryFromStorage() }
}

function migrateLegacyHistory() {
  if (globalThis.window === undefined) return

  try {
    const storage = globalThis.window.localStorage
    const versionedHistory = storage.getItem(STORAGE_KEY)
    const legacyHistory = storage.getItem(LEGACY_STORAGE_KEY)

    if (
      versionedHistory !== null &&
      parseStoredHistory(versionedHistory) !== null
    ) {
      storage.removeItem(LEGACY_STORAGE_KEY)
      return
    }

    if (versionedHistory !== null) storage.removeItem(STORAGE_KEY)
    if (legacyHistory === null) return

    const parsedLegacyHistory = parseStoredHistory(legacyHistory)
    if (parsedLegacyHistory === null) {
      storage.removeItem(LEGACY_STORAGE_KEY)
      return
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(parsedLegacyHistory))
    storage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // Keep the legacy value when migration cannot be completed safely.
  }
}

function snapshotsAreEqual(
  previousSnapshot: HistorySnapshot,
  nextSnapshot: HistorySnapshot
) {
  return (
    previousSnapshot.disabled === nextSnapshot.disabled &&
    previousSnapshot.serializedHistory === nextSnapshot.serializedHistory
  )
}

function emitStoreChange() {
  for (const listener of listeners) listener()
}

function replaceClientSnapshot(
  nextSnapshot: HistorySnapshot,
  notifyListeners: boolean
) {
  const changed = !snapshotsAreEqual(clientSnapshot, nextSnapshot)
  clientSnapshotInitialized = true
  if (!changed) return

  clientSnapshot = nextSnapshot

  if (notifyListeners) emitStoreChange()
}

function refreshClientSnapshot(notifyListeners: boolean) {
  replaceClientSnapshot(readSnapshotFromStorage(), notifyListeners)
}

function getClientSnapshot() {
  if (!clientSnapshotInitialized && globalThis.window !== undefined) {
    refreshClientSnapshot(false)
  }

  return clientSnapshot
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key !== null && !TRACKED_STORAGE_KEYS.has(event.key)) return

  migrateLegacyHistory()
  refreshClientSnapshot(true)
}

function subscribeToHistory(listener: () => void) {
  listeners.add(listener)

  if (listeners.size === 1 && globalThis.window !== undefined) {
    globalThis.window.addEventListener('storage', handleStorageEvent)
    migrateLegacyHistory()
    // React checks the snapshot immediately after subscribing, so migration can
    // update the cache without dispatching an update during the subscription.
    refreshClientSnapshot(false)
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && globalThis.window !== undefined) {
      globalThis.window.removeEventListener('storage', handleStorageEvent)
    }
  }
}

/**
 * Adds a save game to the history.
 */
function addToHistory(fileName: string, saveGame: SaveGame) {
  const snapshot = getClientSnapshot()
  if (snapshot.disabled) return

  const summary = {
    level: (saveGame.dictionaryOfDictionaries.value.runStats.level || 0) + 1,
    totalHaul: saveGame.dictionaryOfDictionaries.value.runStats.totalHaul || 0,
    playerCount: Object.keys(saveGame.playerNames?.value || {}).length
  }

  const newItem: SaveGameHistoryType = {
    fileName,
    saveGame,
    timestamp: Date.now(),
    summary
  }

  const isDuplicate = snapshot.history.some(
    (item) =>
      JSON.stringify(item.saveGame) === JSON.stringify(newItem.saveGame) &&
      item.fileName === newItem.fileName
  )

  if (isDuplicate) return

  const history = [newItem, ...snapshot.history].slice(0, MAX_HISTORY_ITEMS)
  const serializedHistory = JSON.stringify(history)

  if (writeStorageItem(STORAGE_KEY, serializedHistory)) {
    removeStorageItem(LEGACY_STORAGE_KEY)
  }

  replaceClientSnapshot({ disabled: false, history, serializedHistory }, true)
}

/**
 * Disables history tracking and clears stored history.
 */
function disableHistory() {
  writeStorageItem(STORAGE_KEY_DISABLED, 'true')
  removeStorageItem(STORAGE_KEY)
  removeStorageItem(LEGACY_STORAGE_KEY)
  replaceClientSnapshot(
    { disabled: true, history: EMPTY_HISTORY, serializedHistory: null },
    true
  )
}

/**
 * Enables history tracking and loads any existing history.
 */
function enableHistory() {
  removeStorageItem(STORAGE_KEY_DISABLED)
  migrateLegacyHistory()
  replaceClientSnapshot({ disabled: false, ...readHistoryFromStorage() }, true)
}

/**
 * Clears the save game history from storage and memory.
 */
function clearHistory() {
  const { disabled } = getClientSnapshot()
  removeStorageItem(STORAGE_KEY)
  removeStorageItem(LEGACY_STORAGE_KEY)
  replaceClientSnapshot(
    { disabled, history: EMPTY_HISTORY, serializedHistory: null },
    true
  )
}

/**
 * Hook for managing save game history as an observable localStorage store.
 */
export function useSaveGameHistory() {
  const { disabled, history } = useSyncExternalStore(
    subscribeToHistory,
    getClientSnapshot,
    getServerSnapshot
  )

  return {
    history,
    addToHistory,
    clearHistory,
    disabled,
    disableHistory,
    enableHistory
  }
}
