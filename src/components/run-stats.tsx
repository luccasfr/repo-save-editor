import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SaveDataType } from "@/model/save-game";
import { DollarSign, Gauge, LucideIcon, Zap } from "lucide-react";

function RunStatsItem({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="text-sm flex flex-col items-center">
      <p className="font-medium">
        <Icon className="size-4 shrink-0 pr-0.5 inline-flex" />
        {title}
      </p>
      <p className="font-mono font-bold text-lg">{value}</p>
    </div>
  );
}

export default function RunStats({ saveData }: { saveData: SaveDataType }) {
  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>Dados da Run</CardTitle>
        {/* <CardDescription>{key}</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <RunStatsItem
            icon={Gauge}
            title="Nível"
            value={saveData.dictionaryOfDictionaries.value.runStats.level.toString()}
          />
          <RunStatsItem
            icon={DollarSign}
            title="Dinheiro"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.currency}K`}
          />
          <RunStatsItem
            icon={DollarSign}
            title="Total extraído"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.totalHaul}K`}
          />
          <RunStatsItem
            icon={Zap}
            title="Cargas na base"
            value={saveData.dictionaryOfDictionaries.value.runStats.chargingStationCharge.toString()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
