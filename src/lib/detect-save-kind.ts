import { isMetaSave } from '@/model/meta-save'
import type { SaveGame } from '@/model/save-game'

/**
 * Kind of decrypted ES3 save file.
 * - `game`: a per-run save from the `saves` folder (has `playerNames` and
 *   `dictionaryOfDictionaries`).
 * - `meta`: the profile-wide `MetaSave.es3` file (has at least one of the
 *   `META_SAVE_KEYS`).
 * - `unknown`: anything else; the file is rejected.
 */
export type SaveKind = 'game' | 'meta' | 'unknown'

function isGameSave(data: unknown): data is SaveGame {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }
  return 'playerNames' in data && 'dictionaryOfDictionaries' in data
}

/**
 * Detects whether a decrypted save JSON is a run save or a meta save.
 *
 * @param data - The parsed JSON of a decrypted `.es3` file
 * @returns The detected kind of the file
 */
export function detectSaveKind(data: unknown): SaveKind {
  if (isGameSave(data)) {
    return 'game'
  }
  if (isMetaSave(data)) {
    return 'meta'
  }
  return 'unknown'
}
