"use client";

import { type SaveDataType } from "@/model/save-game";
import PlayerList from "./player-list";
import RunStats from "./run-stats";

export default function SaveData({ saveData }: { saveData: SaveDataType }) {
  return (
    <div>
      <RunStats saveData={saveData} />
      <PlayerList saveData={saveData} />;
    </div>
  );
}
