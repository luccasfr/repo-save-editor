'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { setCookie } from '@/lib/cookie'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useMemo } from 'react'

type DarkModeToggleProps = React.ComponentPropsWithoutRef<typeof Button>

export function LocaleSelector({ ...props }: DarkModeToggleProps) {
  const locale = useLocale()

  const flag = useMemo(() => {
    switch (locale) {
      case 'pt':
        return 'br'
      case 'en':
        return 'us'
      default:
        return 'us'
    }
  }, [locale])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <Image
            src={`https://flagcdn.com/${flag}.svg`}
            alt="flag"
            width={24}
            height={24}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn(
            'flex justify-between',
            locale === 'en' && 'font-semibold'
          )}
          onClick={() => setCookie('locale', 'en')}
        >
          <Image
            src={`https://flagcdn.com/us.svg`}
            alt="flag"
            width={24}
            height={24}
          />
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex justify-between',
            locale === 'pt' && 'font-semibold'
          )}
          onClick={() => setCookie('locale', 'pt')}
        >
          <Image
            src={`https://flagcdn.com/br.svg`}
            alt="flag"
            width={24}
            height={24}
          />
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
