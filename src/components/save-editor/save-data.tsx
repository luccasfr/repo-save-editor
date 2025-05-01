"use client";

import { type SaveDataType } from "@/model/save-game";
import PlayerList from "./player-list";
import RunStats from "./run-stats";
import { Button } from "../ui/button";
import { Plus, RotateCcw, Save } from "lucide-react";
import { useTranslations } from "next-intl";

type SaveDataProps = {
  saveData: SaveDataType;
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void;
  onReset: () => void;
  hasChanges: boolean;
  onSave: () => void;
  onNewFile: () => void;
  fileName?: string | null;
};

export default function SaveData({
  saveData,
  onUpdateSaveData,
  onReset,
  onSave,
  hasChanges,
  onNewFile,
  fileName
}: SaveDataProps) {
  const t = useTranslations("save_data");

  return (
    <div className="space-y-4">
      {fileName && (  
        <div className="font-mono text-muted-foreground">
          {fileName}
        </div>
      )}
      <div className="flex justify-between items-center gap-2">
        <Button
          variant="outline"
          onClick={onNewFile}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("new_file")}
        </Button>
        <div className="flex">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
            disabled={!hasChanges}
          >
            <RotateCcw className="h-4 w-4" />
            {t("reset")}
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="flex items-center gap-2"
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            {t("save")}
          </Button>
        </div>
      </div>
      <RunStats saveData={saveData} onUpdateSaveData={onUpdateSaveData} />
      <div className="mt-6">
        <PlayerList saveData={saveData} onUpdateSaveData={onUpdateSaveData} />
      </div>
    </div>
  );
}
