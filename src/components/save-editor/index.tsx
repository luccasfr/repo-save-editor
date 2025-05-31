'use client'

import SaveData from '@/components/save-editor/save-data'
import SaveGameHistory from '@/components/save-editor/save-game-history'
import { Separator } from '@/components/ui/separator'
import UploadFile from '@/components/upload-file'
import VersionHistory from '@/components/version-history'
import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { useSaveGameHistory } from '@/hooks/use-save-game-history'
import downloadSaveGame from '@/lib/download-save-game'
import { decryptEs3 } from '@/lib/es3-crypto'
import fetchAvatars from '@/lib/fetch-avatars'
import { type SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'
import { SteamAvatars } from '@/model/steam-avatars'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function SaveEditor() {
  const t = useTranslations('save_editor')
  const [fileName, setFileName] = useState<string | null>(null)
  const [saveGame, setSaveGame] = useState<SaveGame | null>(null)
  const [steamAvatars, setSteamAvatars] = useState<SteamAvatars | null>(null)
  const [originalSaveData, setOriginalSaveData] = useState<SaveGame | null>(
    null
  )
  const { addToHistory } = useSaveGameHistory()

  const hasChanges = useMemo(() => {
    if (!saveGame || !originalSaveData) return false

    return JSON.stringify(saveGame) !== JSON.stringify(originalSaveData)
  }, [saveGame, originalSaveData])

  const handleSaveDataUpdate = (updatedSaveData: SaveGame) => {
    setSaveGame(updatedSaveData)
  }

  const handleReset = () => {
    if (originalSaveData) {
      setSaveGame(structuredClone(originalSaveData))
    }
  }

  const handleSave = async () => {
    if (!saveGame) return
    downloadSaveGame(saveGame, fileName ?? 'savegame.es3')
    setOriginalSaveData(structuredClone(saveGame))
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
      try {
        const decrypted = await decryptEs3(files[0].base64, ENCRYPTION_KEY)
        const parsed = JSON.parse(decrypted) as SaveGame
        setSaveGame(parsed)
        setOriginalSaveData(structuredClone(parsed))
        setFileName(files[0].name)

        addToHistory(files[0].name, parsed)
      } catch {
        toast.error(t('error.invalid_file'))
      }
    }
  }

  const handleSelectSave = (historyItem: SaveGameHistoryType) => {
    setSaveGame(structuredClone(historyItem.saveGame))
    setOriginalSaveData(structuredClone(historyItem.saveGame))
    setFileName(historyItem.fileName)
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
    <>
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
        <div className="space-y-8">
          <UploadFile className="w-full" onFilesChange={handleFileUpload} />
          <Separator />
          <SaveGameHistory onSelectSave={handleSelectSave} />
          <Separator />
          <VersionHistory />
        </div>
      )}
    </>
  )
}
