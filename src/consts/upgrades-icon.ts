import { UpgradeType } from '@/hooks/use-player-upgrades'
import {
  ArrowBigUp,
  CircleChevronUp,
  Cross,
  Zap,
  Feather,
  MoveUp,
  Sofa,
  Users,
  type LucideIcon,
  BicepsFlexed
} from 'lucide-react'

/**
 * Maps player upgrade types to their corresponding Lucide icons.
 * Used to display appropriate visual indicators for different upgrade types in the UI.
 *
 * @constant {Record<UpgradeType, LucideIcon>}
 */
export const UPGRADES_ICON: Record<UpgradeType, LucideIcon> = {
  playerHealth: Cross,
  playerUpgradeCrouchRest: Sofa,
  playerUpgradeHealth: Cross,
  playerUpgradeTumbleWings: Feather,
  playerUpgradeExtraJump: ArrowBigUp,
  playerUpgradeLaunch: CircleChevronUp,
  playerUpgradeMapPlayerCount: Users,
  playerUpgradeRange: MoveUp,
  playerUpgradeStamina: Zap,
  playerUpgradeStrength: BicepsFlexed,
  playerUpgradeSpeed: Zap
}
