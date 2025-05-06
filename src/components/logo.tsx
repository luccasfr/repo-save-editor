'use client'

import Image from 'next/image'
import logo from '@/assets/closed.png'
import logoOpen from '@/assets/open.png'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function Logo() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const randomInterval = Math.floor(Math.random() * (1500 - 100 + 1)) + 500
    const timeout = setTimeout(() => {
      setIsOpen(!isOpen)
    }, randomInterval)

    return () => {
      clearTimeout(timeout)
    }
  }, [isOpen])

  return (
    <>
      <Image
        src={logo}
        alt="logo"
        width={64}
        height={64}
        className={cn('size-8 md:size-6', isOpen ? 'hidden' : 'block')}
      />
      <Image
        src={logoOpen}
        alt="logoOpen"
        width={64}
        height={64}
        className={cn('size-8 md:size-6', isOpen ? 'block' : 'hidden')}
      />
    </>
  )
}
