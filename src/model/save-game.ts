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
 * Records the quantities of each purchasable item in the game
 */
export interface ItemsPurchased {
  'Item Cart Medium': number
  'Item Cart Small': number
  'Item Drone Battery': number
  'Item Drone Feather': number
  'Item Drone Indestructible': number
  'Item Drone Torque': number
  'Item Drone Zero Gravity': number
  'Item Extraction Tracker': number
  'Item Grenade Duct Taped': number
  'Item Grenade Explosive': number
  'Item Grenade Human': number
  'Item Grenade Shockwave': number
  'Item Grenade Stun': number
  'Item Gun Handgun': number
  'Item Gun Shotgun': number
  'Item Gun Tranq': number
  'Item Health Pack Large': number
  'Item Health Pack Medium': number
  'Item Health Pack Small': number
  'Item Melee Baseball Bat': number
  'Item Melee Frying Pan': number
  'Item Melee Inflatable Hammer': number
  'Item Melee Sledge Hammer': number
  'Item Melee Sword': number
  'Item Mine Explosive': number
  'Item Mine Shockwave': number
  'Item Mine Stun': number
  'Item Orb Zero Gravity': number
  'Item Power Crystal': number
  'Item Rubber Duck': number
  'Item Upgrade Map Player Count': number
  'Item Upgrade Player Energy': number
  'Item Upgrade Player Extra Jump': number
  'Item Upgrade Player Grab Range': number
  'Item Upgrade Player Grab Strength': number
  'Item Upgrade Player Health': number
  'Item Upgrade Player Sprint Speed': number
  'Item Upgrade Player Tumble Launch': number
  'Item Valuable Tracker': number
}

/**
 * Contains all game statistics and player progress data
 */
export interface DictionaryOfDictionariesValue {
  runStats: RunStats
  itemsPurchased: ItemsPurchased
  itemsPurchasedTotal: ItemsPurchased
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
  value: { [key: string]: number }
}

/**
 * Records the total time played in seconds
 */
export interface TimePlayed {
  __type: string
  value: number
}
