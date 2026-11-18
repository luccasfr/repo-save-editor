import type { MetaSave } from '@/model/meta-save'
import type { SaveGame } from '@/model/save-game'
import { encryptEs3 } from './es3-crypto'

/**
 * Downloads the provided JSON-serializable data as an encrypted ES3 file.
 * This function encrypts the data using ES3 encryption and initiates a file
 * download in the browser.
 *
 * @param {unknown} data - The data to be downloaded
 * @param {string} filename - The name to give the downloaded file
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 * @throws {TypeError} When called outside of a browser environment
 */
export async function downloadEncryptedJson(
  data: unknown,
  filename: string
): Promise<void> {
  if (globalThis.window === undefined) {
    throw new TypeError('This function can only be used in the browser')
  }

  // The game writes compact JSON; pretty-printing puts every array entry on
  // its own line and can inflate a fresh save several times over.
  const binaryData = await encryptEs3(JSON.stringify(data))
  const blob = new Blob([binaryData as Uint8Array<ArrayBuffer>])

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}

/**
 * Downloads the provided save game data as an encrypted file.
 * This function encrypts the save game data using ES3 encryption and
 * initiates a file download in the browser.
 *
 * @param {SaveGame} saveGame - The save game object to be downloaded
 * @param {string} filename - The name to give the downloaded file
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 * @throws {TypeError} When called outside of a browser environment
 */
export async function downloadSaveGame(
  saveGame: SaveGame,
  filename: string
): Promise<void> {
  return downloadEncryptedJson(saveGame, filename)
}

/**
 * Downloads the provided meta save data as an encrypted file.
 *
 * @param {MetaSave} metaSave - The meta save object to be downloaded
 * @param {string} filename - The name to give the downloaded file
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 * @throws {TypeError} When called outside of a browser environment
 */
export async function downloadMetaSave(
  metaSave: MetaSave,
  filename: string
): Promise<void> {
  return downloadEncryptedJson(metaSave, filename)
}
