import type { MetaSave } from '@/model/meta-save'
import {
  buildTokenStack,
  isNumberList,
  isNumberListList,
  removeInvalidTokens,
  rewrapValue,
  unwrapTypedValue
} from '@/model/meta-save'

/**
 * Props for the useMetaSave hook
 * @typedef {Object} UseMetaSaveProps
 * @property {MetaSave} metaSave - The meta save data to manage
 * @property {function} onUpdateMetaSave - Callback invoked with the updated data
 */
type UseMetaSaveProps = {
  metaSave: MetaSave
  onUpdateMetaSave: (updatedMetaSave: MetaSave) => void
}

/**
 * Hook to manage meta save data operations.
 *
 * Every operation is shape-defensive: it only rewrites a key when the actual
 * value matches the expected type, so a differently shaped real file is never
 * corrupted by a no-op mismatch. `{ "__type", "value" }` wrappers, if present,
 * are preserved.
 */
export function useMetaSave({ metaSave, onUpdateMetaSave }: UseMetaSaveProps) {
  /**
   * Applies `transform` to the (unwrapped) value of `key` and writes it back,
   * re-wrapping it when the original value was wrapped.
   */
  const updateKey = (key: string, transform: (value: unknown) => unknown) => {
    const raw = metaSave[key]
    const next = rewrapValue(raw, transform(unwrapTypedValue(raw)))
    onUpdateMetaSave({ ...metaSave, [key]: next })
  }

  const updateNumberList = (
    key: string,
    transform: (list: number[]) => number[]
  ) =>
    updateKey(key, (value) => (isNumberList(value) ? transform(value) : value))

  const updatePresetList = (
    key: string,
    transform: (list: number[][]) => number[][]
  ) =>
    updateKey(key, (value) =>
      isNumberListList(value) ? transform(value) : value
    )

  /** Sets a key to a plain number (e.g. `colorsEquipped`). */
  const setNumber = (key: string, value: number) => updateKey(key, () => value)

  /** Appends several entries to a number list. */
  const appendNumbers = (key: string, values: number[]) =>
    updateNumberList(key, (list) => [...list, ...values])

  /** Removes every occurrence of `value` from a number list. */
  const removeValue = (key: string, value: number) =>
    updateNumberList(key, (list) => list.filter((item) => item !== value))

  /** Empties a number list (keeps the key itself). */
  const clear = (key: string) => updateNumberList(key, () => [])

  /**
   * Rebuilds the `cosmeticTokens` stack from per-rarity counts. The stack
   * stores one entry per token whose value is that token's rarity.
   */
  const setTokenCounts = (key: string, counts: number[]) =>
    updateNumberList(key, () => buildTokenStack(counts))

  /** Removes token entries whose rarity is outside the valid `0..3` range. */
  const dropInvalidTokens = (key: string) =>
    updateNumberList(key, (list) => removeInvalidTokens(list))

  /** Appends an empty preset row to a list of presets. */
  const appendPreset = (key: string) =>
    updatePresetList(key, (list) => [...list, []])

  /** Removes the preset row at `index`. */
  const removePreset = (key: string, index: number) =>
    updatePresetList(key, (list) => list.filter((_, i) => i !== index))

  /** Applies `transform` to the preset row at `index`. */
  const setPresetRow = (
    key: string,
    index: number,
    transform: (row: number[]) => number[]
  ) =>
    updatePresetList(key, (list) =>
      list.map((row, i) => (i === index ? transform(row) : row))
    )

  /** Appends several entries to the preset row at `index`. */
  const presetAppendNumbers = (key: string, index: number, values: number[]) =>
    setPresetRow(key, index, (row) => [...row, ...values])

  /** Removes every occurrence of `value` from the preset row at `index`. */
  const presetRemoveValue = (key: string, index: number, value: number) =>
    setPresetRow(key, index, (row) => row.filter((item) => item !== value))

  /** Empties the preset row at `index`. */
  const presetClear = (key: string, index: number) =>
    setPresetRow(key, index, () => [])

  return {
    setNumber,
    appendNumbers,
    removeValue,
    clear,
    setTokenCounts,
    dropInvalidTokens,
    appendPreset,
    removePreset,
    presetAppendNumbers,
    presetRemoveValue,
    presetClear
  }
}

/** Actions returned by `useMetaSave`, shared by the meta editor components. */
export type MetaActions = ReturnType<typeof useMetaSave>
