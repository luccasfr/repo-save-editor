'use server'

import { SteamAvatars } from '@/model/steam-avatars'
import { DOMParser } from '@xmldom/xmldom'
import { assertServerActionAuthorized } from './server-action-auth'

const MAX_STEAM_IDS = 8
const STEAM_ID_PATTERN = /^\d{1,20}$/
const STEAM_REQUEST_TIMEOUT_MS = 5000

/**
 * Fetches the full avatar URLs for a list of Steam IDs.
 *
 * @param {number[]} steamIDs - Array of Steam IDs
 * @returns {Promise<SteamAvatars>} - A promise that resolves to an object mapping Steam IDs to their full avatar URLs
 */
export async function fetchAvatars(steamIDs: string[]): Promise<SteamAvatars> {
  await assertServerActionAuthorized()
  if (!Array.isArray(steamIDs)) {
    throw new TypeError('Steam IDs must be an array')
  }

  const validSteamIDs = [...new Set(steamIDs)]
    .filter(
      (steamID): steamID is string =>
        typeof steamID === 'string' && STEAM_ID_PATTERN.test(steamID)
    )
    .slice(0, MAX_STEAM_IDS)

  const avatarUrls: SteamAvatars = {}
  await Promise.all(
    validSteamIDs.map((steamID) =>
      fetch(`https://steamcommunity.com/profiles/${steamID}/?xml=1`, {
        redirect: 'error',
        signal: AbortSignal.timeout(STEAM_REQUEST_TIMEOUT_MS)
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Steam returned ${res.status}`)
          return res.text()
        })
        .then((text) => {
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(text, 'text/xml')

          const avatarFullElements = xmlDoc.getElementsByTagName('avatarFull')

          if (avatarFullElements.length > 0) {
            const avatarFullElement = avatarFullElements[0]
            const avatarUrl = avatarFullElement.textContent?.trim()
            if (avatarUrl) {
              avatarUrls[steamID] = avatarUrl
            }
          }
        })
        .catch(() => {})
    )
  )

  return avatarUrls
}
