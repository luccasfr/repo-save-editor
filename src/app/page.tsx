"use client";

import SaveData from "@/components/save-data";
import UploadFile from "@/components/upload-file";
import { decryptEs3 } from "@/lib/es3-crypto";
import { type SaveDataType } from "@/model/save-game";
import { useState } from "react";

export default function Home() {
  const [saveData, setSaveData] = useState<SaveDataType | null>(null);

  return (
    <div>
      {saveData ? (
        <SaveData saveData={saveData} />
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
                console.log(decrypted);
                const parsed = JSON.parse(decrypted) as SaveDataType;
                setSaveData(parsed);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
