import { SaveGame } from '@/model/save-game'

export type SaveGameHistoryType = {
  fileName: string
  saveGame: SaveGame
  timestamp: number
  summary: {
    level: number
    totalHaul: number
    playerCount: number
  }
}
