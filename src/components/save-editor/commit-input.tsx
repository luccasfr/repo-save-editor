import { Input } from '@/components/ui/input'
import { ComponentPropsWithoutRef, useState } from 'react'

type CommitInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  'defaultValue' | 'onBlur' | 'onChange' | 'value'
> & {
  value: string | number
  onCommit: (value: string) => boolean | void
}

/**
 * Keeps an in-progress value local and only updates the save on blur or Enter.
 * Callers should key the component by its persisted value so reset/load actions
 * remount it with the latest save data without synchronizing through an effect.
 */
export function CommitInput({
  value,
  onCommit,
  onKeyDown,
  ...props
}: CommitInputProps) {
  const persistedValue = String(value)
  const [draftValue, setDraftValue] = useState(persistedValue)

  const commitDraft = () => {
    if (draftValue === persistedValue) return

    const accepted = onCommit(draftValue)
    if (accepted === false) setDraftValue(persistedValue)
  }

  return (
    <Input
      {...props}
      value={draftValue}
      onChange={(event) => setDraftValue(event.currentTarget.value)}
      onBlur={commitDraft}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented) return
        if (event.key === 'Enter') event.currentTarget.blur()
        if (event.key === 'Escape') setDraftValue(persistedValue)
      }}
    />
  )
}
