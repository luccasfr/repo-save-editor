import gitHubLogo from '@/assets/github-mark.svg'
import gitHubLogoWhite from '@/assets/github-mark-white.svg'
import { Star } from '@/components/star'
import { Button } from '@/components/ui/button'
import { NumberTicker } from '@/components/ui/number-ticker'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { fetchGitHubStars } from '@/lib/fetch-github-stars'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

export async function GitHubStars() {
  const [t, gitHubStars] = await Promise.all([
    getTranslations('github_stars'),
    fetchGitHubStars()
  ])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" className="group">
            <Link
              href="https://github.com/luccasfr/repo-save-editor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={gitHubLogo}
                alt=""
                width={32}
                height={32}
                className="block size-4 dark:hidden"
              />
              <Image
                src={gitHubLogoWhite}
                alt=""
                width={32}
                height={32}
                className="hidden size-4 dark:block"
              />
              <span className="font-sans">{t('title')}</span>
              <span className="flex items-center gap-1">
                <Star
                  className="size-4 transition-colors
                    group-hover:text-amber-500"
                />
                <NumberTicker value={gitHubStars} />
              </span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="block md:hidden">
          {t(`description`)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
