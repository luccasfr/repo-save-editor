"use client";

import { type SaveDataType } from "@/model/save-game";
import PlayerList from "./player-list";
import RunStats from "./run-stats";
import { Button } from "./ui/button";
import { RotateCcw, Save } from "lucide-react";

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
  return (
    <div className="py-8 px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editor de Save</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
            disabled={!hasChanges}
          >
            <RotateCcw className="h-4 w-4" />
            Redefinir Alterações
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="flex items-center gap-2"
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            Salvar
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
