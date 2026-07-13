'use client'

import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from 'motion/react'
import { ComponentPropsWithoutRef, useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { useStartNumberTicker } from '@/hooks/use-start-number-ticker'
import { cn } from '@/lib/utils'

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number
  startValue?: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const shouldReduceMotion = usePrefersReducedMotion()

  if (shouldReduceMotion) {
    return (
      <TickerValue
        value={value}
        decimalPlaces={decimalPlaces}
        className={className}
        {...props}
      />
    )
  }

  return (
    <AnimatedTickerValue
      value={value}
      startValue={startValue}
      direction={direction}
      delay={delay}
      decimalPlaces={decimalPlaces}
      className={className}
      {...props}
    />
  )
}

function formatTickerValue(value: number, decimalPlaces: number) {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(Number(value.toFixed(decimalPlaces)))
}

function TickerValue({
  value,
  decimalPlaces,
  className,
  ...props
}: Pick<NumberTickerProps, 'value' | 'decimalPlaces'> &
  ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        `inline-block font-mono tracking-wider text-black tabular-nums
        dark:text-white`,
        className
      )}
      {...props}
    >
      {formatTickerValue(value, decimalPlaces ?? 0)}
    </span>
  )
}

function AnimatedTickerValue({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  decimalPlaces = 0,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useStartNumberTicker({
    delay,
    direction,
    isInView,
    motionValue,
    startValue,
    value
  })

  useMotionValueEvent(springValue, 'change', (latest) => {
    if (ref.current) {
      ref.current.textContent = formatTickerValue(latest, decimalPlaces)
    }
  })

  return (
    <span
      ref={ref}
      className={cn(
        `inline-block font-mono tracking-wider text-black tabular-nums
        dark:text-white`,
        className
      )}
      {...props}
    >
      {formatTickerValue(startValue, decimalPlaces)}
    </span>
  )
}
