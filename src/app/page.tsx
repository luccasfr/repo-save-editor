"use client";

import SaveData from "@/components/save-data";
import UploadFile from "@/components/upload-file";
import { decryptEs3 } from "@/lib/es3-crypto";
import { type SaveDataType } from "@/model/save-game";
import { useState, useMemo } from "react";

export default function Home() {
  const [saveData, setSaveData] = useState<SaveDataType | null>(null);
  const [originalSaveData, setOriginalSaveData] = useState<SaveDataType | null>(
    null
  );

  const hasChanges = useMemo(() => {
    if (!saveData || !originalSaveData) return false;

    return JSON.stringify(saveData) !== JSON.stringify(originalSaveData);
  }, [saveData, originalSaveData]);

  const handleSaveDataUpdate = (updatedSaveData: SaveDataType) => {
    setSaveData(updatedSaveData);
  };

  const handleReset = () => {
    if (originalSaveData) {
      setSaveData(JSON.parse(JSON.stringify(originalSaveData)));
    }
  };

  const handleSave = () => {
    //data is in data uri format
    const buffer = Buffer.from(JSON.stringify(saveData), "base64");
    // create object url
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savegame.es3";
    a.click();
    URL.revokeObjectURL(url);
    setOriginalSaveData(
      JSON.parse(JSON.stringify(saveData))
    ); 
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
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center flex-col">
          <UploadFile
            className="w-96"
            onFilesChange={async (files) => {
              if (files.length > 0) {
                const decrypted = await decryptEs3(
                  files[0].base64,
                  "Why would you want to cheat?... :o It's no fun. :') :'D"
                );
                const parsed = JSON.parse(decrypted) as SaveDataType;
                setSaveData(parsed);
                setOriginalSaveData(JSON.parse(JSON.stringify(parsed))); // Cria uma cópia profunda
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
