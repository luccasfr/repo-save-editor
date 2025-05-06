import { DarkModeToggle } from '@/components/dark-mode-toggle'
import GitHubStars from '@/components/github-stars'
import { LocaleSelector } from '@/components/locale-selector'
import Logo from '@/components/logo'

export default function Navbar() {
  return (
    <div
      className="bg-background/50 fixed z-50 flex w-full items-center justify-between border-b
        px-7 pt-2 backdrop-blur md:px-12"
    >

        <Logo />

      <div className="flex gap-2 -translate-y-1">
        <GitHubStars />
        <DarkModeToggle />
        <LocaleSelector />
      </div>
    </div>
  )
}
