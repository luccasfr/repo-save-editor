import { CommitInput } from '@/components/save-editor/commit-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { useSaveGame } from '@/hooks/use-save-game'
import { SaveGame } from '@/model/save-game'
import { useTranslations } from 'next-intl'

type SaveMetadataProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function SaveMetadata({
  saveGame,
  onUpdateSaveData
}: SaveMetadataProps) {
  const t = useTranslations('run_stats')
  const { updateTeamName, updateDateAndTime } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })

  const teamName = saveGame.teamName.value
  const saveDate = saveGame.dateAndTime.value
  return (
    <section
      aria-labelledby="save-metadata-title"
      className="bg-muted/30 space-y-3 rounded-lg border p-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="save-metadata-title" className="text-sm font-semibold">
          {t('metadata_title')}
        </h2>
        <p
          id="team-name-status"
          className="text-muted-foreground text-xs"
          aria-live="polite"
        >
          {saveGame.teamNameChanged.value
            ? t('team_name_changed')
            : t('team_name_original')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(10rem,1fr)]">
        <div className="space-y-1.5">
          <Label htmlFor="team-name">{t('team_name')}</Label>
          <CommitInput
            key={`team-name-${teamName}`}
            id="team-name"
            value={teamName}
            aria-describedby="team-name-status"
            onCommit={(value) => {
              const trimmedValue = value.trim()
              if (!trimmedValue || trimmedValue === teamName) return false
              updateTeamName(trimmedValue)
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="save-date">{t('save_date')}</Label>
          <DatePicker
            id="save-date"
            value={saveDate}
            aria-label={t('save_date')}
            onValueChange={updateDateAndTime}
          />
        </div>
      </div>
    </section>
  )
}
