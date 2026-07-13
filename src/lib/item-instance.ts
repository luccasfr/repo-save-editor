export type ItemInstanceKey = {
  baseName: string
  instanceNumber: number
}

const ITEM_INSTANCE_SUFFIX = /^(.*)\/(\d+)$/u

export function parseItemInstanceKey(key: string): ItemInstanceKey | null {
  const match = ITEM_INSTANCE_SUFFIX.exec(key.trim())
  if (!match) return null

  const baseName = match[1].trim()
  const instanceNumber = Number(match[2])
  if (!baseName || !Number.isSafeInteger(instanceNumber) || instanceNumber < 1)
    return null

  return { baseName, instanceNumber }
}

export function getNextItemInstanceKey(
  baseName: string,
  existingKeys: Iterable<string>
) {
  let highestInstanceNumber = 0

  for (const existingKey of existingKeys) {
    const parsedKey = parseItemInstanceKey(existingKey)
    if (parsedKey?.baseName === baseName) {
      highestInstanceNumber = Math.max(
        highestInstanceNumber,
        parsedKey.instanceNumber
      )
    }
  }

  return `${baseName}/${highestInstanceNumber + 1}`
}

export function normalizeItemInstanceKey(
  keyOrBaseName: string,
  existingKeys: Iterable<string>
) {
  const trimmedKey = keyOrBaseName.trim()
  if (!trimmedKey) return ''
  if (parseItemInstanceKey(trimmedKey)) return trimmedKey
  if (trimmedKey.includes('/')) return ''
  return getNextItemInstanceKey(trimmedKey, existingKeys)
}

export function getItemDisplayName(keyOrBaseName: string) {
  const parsedKey = parseItemInstanceKey(keyOrBaseName)
  return (parsedKey?.baseName ?? keyOrBaseName)
    .replace(/^Item /u, '')
    .replaceAll('_', ' ')
}
