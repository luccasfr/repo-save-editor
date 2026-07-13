'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useState } from 'react'

type DatePickerProps = {
  id: string
  value: string
  onValueChange: (value: string) => void
  'aria-label': string
  className?: string
}

function parseSaveDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return

  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined
}

function formatSaveDate(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) =>
      index === 0 ? String(part) : String(part).padStart(2, '0')
    )
    .join('-')
}

export function DatePicker({
  id,
  value,
  onValueChange,
  className,
  'aria-label': ariaLabel
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const selectedDate = parseSaveDate(value)
  const dateLocale = locale === 'pt' ? ptBR : enUS

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          aria-label={ariaLabel}
          className={cn(
            'w-full justify-start text-left font-mono font-normal',
            !selectedDate && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4" aria-hidden="true" />
          {selectedDate
            ? format(selectedDate, 'P', { locale: dateLocale })
            : ariaLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          locale={dateLocale}
          onSelect={(date) => {
            if (!date) return

            onValueChange(formatSaveDate(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
