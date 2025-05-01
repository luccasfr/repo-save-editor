'use client'

import SaveData from '@/components/save-editor/save-data'
import UploadFile from '@/components/upload-file'
import { encryptEs3, decryptEs3 } from '@/lib/es3-crypto'
import { type SaveDataType } from '@/model/save-game'
import { useMemo, useState } from 'react'

export default function SaveEditor() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [saveData, setSaveData] = useState<SaveDataType | null>(null)
  const [originalSaveData, setOriginalSaveData] = useState<SaveDataType | null>(
    null
  )

  const hasChanges = useMemo(() => {
    if (!saveData || !originalSaveData) return false

    return JSON.stringify(saveData) !== JSON.stringify(originalSaveData)
  }, [saveData, originalSaveData])

  const handleSaveDataUpdate = (updatedSaveData: SaveDataType) => {
    setSaveData(updatedSaveData)
  }

  const handleReset = () => {
    if (originalSaveData) {
      setSaveData(JSON.parse(JSON.stringify(originalSaveData)))
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
      JSON.stringify(saveData, null, 4),
      "Why would you want to cheat?... :o It's no fun. :') :'D"
    )
    const blob = new Blob([binaryData])
    downloadSaveFile(blob, fileName || 'repo-save-game.es3')
    setOriginalSaveData(JSON.parse(JSON.stringify(saveData)))
  }

  const handleNewFile = () => {
    setSaveData(null)
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
      const parsed = JSON.parse(decrypted) as SaveDataType
      setSaveData(parsed)
      setOriginalSaveData(JSON.parse(JSON.stringify(parsed)))
      setFileName(files[0].name)
    }
  }

  return (
    <div>
      {saveData ? (
        <SaveData
          saveData={saveData}
          onUpdateSaveData={handleSaveDataUpdate}
          onReset={handleReset}
          hasChanges={hasChanges}
          onSave={handleSave}
          onNewFile={handleNewFile}
          fileName={fileName}
        />
      ) : (
        <UploadFile className="w-full" onFilesChange={handleFileUpload} />
      )}
    </div>
  )
}
