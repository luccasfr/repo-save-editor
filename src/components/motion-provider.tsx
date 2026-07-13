'use client'

import { MotionConfig } from 'motion/react'

export function MotionProvider({ children }: React.PropsWithChildren) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
