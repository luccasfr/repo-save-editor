import { useSaveGame } from '@/hooks/use-save-game'
import { SaveGame } from '@/model/save-game'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'

export default function RemovePlayer({
  saveGame,
  onUpdateSaveData,
  playerId
}: {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  playerId: string
}) {
  const t = useTranslations('remove_player')
  const { removePlayer } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" title={t('button_label')}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmation_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmation_description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => removePlayer(playerId)}>
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
