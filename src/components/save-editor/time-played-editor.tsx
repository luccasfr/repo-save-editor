import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPlayTime } from '@/utils/format-utils'
import { Edit } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface TimePlayedEditorProps {
  timePlayed: number
  onTimePlayedChange: (newTimePlayed: number) => void
}

export function TimePlayedEditor({
  timePlayed,
  onTimePlayedChange
}: TimePlayedEditorProps) {
  const t = useTranslations('run_stats')
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState(Math.floor(timePlayed / 3600))
  const [minutes, setMinutes] = useState(Math.floor((timePlayed % 3600) / 60))
  const [seconds, setSeconds] = useState(timePlayed % 60)

  const handleOpen = () => {
    setHours(Math.floor(timePlayed / 3600))
    setMinutes(Math.floor((timePlayed % 3600) / 60))
    setSeconds(timePlayed % 60)
    setIsOpen(true)
  }

  const handleSave = () => {
    const newTimePlayed = hours * 3600 + minutes * 60 + seconds
    onTimePlayedChange(newTimePlayed)
    setIsOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <p>
          {formatPlayTime(timePlayed)} {t('played_time')}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={handleOpen}
          title={t('edit_time')}
        >
          <Edit className="size-3" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('edit_time_title')}</DialogTitle>
            <DialogDescription>{t('edit_time_description')}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hours">{t('hours')}</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="minutes">{t('minutes')}</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) =>
                  setMinutes(Number.parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="seconds">{t('seconds')}</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) =>
                  setSeconds(Number.parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
