import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SaveDataType } from "@/model/save-game";
import { ArrowBigUp, BicepsFlexed, CircleChevronUp, Cross, LucideIcon, MoveUp, Users, Zap } from "lucide-react";
import { Separator } from "./ui/separator";

type PlayersProps = {
  saveData: SaveDataType;
};

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
}: {
  count: number;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="text-sm flex flex-col items-center">
      <p className="font-medium">
        <Icon className="size-4 shrink-0 pr-0.5 inline-flex" />
        {title}
      </p>
      <p className="font-mono font-bold text-lg">{count}</p>
    </div>
  );
}

export default function PlayerList({ saveData }: PlayersProps) {
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
            />
            <UpgradeCount
              icon={BicepsFlexed}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeStrength[
                  key
                ] ?? 0
              }
              title="Força"
            />
            <UpgradeCount
              icon={MoveUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeRange[
                  key
                ] ?? 0
              }
              title="Alcance"
            />
            <UpgradeCount
              icon={CircleChevronUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeLaunch[
                  key
                ] ?? 0
              }
              title="Lançamento"
            />
            <UpgradeCount
              icon={ArrowBigUp}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeExtraJump[
                  key
                ] ?? 0
              }
              title="Salto extra"
            />
            <UpgradeCount
              icon={Users}
              count={
                saveData?.dictionaryOfDictionaries.value.playerUpgradeMapPlayerCount[
                  key
                ] ?? 0
              }
              title="Jogadores no mapa"
            />
          </div>
        </CardContent>
      </Card>
    ))
  );
}
