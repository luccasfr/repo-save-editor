'use client'

import Image from 'next/image'
import logo from '@/assets/closed.png'
import logoOpen from '@/assets/open.png'
import { useBlinkingLogo } from '@/hooks/use-blinking-logo'
import { cn } from '@/lib/utils'

export function Logo() {
  const isOpen = useBlinkingLogo()

  return (
    <>
      <Image
        src={logo}
        alt="logo"
        width={64}
        height={64}
        className={cn('size-12', isOpen ? 'hidden' : 'block')}
        priority
      />
      <Image
        src={logoOpen}
        alt="logoOpen"
        width={64}
        height={64}
        className={cn('size-12', isOpen ? 'block' : 'hidden')}
        priority
      />
    </>
  )
}
