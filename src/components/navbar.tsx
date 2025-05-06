import { DarkModeToggle } from '@/components/dark-mode-toggle'
import GitHubStars from '@/components/github-stars'
import { LocaleSelector } from '@/components/locale-selector'
import Logo from '@/components/logo'

export default function Navbar() {
  return (
    <div
      className="bg-background/50 fixed z-50 flex w-full items-center justify-between border-b
        px-7 py-2 font-mono backdrop-blur md:px-12"
    >
      <div className="flex items-center gap-1 font-bold tracking-tight">
        <Logo />
        <h1 className="hidden md:block">repo-save-editor</h1>
      </div>
      <div className="flex gap-2">
        <GitHubStars />
        <DarkModeToggle />
        <LocaleSelector />
      </div>
    </div>
  )
}
