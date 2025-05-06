'use client'

import gitHubLogo from '@/assets/github-mark.svg'
import { Button } from '@/components/ui/button'
import fetchGitHubStars from '@/lib/fetch-github-stars'
import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import Star from './star'
import { NumberTicker } from './ui/number-ticker'
import { useTranslations } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

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
                className="size-4"
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
