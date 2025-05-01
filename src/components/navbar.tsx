import { Save } from 'lucide-react'
import { DarkModeToggle } from './dark-mode-toggle'
import { LocaleSelector } from './locale-selector'

export default function Navbar() {
  return (
    <div
      className="bg-background/50 fixed z-50 flex w-full items-center justify-between border-b
        px-7 py-2 font-mono backdrop-blur md:px-12"
    >
      <div className="flex gap-2 text-xl font-bold tracking-tight">
        <Save className="size-6" />
        <h1>repo-save-editor</h1>
      </div>
      <div className="flex gap-2">
        <DarkModeToggle />
        <LocaleSelector />
      </div>
    </div>
  )
}
