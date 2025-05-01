"use client";

import { type SaveDataType } from "@/model/save-game";
import PlayerList from "./player-list";
import RunStats from "./run-stats";
import { Button } from "./ui/button";
import { RotateCcw, Save } from "lucide-react";
import { useTranslations } from "next-intl";

type SaveDataProps = {
  saveData: SaveDataType;
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void;
  onReset: () => void;
  hasChanges: boolean;
  onSave: () => void;
};

export default function SaveData({
  saveData,
  onUpdateSaveData,
  onReset,
  onSave,
  hasChanges,
}: SaveDataProps) {
  const t = useTranslations("save_data")

  return (
    <div className="pb-8 pt-4 px-12 space-y-4">
      <div className="flex justify-end items-center gap-2">
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
      <RunStats saveData={saveData} onUpdateSaveData={onUpdateSaveData} />
      <div className="mt-6">
        <PlayerList saveData={saveData} onUpdateSaveData={onUpdateSaveData} />
      </div>
    </div>
  );
}
