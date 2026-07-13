import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function useBlinkingLogo() {
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) return

    const randomInterval = Math.floor(Math.random() * (1500 - 100 + 1)) + 500
    const timeout = setTimeout(() => {
      setIsOpen((current) => !current)
    }, randomInterval)

    return () => clearTimeout(timeout)
  }, [isOpen, shouldReduceMotion])

  return shouldReduceMotion ? false : isOpen
}
