export interface SaveDataType {
  dictionaryOfDictionaries: DictionaryOfDictionaries;
  playerNames:              PlayerNames;
  timePlayed:               TimePlayed;
  dateAndTime:              DateAndTime;
  teamName:                 DateAndTime;
}

export interface DateAndTime {
  __type: string;
  value:  string;
}

export interface DictionaryOfDictionaries {
  __type: string;
  value:  DictionaryOfDictionariesValue;
}

export interface DictionaryOfDictionariesValue {
  runStats:                    RunStats;
  itemsPurchased:              { [key: string]: number };
  itemsPurchasedTotal:         { [key: string]: number };
  itemsUpgradesPurchased:      { [key: string]: number };
  itemBatteryUpgrades:         { [key: string]: number };
  playerHealth:                { [key: string]: number };
  playerUpgradeHealth:         { [key: string]: number };
  playerUpgradeStamina:        { [key: string]: number };
  playerUpgradeExtraJump:      { [key: string]: number };
  playerUpgradeLaunch:         { [key: string]: number };
  playerUpgradeMapPlayerCount: { [key: string]: number };
  playerUpgradeSpeed:          { [key: string]: number };
  playerUpgradeStrength:       { [key: string]: number };
  playerUpgradeRange:          { [key: string]: number };
  playerUpgradeThrow:          { [key: string]: number };
  playerHasCrown:              { [key: string]: number };
  item:                        { [key: string]: number };
  itemStatBattery:             { [key: string]: number };
}

export interface RunStats {
  level:                 number;
  currency:              number;
  lives:                 number;
  chargingStationCharge: number;
  totalHaul:             number;
  "save level":          number;
}

export interface PlayerNames {
  __type: string;
  value:  { [key: string]: number };
}

export interface TimePlayed {
  __type: string;
  value:  number;
}
