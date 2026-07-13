'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type LocaleSelectorProps = React.ComponentPropsWithoutRef<typeof Button>

export function LocaleSelector({ ...props }: LocaleSelectorProps) {
  const locale = useLocale()
  const router = useRouter()
  const flag = locale === 'pt' ? 'br' : 'us'
  const localeLabel = locale === 'pt' ? 'Português' : 'English'

  const handleLocaleChange = (newLocale: string) => {
    Cookies.set('locale', newLocale, {
      path: '/',
      expires: 365,
      sameSite: 'strict',
      secure: globalThis.location.protocol === 'https:'
    })
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <Image
            src={`https://flagcdn.com/${flag}.svg`}
            alt={localeLabel}
            width={24}
            height={18}
            className="h-4 w-auto"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn(
            'flex justify-between',
            locale === 'en' && 'font-semibold'
          )}
          onClick={() => handleLocaleChange('en')}
        >
          <Image
            src={`https://flagcdn.com/us.svg`}
            alt=""
            width={24}
            height={18}
            className="h-4 w-auto"
          />
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex justify-between',
            locale === 'pt' && 'font-semibold'
          )}
          onClick={() => handleLocaleChange('pt')}
        >
          <Image
            src={`https://flagcdn.com/br.svg`}
            alt=""
            width={24}
            height={18}
            className="h-4 w-auto"
          />
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
