'use server'

import { SteamAvatars } from '@/model/steam-avatars'
import { DOMParser } from '@xmldom/xmldom'

/**
 * Fetches the full avatar URLs for a list of Steam IDs.
 *
 * @param {number[]} steamIDs - Array of Steam IDs
 * @returns {Promise<SteamAvatars>} - A promise that resolves to an object mapping Steam IDs to their full avatar URLs
 */
export default async function fetchAvatars(
  steamIDs: string[]
): Promise<SteamAvatars> {
  const avatarUrls: SteamAvatars = {}
  await Promise.all(
    steamIDs.map((steamID) =>
      fetch(`https://steamcommunity.com/profiles/${steamID}/?xml=1`)
        .then((res) => res.text())
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
    )
  )

  return avatarUrls
}
