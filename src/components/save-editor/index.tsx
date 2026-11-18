'use client'

import { MetaSaveData } from '@/components/save-editor/meta-save-data'
import { SaveData } from '@/components/save-editor/save-data'
import { SaveGameHistory } from '@/components/save-editor/save-game-history'
import { Separator } from '@/components/ui/separator'
import { UploadFile } from '@/components/upload-file'
import { VersionHistory } from '@/components/version-history'
import { useSaveGameHistory } from '@/hooks/use-save-game-history'
import { downloadMetaSave, downloadSaveGame } from '@/lib/download-save-game'
import { detectSaveKind } from '@/lib/detect-save-kind'
import { decryptEs3 } from '@/lib/es3-crypto'
import { fetchAvatars } from '@/lib/fetch-avatars'
import type { MetaSave } from '@/model/meta-save'
import type { SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'
import { SteamAvatars } from '@/model/steam-avatars'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export function SaveEditor() {
  const t = useTranslations('save_editor')
  const [fileName, setFileName] = useState<string | null>(null)
  const [saveGame, setSaveGame] = useState<SaveGame | null>(null)
  const [metaSave, setMetaSave] = useState<MetaSave | null>(null)
  const [steamAvatars, setSteamAvatars] = useState<SteamAvatars | null>(null)
  const [originalSaveData, setOriginalSaveData] = useState<SaveGame | null>(
    null
  )
  const [originalMetaSave, setOriginalMetaSave] = useState<MetaSave | null>(
    null
  )
  const { addToHistory } = useSaveGameHistory()

  const hasChanges = useMemo(() => {
    if (saveGame) {
      return JSON.stringify(saveGame) !== JSON.stringify(originalSaveData)
    }
    if (metaSave) {
      return JSON.stringify(metaSave) !== JSON.stringify(originalMetaSave)
    }
    return false
  }, [saveGame, originalSaveData, metaSave, originalMetaSave])

  const handleReset = () => {
    if (saveGame && originalSaveData) {
      setSaveGame(structuredClone(originalSaveData))
    }
    if (metaSave && originalMetaSave) {
      setMetaSave(structuredClone(originalMetaSave))
    }
  }

  const handleSave = async () => {
    if (saveGame) {
      await downloadSaveGame(saveGame, fileName ?? 'savegame.es3')
      setOriginalSaveData(structuredClone(saveGame))
    } else if (metaSave) {
      await downloadMetaSave(metaSave, fileName ?? 'MetaSave.es3')
      setOriginalMetaSave(structuredClone(metaSave))
    }
  }

  const handleNewFile = () => {
    setSaveGame(null)
    setMetaSave(null)
    setOriginalSaveData(null)
    setOriginalMetaSave(null)
    setSteamAvatars(null)
    setFileName(null)
  }

  const handleFileUpload = async (
    files: Array<{ base64: string; name: string }>
  ) => {
    if (files.length > 0) {
      try {
        const decrypted = await decryptEs3(files[0].base64)
        const parsed: unknown = JSON.parse(decrypted)
        const kind = detectSaveKind(parsed)

        if (kind === 'game') {
          const game = parsed as SaveGame
          setSaveGame(game)
          setOriginalSaveData(structuredClone(game))
          setMetaSave(null)
          setOriginalMetaSave(null)
          setFileName(files[0].name)
          addToHistory(files[0].name, game)
          window.scrollTo({ top: 0 })

          const avatars = await fetchAvatars(
            Object.keys(game.playerNames.value)
          )
          setSteamAvatars(avatars)
        } else if (kind === 'meta') {
          const meta = parsed as MetaSave
          setMetaSave(meta)
          setOriginalMetaSave(structuredClone(meta))
          setSaveGame(null)
          setOriginalSaveData(null)
          setSteamAvatars(null)
          setFileName(files[0].name)
          window.scrollTo({ top: 0 })
        } else {
          toast.error(t('error.invalid_file'))
        }
      } catch {
        toast.error(t('error.invalid_file'))
      }
    }
  }

  const handleSelectSave = async (historyItem: SaveGameHistoryType) => {
    setSaveGame(structuredClone(historyItem.saveGame))
    setOriginalSaveData(structuredClone(historyItem.saveGame))
    setMetaSave(null)
    setOriginalMetaSave(null)
    setFileName(historyItem.fileName)
    window.scrollTo({ top: 0 })

    const avatars = await fetchAvatars(
      Object.keys(historyItem.saveGame.playerNames.value)
    )
    setSteamAvatars(avatars)
  }

  const renderEditor = () => {
    if (saveGame) {
      return (
        <SaveData
          saveGame={saveGame}
          onUpdateSaveData={setSaveGame}
          onReset={handleReset}
          hasChanges={hasChanges}
          onSave={handleSave}
          onNewFile={handleNewFile}
          fileName={fileName}
          steamAvatars={steamAvatars}
        />
      )
    }

    if (metaSave) {
      return (
        <MetaSaveData
          metaSave={metaSave}
          onUpdateMetaSave={setMetaSave}
          onReset={handleReset}
          hasChanges={hasChanges}
          onSave={handleSave}
          onNewFile={handleNewFile}
          fileName={fileName}
        />
      )
    }

    return (
      <div className="space-y-8">
        <UploadFile className="w-full" onFilesChange={handleFileUpload} />
        <Separator />
        <SaveGameHistory onSelectSave={handleSelectSave} />
        <Separator />
        <VersionHistory />
      </div>
    )
  }

  return <>{renderEditor()}</>
}
