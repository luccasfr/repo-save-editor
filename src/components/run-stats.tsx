import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SaveDataType } from "@/model/save-game";
import { DollarSign, Gauge, LucideIcon, Zap, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";

type RunStatKey = "level" | "currency" | "totalHaul" | "chargingStationCharge";

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours}h ${minutes}m ${secs}s`;
}

function RunStatsItem({
  title,
  value,
  icon: Icon,
  onIncrease,
  onDecrease,
  disableDecrease = false,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  onIncrease: () => void;
  onDecrease: () => void;
  disableDecrease?: boolean;
}) {
  return (
    <div className="text-sm flex flex-col items-center">
      <p className="font-medium">
        <Icon className="size-4 shrink-0 pr-0.5 inline-flex" />
        {title}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={disableDecrease}
        >
          <Minus className="size-3" />
        </Button>
        <p className="font-mono font-bold text-lg">{value}</p>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onIncrease}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}

type RunStatsProps = {
  saveData: SaveDataType;
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void;
};

export default function RunStats({
  saveData,
  onUpdateSaveData,
}: RunStatsProps) {
  const updateRunStatValue = (statName: RunStatKey, newValue: number) => {
    const updatedSaveData = { ...saveData };
    updatedSaveData.dictionaryOfDictionaries.value.runStats[statName] =
      newValue;
    onUpdateSaveData(updatedSaveData);
  };

  const handleStatChange = (
    statName: RunStatKey,
    change: number,
    minValue = 0
  ) => {
    const currentValue =
      saveData.dictionaryOfDictionaries.value.runStats[statName];
    const newValue = Math.max(minValue, currentValue + change);
    updateRunStatValue(statName, newValue);
  };

  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>Dados da Run</CardTitle>
        <CardDescription>
          {formatPlayTime(saveData.timePlayed.value)} jogados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <RunStatsItem
            icon={Gauge}
            title="Nível"
            value={saveData.dictionaryOfDictionaries.value.runStats.level.toString()}
            onIncrease={() => handleStatChange("level", 1, 1)}
            onDecrease={() => handleStatChange("level", -1, 1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.level <= 1
            }
          />
          <RunStatsItem
            icon={DollarSign}
            title="Dinheiro (K)"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.currency}`}
            onIncrease={() => handleStatChange("currency", 1)}
            onDecrease={() => handleStatChange("currency", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.currency <= 0
            }
          />
          <RunStatsItem
            icon={DollarSign}
            title="Total extraído (K)"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.totalHaul}`}
            onIncrease={() => handleStatChange("totalHaul", 1)}
            onDecrease={() => handleStatChange("totalHaul", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.totalHaul <= 0
            }
          />
          <RunStatsItem
            icon={Zap}
            title="Cargas na base"
            value={saveData.dictionaryOfDictionaries.value.runStats.chargingStationCharge.toString()}
            onIncrease={() => handleStatChange("chargingStationCharge", 1)}
            onDecrease={() => handleStatChange("chargingStationCharge", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats
                .chargingStationCharge <= 0
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
