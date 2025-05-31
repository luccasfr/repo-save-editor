'use client'

import { type SaveGame } from '@/model/save-game'
import PlayerList from './player-list'
import RunStats from './run-stats'
import { Button } from '@/components/ui/button'
import { LucideIcon, Plus, RotateCcw, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { SteamAvatars } from '@/model/steam-avatars'

type SaveDataActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
}

function SaveDataActionButton({
  icon: Icon,
  label,
  onClick,
  disabled
}: SaveDataActionButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onClick}
            className="flex items-center gap-2"
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
            <p className="hidden md:block">{label}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="block md:hidden">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type SaveDataProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  onReset: () => void
  hasChanges: boolean
  onSave: () => void
  onNewFile: () => void
  fileName?: string | null
  steamAvatars: SteamAvatars | null
}

export default function SaveData({
  saveGame,
  onUpdateSaveData,
  onReset,
  onSave,
  hasChanges,
  onNewFile,
  fileName,
  steamAvatars
}: SaveDataProps) {
  const t = useTranslations('save_data')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="space-y-4">
      {fileName && (
        <div className="text-muted-foreground font-mono">{fileName}</div>
      )}
      <div className="flex items-center justify-between gap-2">
        <SaveDataActionButton
          icon={Plus}
          label={t('new_file')}
          onClick={onNewFile}
        />
        <div className="flex items-center gap-2">
          <SaveDataActionButton
            icon={RotateCcw}
            label={t('reset')}
            onClick={onReset}
            disabled={!hasChanges}
          />
          <SaveDataActionButton
            icon={Save}
            label={t('save')}
            onClick={onSave}
            disabled={!hasChanges}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="font-bold">{t('run_data')}</p>
        <RunStats saveGame={saveGame} onUpdateSaveData={onUpdateSaveData} />
        <p className="font-bold">{t('players')}</p>
        <PlayerList
          saveGame={saveGame}
          onUpdateSaveData={onUpdateSaveData}
          steamAvatars={steamAvatars}
        />
      </div>
    </div>
  )
}
