import { Cross, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import throttle from 'lodash.throttle'
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
  const maxHealth = useMemo(() => 100 + healthUpgrade * 20, [healthUpgrade])
  const barRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const currentHealthRef = useRef<number>(health)

  const throttledUpdate = useRef(
    throttle((newHealth: number) => {
      if (onChange && newHealth !== currentHealthRef.current) {
        currentHealthRef.current = newHealth
        onChange(newHealth)
      }
    }, 50)
  ).current

  useEffect(() => {
    currentHealthRef.current = health
  }, [health])

  const handleDrag = useCallback(
    (clientX: number) => {
      if (!barRef.current || !onChange) return

      const rect = barRef.current.getBoundingClientRect()
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      )
      const newHealth = Math.round(percentage * maxHealth)

      throttledUpdate(newHealth)
    },
    [onChange, maxHealth, throttledUpdate]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onChange) return
      e.preventDefault()
      setIsDragging(true)
      handleDrag(e.clientX)
    },
    [onChange, handleDrag]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!onChange) return
      setIsDragging(true)
      if (e.touches.length > 0) {
        handleDrag(e.touches[0].clientX)
      }
    },
    [onChange, handleDrag]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientX)
      }
    },
    [isDragging, handleDrag]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleDrag(e.touches[0].clientX)
      }
    },
    [isDragging, handleDrag]
  )

  const handleEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      globalThis.addEventListener('mousemove', handleMouseMove)
      globalThis.addEventListener('mouseup', handleEnd)
      globalThis.addEventListener('touchmove', handleTouchMove)
      globalThis.addEventListener('touchend', handleEnd)
      globalThis.addEventListener('touchcancel', handleEnd)
    }

    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove)
      globalThis.removeEventListener('mouseup', handleEnd)
      globalThis.removeEventListener('touchmove', handleTouchMove)
      globalThis.removeEventListener('touchend', handleEnd)
      globalThis.removeEventListener('touchcancel', handleEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  useEffect(() => {
    return () => {
      throttledUpdate.cancel()
    }
  }, [throttledUpdate])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={barRef}
            className={cn(
              `relative flex h-8 w-full items-center justify-end rounded bg-green-800 px-2
              text-white`,
              onChange && 'cursor-grab',
              isDragging && 'cursor-grabbing'
            )}
            onMouseDown={onChange ? handleMouseDown : undefined}
            onTouchStart={onChange ? handleTouchStart : undefined}
          >
            <div
              style={{ width: (health / maxHealth) * 100 + '%' }}
              className="absolute left-0 z-20 flex h-8 items-center justify-between rounded bg-green-600
                px-2 py-1"
            >
              <Cross className="size-4" />
              <p className="font-mono">{health}</p>
            </div>
            <p className="absolute right-2 z-10 font-mono">{maxHealth}</p>
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
