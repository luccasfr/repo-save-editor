import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PURCHASED_ITEMS_ICON } from "@/consts/purchased-items-icon";
import type { ItemsPurchased, SaveDataType } from "@/model/save-game";
import {
  Box,
  DollarSign,
  Gauge,
  LucideIcon,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type RunStatKey = "level" | "currency" | "totalHaul" | "chargingStationCharge";

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours}h ${minutes}m ${secs}s`;
}

function RunStatsItem({
  titleKey,
  value,
  icon: Icon,
  onIncrease,
  onDecrease,
  disableDecrease = false,
}: {
  titleKey: string;
  value: string;
  icon: LucideIcon;
  onIncrease: () => void;
  onDecrease: () => void;
  disableDecrease?: boolean;
}) {
  const t = useTranslations("run_stats");

  return (
    <div className="text-sm flex flex-col items-center ">
      <p className="font-medium">
        <Icon className="size-4 shrink-0 pr-0.5 inline-flex" />
        {t(`stats.${titleKey}`)}
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
  const t = useTranslations("run_stats");

  const updateRunStatValue = (statName: RunStatKey, newValue: number) => {
    const updatedSaveData = { ...saveData };
    updatedSaveData.dictionaryOfDictionaries.value.runStats[statName] =
      newValue;
    onUpdateSaveData(updatedSaveData);
  };

  const updatePurchasedItemValue = (
    itemName: keyof ItemsPurchased,
    newValue: number
  ) => {
    const updatedSaveData = { ...saveData };
    updatedSaveData.dictionaryOfDictionaries.value.itemsPurchased[itemName] =
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

  const handleItemsPurchasedChange = (
    statName: keyof ItemsPurchased,
    change: number,
    minValue = 0
  ) => {
    const currentValue =
      saveData.dictionaryOfDictionaries.value.itemsPurchased[statName];
    const newValue = Math.max(minValue, currentValue + change);
    updatePurchasedItemValue(statName, newValue);
  };

  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {formatPlayTime(saveData.timePlayed.value)} {t("played_time")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <RunStatsItem
            icon={Gauge}
            titleKey="level"
            value={(
              saveData.dictionaryOfDictionaries.value.runStats.level + 1
            ).toString()}
            onIncrease={() => handleStatChange("level", 1, 1)}
            onDecrease={() => handleStatChange("level", -1, 1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.level <= 1
            }
          />
          <RunStatsItem
            icon={DollarSign}
            titleKey="currency"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.currency}`}
            onIncrease={() => handleStatChange("currency", 1)}
            onDecrease={() => handleStatChange("currency", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.currency <= 0
            }
          />
          <RunStatsItem
            icon={DollarSign}
            titleKey="total_haul"
            value={`${saveData.dictionaryOfDictionaries.value.runStats.totalHaul}`}
            onIncrease={() => handleStatChange("totalHaul", 1)}
            onDecrease={() => handleStatChange("totalHaul", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats.totalHaul <= 0
            }
          />
          <RunStatsItem
            icon={Zap}
            titleKey="charging_station"
            value={saveData.dictionaryOfDictionaries.value.runStats.chargingStationCharge.toString()}
            onIncrease={() => handleStatChange("chargingStationCharge", 1)}
            onDecrease={() => handleStatChange("chargingStationCharge", -1)}
            disableDecrease={
              saveData.dictionaryOfDictionaries.value.runStats
                .chargingStationCharge <= 0
            }
          />
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="last:border-b">
            <AccordionTrigger className="hover:bg-accent p-2 ">
              <div className="flex items-center gap-0.5">
                <Box className="size-4" />
                <p>{t(`items_title`)}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(
                  saveData.dictionaryOfDictionaries.value.itemsPurchased
                ).map(([key, value]) => {
                  const itemName = key.replace("Item ", "").replace(/_/g, " ");
                  return (
                    <RunStatsItem
                      key={key}
                      icon={PURCHASED_ITEMS_ICON[itemName] ?? Zap}
                      titleKey={itemName}
                      value={value.toString()}
                      onIncrease={() =>
                        handleItemsPurchasedChange(
                          key as keyof ItemsPurchased,
                          1
                        )
                      }
                      onDecrease={() =>
                        handleItemsPurchasedChange(
                          key as keyof ItemsPurchased,
                          -1
                        )
                      }
                      disableDecrease={value <= 0}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
