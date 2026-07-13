import { Cross, Zap } from 'lucide-react'
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function HealthBar({
  health,
  healthUpgrade,
  onChange
}: {
  health: number
  healthUpgrade: number
  onChange?: (newHealth: number) => void
}) {
  const maxHealth = 100 + healthUpgrade * 20
  const [isDragging, setIsDragging] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              `relative flex h-8 w-full items-center justify-end rounded
              bg-green-800 px-2 text-white`,
              onChange && 'cursor-grab',
              isDragging && 'cursor-grabbing'
            )}
          >
            <div
              style={{ width: (health / maxHealth) * 100 + '%' }}
              className="absolute left-0 z-20 flex h-8 items-center
                justify-between rounded bg-green-600 px-2 py-1"
            >
              <Cross className="size-4" />
              <p className="font-mono">{health}</p>
            </div>
            <p className="absolute right-2 z-10 font-mono">{maxHealth}</p>
            <Slider
              min={0}
              max={maxHealth}
              value={[health]}
              onValueChange={(value) => onChange?.(value[0] ?? 0)}
              onPointerDown={() => setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              onPointerCancel={() => setIsDragging(false)}
              onBlur={() => setIsDragging(false)}
              aria-label="Health"
              className="absolute inset-0 z-30 size-full cursor-grab opacity-0
                disabled:cursor-default"
              disabled={!onChange}
            />
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
      className="flex h-8 w-full items-center justify-between gap-1 rounded
        bg-yellow-500 px-2 py-1"
    >
      <Zap className="size-4" />
      <p className="font-mono">{stamina * 10 + 40}</p>
    </div>
  )
}
