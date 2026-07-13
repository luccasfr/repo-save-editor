import type { MotionValue } from 'motion/react'
import { useEffect } from 'react'

type StartNumberTickerOptions = {
  delay: number
  direction: 'up' | 'down'
  isInView: boolean
  motionValue: MotionValue<number>
  startValue: number
  value: number
}

export function useStartNumberTicker({
  delay,
  direction,
  isInView,
  motionValue,
  startValue,
  value
}: StartNumberTickerOptions) {
  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      motionValue.set(direction === 'down' ? startValue : value)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [motionValue, isInView, delay, value, direction, startValue])
}
