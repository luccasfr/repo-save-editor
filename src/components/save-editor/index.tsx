'use client'

import SaveData from '@/components/save-editor/save-data'
import UploadFile from '@/components/upload-file'
import { decryptEs3, encryptEs3 } from '@/lib/es3-crypto'
import fetchAvatars from '@/lib/fetch-avatars'
import { type SaveGame } from '@/model/save-game'
import { SteamAvatars } from "@/model/steam-avatars"
import { useEffect, useMemo, useState } from 'react'

export default function SaveEditor() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [saveGame, setSaveGame] = useState<SaveGame | null>(null)
  const [steamAvatars, setSteamAvatars] = useState<SteamAvatars | null>(null)
  const [originalSaveData, setOriginalSaveData] = useState<SaveGame | null>(
    null
  )

  const hasChanges = useMemo(() => {
    if (!saveGame || !originalSaveData) return false

    return JSON.stringify(saveGame) !== JSON.stringify(originalSaveData)
  }, [saveGame, originalSaveData])

  const handleSaveDataUpdate = (updatedSaveData: SaveGame) => {
    setSaveGame(updatedSaveData)
  }

  const handleReset = () => {
    if (originalSaveData) {
      setSaveGame(JSON.parse(JSON.stringify(originalSaveData)))
    }
  }

  const downloadSaveFile = (data: Blob, filename: string) => {
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  const handleSave = async () => {
    const binaryData = await encryptEs3(
      JSON.stringify(saveGame, null, 4),
      "Why would you want to cheat?... :o It's no fun. :') :'D"
    )
    const blob = new Blob([binaryData])
    downloadSaveFile(blob, fileName || 'repo-save-game.es3')
    setOriginalSaveData(JSON.parse(JSON.stringify(saveGame)))
  }

  const handleNewFile = () => {
    setSaveGame(null)
    setOriginalSaveData(null)
    setFileName(null)
  }

  const handleFileUpload = async (
    files: Array<{ base64: string; name: string }>
  ) => {
    if (files.length > 0) {
      const decrypted = await decryptEs3(
        files[0].base64,
        "Why would you want to cheat?... :o It's no fun. :') :'D"
      )
      const parsed = JSON.parse(decrypted) as SaveGame
      setSaveGame(parsed)
      setOriginalSaveData(JSON.parse(JSON.stringify(parsed)))
      setFileName(files[0].name)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const avatars = await fetchAvatars(
        Object.keys(saveGame?.playerNames.value ?? {})
      )
      setSteamAvatars(avatars)
    }
    if (!saveGame) return
    fetch()
  }, [saveGame])

  return (
    <div>
      {saveGame ? (
        <SaveData
          saveGame={saveGame}
          onUpdateSaveData={handleSaveDataUpdate}
          onReset={handleReset}
          hasChanges={hasChanges}
          onSave={handleSave}
          onNewFile={handleNewFile}
          fileName={fileName}
          steamAvatars={steamAvatars}
        />
      ) : (
        <UploadFile className="w-full" onFilesChange={handleFileUpload} />
      )}
    </div>
  )
}
