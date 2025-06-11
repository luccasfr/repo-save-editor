'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useSaveGameHistory } from '@/hooks/use-save-game-history'
import downloadSaveGame from '@/lib/download-save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'
import { Check, Clock, Download, Trash2, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Heading from '@/components/heading'

interface SaveGameStatsProps {
  level: number
  totalHaul: number
  playerCount: number
}

function SaveGameStats({ level, totalHaul, playerCount }: SaveGameStatsProps) {
  const t = useTranslations('save_history')

  return (
    <>
      <div className="flex justify-between">
        <span>{t('level')}</span>
        <span className="font-mono font-medium">{level}</span>
      </div>
      <div className="flex justify-between">
        <span>{t('total_haul')}</span>
        <span className="font-mono font-medium">{totalHaul}K</span>
      </div>
      <div className="flex justify-between">
        <span>{t('players')}</span>
        <span className="font-mono font-medium">{playerCount}</span>
      </div>
    </>
  )
}

type SaveGameHistoryProps = {
  onSelectSave?: (saveGame: SaveGameHistoryType) => void
}

export default function SaveGameHistory({
  onSelectSave
}: SaveGameHistoryProps) {
  const { history, clearHistory, disabled, disableHistory, enableHistory } =
    useSaveGameHistory()
  const t = useTranslations('save_history')

  if (disabled) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-foreground/40 text-sm">{t('disabled')}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={enableHistory}
          className="flex items-center gap-1"
        >
          <Check className="h-4 w-4" />
          <span>{t('enable')}</span>
        </Button>
      </div>
    )
  }

  if (history.length === 0)
    return <p className="text-foreground/40 text-sm">{t('empty')}</p>

  return (
    <div className="space-y-4">
      <Heading title={t(`title`)} description={t(`disclaimer`)} />
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t('clear')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={disableHistory}
          className="ml-2 flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          <span>{t('disable')}</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <Card key={item.fileName + item.timestamp}>
            <CardHeader className="pb-2">
              <CardTitle className="truncate font-mono text-sm">
                {item.fileName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground text-xs">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <SaveGameStats
                  level={item.summary.level}
                  totalHaul={item.summary.totalHaul}
                  playerCount={item.summary.playerCount}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex flex-1 items-center gap-1"
                    onClick={() => onSelectSave?.(item)}
                  >
                    <Upload className="h-4 w-4" />
                    <span>{t('load')}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() =>
                      downloadSaveGame(item.saveGame, item.fileName)
                    }
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('download')}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
