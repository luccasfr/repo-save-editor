'use client'

import gitHubLogo from '@/assets/github-mark.svg'
import gitHubLogoWhite from '@/assets/github-mark-white.svg'
import Star from '@/components/star'
import { Button } from '@/components/ui/button'
import { NumberTicker } from '@/components/ui/number-ticker'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import fetchGitHubStars from '@/lib/fetch-github-stars'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'

export default function GitHubStars() {
  const t = useTranslations('github_stars')
  const [gitHubStars, setGitHubStars] = useState<number>(0)

  useLayoutEffect(() => {
    const fetch = async () => {
      const stars = await fetchGitHubStars()
      setGitHubStars(stars)
    }
    fetch()
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="https://github.com/luccasfr/repo-save-editor"
            target="_blank"
          >
            <Button variant="outline" className="group">
              <Image
                src={gitHubLogo}
                alt="logo"
                width={32}
                height={32}
                className="size-4 dark:hidden block"
              />
              <Image
                src={gitHubLogoWhite}
                alt="logo"
                width={32}
                height={32}
                className="size-4 dark:block hidden"
              />
              <p className="font-sans">{t('title')}</p>
              <div className="flex items-center gap-1">
                <Star className="size-4 transition-colors group-hover:text-amber-500" />
                <NumberTicker value={gitHubStars} />
              </div>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="block md:hidden">{t(`description`)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
