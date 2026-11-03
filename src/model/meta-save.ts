/**
 * Represents the profile-wide meta save (file name `MetaSave.es3`, written by
 * the game's `MetaManager` class). It stores cosmetics and tax-token data that
 * is shared by all run saves, as opposed to the per-run `.es3` files in the
 * `saves` folder.
 *
 * Values are read back through ES3 as strongly typed collections, so they are
 * normally wrapped as `{ "__type": ..., "value": ... }`. The editor treats
 * the meta save as a bag of JSON keys: known keys get a typed editor when
 * their value matches the expected shape, and every other key is passed
 * through untouched.
 *
 * Key semantics (verified from the game's IL):
 * - `cosmeticTokens`: stack of one rarity per owned token (0=Common,
 *   1=Uncommon, 2=Rare, 3=UltraRare). NOT per-rarity counts.
 * - `cosmeticUnlocks` / `cosmeticHistory` / `cosmeticEquipped`: cosmetic
 *   asset indices.
 * - `cosmeticPresets` / `colorPresets`: presets, each a list of indices.
 * - `colorsEquipped`: bitmask.
 */
export type MetaSave = Record<string, unknown>

/**
 * String keys found in the game binary (`Assembly-CSharp`, `MetaManager`).
 * The save JSON is built by hand with exactly these string literals, so no
 * other keys are expected, but unknown keys are always preserved.
 */
export const META_SAVE_KEYS = [
  'cosmetic',
  'cosmeticEquipped',
  'cosmeticHistory',
  'cosmeticPresets',
  'cosmeticTokens',
  'cosmeticUnlocks',
  'colorPresets',
  'colorsEquipped'
] as const

export type MetaSaveKey = (typeof META_SAVE_KEYS)[number]

/**
 * True when `data` looks like a meta save (at least one known key) rather
 * than a run save.
 */
export function isMetaSave(data: unknown): data is MetaSave {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }
  const keys = Object.keys(data)
  return META_SAVE_KEYS.some((key) => keys.includes(key))
}

/**
 * Number of tax-token rarities. The game's `Rarity` enum is
 * `Common = 0, Uncommon = 1, Rare = 2, UltraRare = 3`.
 */
export const TOKEN_RARITY_COUNT = 4

/**
 * Upper bound applied per rarity when rebuilding the token stack, to keep a
 * typo (or a huge bulk add) from producing an enormous save.
 */
const MAX_TOKENS_PER_RARITY = 999

/**
 * True when `value` is an array of finite numbers, the shape of the game's
 * `List<int>` fields (tokens, unlocks, equipped, history).
 */
export function isNumberList(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item))
  )
}

/**
 * Counts how many tokens of each rarity a meta save holds.
 *
 * `cosmeticTokens` is a *stack*: one entry per owned token, and the entry's
 * value is that token's rarity (`0`-`3`). It is NOT a list of per-rarity
 * counts. Entries outside `0..3` are reported separately as invalid (they
 * render as gray, unusable tokens in game).
 *
 * @param tokens - The raw `cosmeticTokens` list
 * @returns Per-rarity counts plus the number of invalid entries
 */
export function countTokensByRarity(tokens: readonly number[]): {
  counts: number[]
  invalid: number
} {
  const counts = Array.from({ length: TOKEN_RARITY_COUNT }, () => 0)
  let invalid = 0

  for (const token of tokens) {
    if (Number.isInteger(token) && token >= 0 && token < TOKEN_RARITY_COUNT) {
      counts[token] += 1
    } else {
      invalid += 1
    }
  }

  return { counts, invalid }
}

/**
 * Rebuilds the `cosmeticTokens` stack from per-rarity counts. Tokens are
 * grouped in enum order (all Common, then Uncommon, Rare, Ultra-Rare); the
 * game's shop machine redeems the *last* entry, so Ultra-Rare is redeemed
 * first when present.
 *
 * @param counts - Desired token count per rarity (index = rarity)
 * @returns A flat list of rarity values
 */
export function buildTokenStack(counts: readonly number[]): number[] {
  const stack: number[] = []

  for (const [rarity, count] of counts.entries()) {
    const safeCount = Number.isFinite(count)
      ? Math.min(Math.max(Math.floor(count), 0), MAX_TOKENS_PER_RARITY)
      : 0
    for (let index = 0; index < safeCount; index += 1) {
      stack.push(rarity)
    }
  }

  return stack
}

/**
 * Drops entries whose value is not a valid rarity (`0..3`).
 */
export function removeInvalidTokens(tokens: readonly number[]): number[] {
  return tokens.filter(
    (token) =>
      Number.isInteger(token) && token >= 0 && token < TOKEN_RARITY_COUNT
  )
}

/**
 * Number of entries in `MetaManager.cosmeticAssets` in the current game build.
 *
 * Extracted from the serialized `MetaManager` component in `level0`
 * (path_id 2873): a `List<CosmeticAsset>` with 557 PPtrs, all resolving to
 * `"Cosmetic - ..."` objects in `sharedassets0.assets`. The game's
 * `CosmeticUnlockAll()` adds every index `0..Count-1` to `cosmeticUnlocks`.
 *
 * Bump this when a game update adds cosmetics. Indices beyond the current
 * list are harmless (every consumer does `cosmeticUnlocks.Contains(index)`),
 * so existing extra entries are preserved when unlocking all.
 */
export const COSMETIC_ASSET_COUNT = 557

/**
 * Builds the full `cosmeticUnlocks` list: every current cosmetic index plus
 * any valid index already present (so future/game-update indices survive).
 * Negative and non-integer entries are dropped and the result is sorted.
 *
 * @param existing - The current `cosmeticUnlocks` values
 * @returns Every index `0..COSMETIC_ASSET_COUNT-1`, merged with `existing`
 */
export function buildUnlockAllCosmetics(existing: readonly number[]): number[] {
  const indices = new Set<number>()

  for (const index of existing) {
    if (Number.isInteger(index) && index >= 0) {
      indices.add(index)
    }
  }

  for (let index = 0; index < COSMETIC_ASSET_COUNT; index += 1) {
    indices.add(index)
  }

  return [...indices].toSorted((a, b) => a - b)
}

/**
 * True when `value` is an array of number arrays, the shape of the game's
 * `List<List<int>>` fields (cosmetic and color presets).
 */
export function isNumberListList(value: unknown): value is number[][] {
  return Array.isArray(value) && value.every((item) => isNumberList(item))
}

/**
 * Some Unity JSON saves wrap values as `{ "__type": ..., "value": ... }`.
 * Returns the inner value when present so editors can work on the real data.
 */
export function unwrapTypedValue(raw: unknown): unknown {
  if (
    typeof raw === 'object' &&
    raw !== null &&
    !Array.isArray(raw) &&
    '__type' in raw &&
    'value' in raw
  ) {
    return (raw as { value: unknown }).value
  }
  return raw
}

/**
 * If `raw` is a `{ "__type", "value" }` wrapper, returns `newValue` wrapped
 * again with the same `__type`; otherwise returns `newValue` as-is. Used to
 * keep the on-disk shape stable when a known key is edited.
 */
export function rewrapValue(raw: unknown, newValue: unknown): unknown {
  if (
    typeof raw === 'object' &&
    raw !== null &&
    !Array.isArray(raw) &&
    '__type' in raw &&
    'value' in raw
  ) {
    return { ...(raw as Record<string, unknown>), value: newValue }
  }
  return newValue
}
