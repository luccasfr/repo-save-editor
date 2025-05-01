import { Cross, Zap } from 'lucide-react'
import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export function HealthBar({
  health,
  healthUpgrade
}: {
  health: number
  healthUpgrade: number
}) {
  const maxHealth = useMemo(() => 100 + healthUpgrade * 20, [healthUpgrade])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative flex h-8 w-full items-center justify-end rounded bg-green-800 px-2
              text-white"
          >
            <div
              style={{ width: (health / maxHealth) * 100 + '%' }}
              className="absolute left-0 z-10 flex h-8 items-center justify-between rounded bg-green-600
                px-2 py-1"
            >
              <Cross className="size-4" />
              <p className="font-mono">{health}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {health} / {maxHealth}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function StaminaBar({ stamina }: { stamina: number }) {
  return (
    <div
      className="flex h-8 w-full items-center justify-between gap-1 rounded bg-yellow-500 px-2
        py-1"
    >
      <Zap className="size-4" />
      <p className="font-mono">{stamina * 10 + 40}</p>
    </div>
  )
}
