/**
 * Represents the complete save data structure for the game
 */
export interface SaveGame {
  dictionaryOfDictionaries: DictionaryOfDictionaries
  playerNames: PlayerNames
  timePlayed: TimePlayed
  dateAndTime: DateAndTime
  teamName: DateAndTime
}

/**
 * Represents date and time data with type information
 */
export interface DateAndTime {
  __type: string
  value: string
}

/**
 * Container for various dictionaries of game data
 */
export interface DictionaryOfDictionaries {
  __type: string
  value: DictionaryOfDictionariesValue
}

/**
 * Contains all game statistics and player progress data
 */
export interface DictionaryOfDictionariesValue {
  runStats: RunStats
  itemsPurchased: { [key: string]: number }
  itemsPurchasedTotal: { [key: string]: number }
  itemsUpgradesPurchased: { [key: string]: number }
  itemBatteryUpgrades: { [key: string]: number }
  playerHealth: { [key: string]: number }
  playerUpgradeHealth: { [key: string]: number }
  playerUpgradeStamina: { [key: string]: number }
  playerUpgradeExtraJump: { [key: string]: number }
  playerUpgradeLaunch: { [key: string]: number }
  playerUpgradeMapPlayerCount: { [key: string]: number }
  playerUpgradeSpeed: { [key: string]: number }
  playerUpgradeStrength: { [key: string]: number }
  playerUpgradeRange: { [key: string]: number }
  playerUpgradeThrow: { [key: string]: number }
  playerHasCrown: { [key: string]: number }
  item: { [key: string]: number }
  itemStatBattery: { [key: string]: number }
  playerUpgradeCrouchRest?: { [key: string]: number }
  playerUpgradeTumbleWings?: { [key: string]: number }
}

/**
 * Statistics for the current game run
 */
export interface RunStats {
  level: number
  currency: number
  lives: number
  chargingStationCharge: number
  totalHaul: number
  'save level': number
}

/**
 * Maps player identifiers to their names
 */
export interface PlayerNames {
  __type: string
  value: { [key: string]: string }
}

/**
 * Records the total time played in seconds
 */
export interface TimePlayed {
  __type: string
  value: number
}
