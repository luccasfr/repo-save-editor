import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SaveDataType } from "@/model/save-game";
import { ArrowBigUp, BicepsFlexed, CircleChevronUp, Cross, LucideIcon, MoveUp, Users, Zap, Plus, Minus } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

type PlayersProps = {
  saveData: SaveDataType;
  onUpdateSaveData: (updatedSaveData: SaveDataType) => void;
};

type UpgradeType = 
  | "playerUpgradeSpeed" 
  | "playerUpgradeStrength" 
  | "playerUpgradeRange" 
  | "playerUpgradeLaunch" 
  | "playerUpgradeExtraJump" 
  | "playerUpgradeMapPlayerCount" 
  | "playerUpgradeStamina" 
  | "playerHealth";

function HealthBar({ health }: { health: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 w-full bg-green-800 rounded text-white justify-between">
      <Cross className="size-4" />
      <p className="font-mono ">{health}</p>
    </div>
  );
}

function StaminaBar({ stamina }: { stamina: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 w-full bg-yellow-500 rounded justify-between">
      <Zap className="size-4" />
      <p className="font-mono ">{stamina * 10 + 40}</p>
    </div>
  );
}

function UpgradeCount({
  count,
  title,
  icon: Icon,
  onIncrease,
  onDecrease,
}: {
  count: number;
  title: string;
  icon: LucideIcon;
  onIncrease: () => void;
  onDecrease: () => void;
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
          disabled={count <= 0}
        >
          <Minus className="size-3" />
        </Button>
        <p className="font-mono font-bold text-lg">{count}</p>
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

export default function PlayerList({ saveData, onUpdateSaveData }: PlayersProps) {
  const updateUpgradeValue = (
    playerId: string, 
    upgradeType: UpgradeType, 
    newValue: number
  ) => {
    const updatedSaveData = { ...saveData };
    updatedSaveData.dictionaryOfDictionaries.value[upgradeType][playerId] = newValue;
    onUpdateSaveData(updatedSaveData);
  };

  return (
    saveData?.playerNames &&
    Object.entries(saveData?.playerNames.value).map(([key, value]) => (
      <Card key={key} className="min-w-96">
        <CardHeader>
          <CardTitle>{value}</CardTitle>
          <CardDescription>{key}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="font-bold">Status</h1>
          <HealthBar
            health={
              saveData?.dictionaryOfDictionaries.value.playerHealth[key] ?? 0
            }
          />
          <StaminaBar
            stamina={
              saveData?.dictionaryOfDictionaries.value.playerUpgradeStamina[
                key
              ] ?? 0
            }
          />
          <Separator />
          <h1 className="font-bold">Upgrades</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <UpgradeCount
              icon={Zap}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[
                  key
                ] ?? 0
              }
              title="Velocidade"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeSpeed", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeSpeed[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeSpeed", currentValue - 1);
                }
              }}
            />
            <UpgradeCount
              icon={BicepsFlexed}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeStrength[
                  key
                ] ?? 0
              }
              title="Força"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeStrength[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeStrength", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeStrength[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeStrength", currentValue - 1);
                }
              }}
            />
            <UpgradeCount
              icon={MoveUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[
                  key
                ] ?? 0
              }
              title="Alcance"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeRange", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeRange", currentValue - 1);
                }
              }}
            />
            <UpgradeCount
              icon={CircleChevronUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[
                  key
                ] ?? 0
              }
              title="Lançamento"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeLaunch", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeLaunch", currentValue - 1);
                }
              }}
            />
            <UpgradeCount
              icon={ArrowBigUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeExtraJump[
                  key
                ] ?? 0
              }
              title="Salto extra"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeExtraJump[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeExtraJump", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeExtraJump[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeExtraJump", currentValue - 1);
                }
              }}
            />
            <UpgradeCount
              icon={Users}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeMapPlayerCount[
                  key
                ] ?? 0
              }
              title="Contagem de jogadores"
              onIncrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeMapPlayerCount[key] ?? 0;
                updateUpgradeValue(key, "playerUpgradeMapPlayerCount", currentValue + 1);
              }}
              onDecrease={() => {
                const currentValue = saveData?.dictionaryOfDictionaries.value.playerUpgradeMapPlayerCount[key] ?? 0;
                if (currentValue > 0) {
                  updateUpgradeValue(key, "playerUpgradeMapPlayerCount", currentValue - 1);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    ))
  );
}
