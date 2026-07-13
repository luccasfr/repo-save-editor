import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { GitHubStars } from '@/components/github-stars'
import { LocaleSelector } from '@/components/locale-selector'
import { Logo } from '@/components/logo'
import { Suspense } from 'react'

function GitHubStarsFallback() {
  return (
    <div
      aria-hidden="true"
      className="bg-muted h-9 w-32 animate-pulse rounded-md border"
    />
  )
}

export function Navbar() {
  return (
    <div
      className="bg-background/50 fixed z-50 flex w-full items-center
        justify-between border-b px-7 pt-2 backdrop-blur md:px-12"
    >
      <Logo />

      <div className="flex -translate-y-1 gap-2">
        <Suspense fallback={<GitHubStarsFallback />}>
          <GitHubStars />
        </Suspense>
        <DarkModeToggle />
        <LocaleSelector />
      </div>
    </div>
  )
}
