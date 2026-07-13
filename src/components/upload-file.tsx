'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useObjectUrlCleanup } from '@/hooks/use-object-url-cleanup'
import { cn } from '@/lib/utils'
import { Copy, File, Grab, PackageOpen, Pointer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { DragEvent, JSX, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Heading } from './heading'

const statusIcons: Record<string, JSX.Element> = {
  over: <PackageOpen />,
  enter: <Grab />,
  leave: <Grab />,
  none: <Grab />,
  mouseEnter: <Pointer />
}

export type FileBase64 = {
  name: string
  base64: string
}

type UploadFileProps = {
  multiple?: boolean
  onFilesChange?: (files: FileBase64[]) => void
  errorMessage?: string | undefined
  imagePreview?: boolean
} & React.ComponentPropsWithoutRef<'button'>

type FileSelection = {
  files: File[]
  objectUrls: string[]
}

const emptySelection: FileSelection = {
  files: [],
  objectUrls: []
}

function readFileAsDataUrl(file: File): Promise<FileBase64> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve({
          name: file.name,
          base64: reader.result
        })
        return
      }

      reject(new TypeError('Expected FileReader result to be a data URL'))
    })
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })
}

export function UploadFile({
  multiple,
  onFilesChange,
  errorMessage,
  imagePreview = true,
  className,
  ...props
}: UploadFileProps) {
  const t = useTranslations('upload_file')
  const fileExtension = 'es3'
  const [dragStatus, setDragStatus] = useState<
    'over' | 'enter' | 'leave' | 'drop' | 'mouseEnter' | 'none'
  >('none')
  const [selection, setSelection] = useState<FileSelection>(emptySelection)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useObjectUrlCleanup(selection.objectUrls)

  const replaceSelection = useCallback((nextFiles: File[]) => {
    const objectUrls = nextFiles.map((file) =>
      file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    )

    setSelection({
      files: nextFiles,
      objectUrls
    })
  }, [])

  const acceptFiles = useCallback(
    async (incomingFiles: FileList) => {
      const nextFiles = [...incomingFiles]
      replaceSelection(nextFiles)

      if (nextFiles.length === 0) return

      const filesBase64 = await Promise.all(
        nextFiles.map((file) => readFileAsDataUrl(file))
      )
      onFilesChange?.(filesBase64)
    },
    [onFilesChange, replaceSelection]
  )

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragStatus('over')
  }

  const handleDragEnter = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragStatus('enter')
  }

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragStatus('leave')
  }

  const checkFileType = useCallback(
    (file: File) => {
      if (!fileExtension) return true
      const extension = file.name.split('.').pop()?.toLowerCase()
      return extension === fileExtension.toLowerCase()
    },
    [fileExtension]
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setDragStatus('drop')
      const droppedFiles = event.dataTransfer.files

      if (!multiple && droppedFiles.length > 1) {
        toast.error(t('error.select_one_file'))
        return
      }

      const invalidFiles = [...droppedFiles].filter(
        (file) => !checkFileType(file)
      )

      if (invalidFiles.length > 0) {
        toast.error(t('error.invalid_file_type'))
        return
      }

      void acceptFiles(droppedFiles)
    },
    [multiple, checkFileType, t, acceptFiles]
  )

  const handleMouseState = useCallback(
    (isEnter: boolean) => {
      if (selection.files.length > 0) return
      setDragStatus(isEnter ? 'mouseEnter' : 'none')
    },
    [selection.files.length]
  )

  const handleFileSelect = useCallback(() => {
    const input = fileInputRef.current
    if (!input) return

    input.value = ''
    input.click()
  }, [])

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files

      if (selectedFiles && selectedFiles.length > 0) {
        const invalidFiles = [...selectedFiles].filter(
          (file) => !checkFileType(file)
        )

        if (invalidFiles.length > 0) {
          toast.error(t('error.invalid_file_type'))
          return
        }

        void acceptFiles(selectedFiles)
      }
    },
    [checkFileType, t, acceptFiles]
  )

  const getStatusText = useCallback(
    (status: string) => {
      const statusMessages = {
        over: t('status.over'),
        enter: t('status.enter'),
        leave: t('status.leave'),
        none: t('status.none'),
        mouseEnter: t('status.mouseEnter')
      }

      return (
        statusMessages[status as keyof typeof statusMessages] ||
        t('status.none')
      )
    },
    [t]
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(
      String.raw`%USERPROFILE%\AppData\LocalLow\semiwork\Repo\saves`
    )
    toast.success(t('success.copy'))
  }, [t])

  return (
    <div className="space-y-2">
      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        multiple={multiple}
        accept={`.${fileExtension}`}
        onChange={handleFileInputChange}
        aria-label={t('title')}
      />
      <Heading title={t(`title`)} description={t(`description`)} />
      <div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            `flex h-auto min-h-32 w-full cursor-pointer items-center
            justify-center rounded`,
            'border-[1px] py-2 lg:min-h-48',
            errorMessage ? 'border-destructive' : 'border-border',
            className
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
          onMouseEnter={() => handleMouseState(true)}
          onMouseLeave={() => handleMouseState(false)}
          onClick={handleFileSelect}
          aria-label={t('title')}
          {...props}
        >
          {selection.files.length > 0 ? (
            <div
              className={cn(
                'gap-4 text-sm',
                selection.files.length < 5
                  ? 'flex justify-center'
                  : 'grid grid-cols-5'
              )}
            >
              {selection.files.map((file, index) => (
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  key={`${file.name}-${file.lastModified}-${file.size}`}
                >
                  {file.type.startsWith('image/') && imagePreview ? (
                    <Image
                      src={selection.objectUrls[index] || ''}
                      alt={file.name}
                      width={300}
                      height={300}
                      className="aspect-square object-contain"
                    />
                  ) : (
                    <File className="text-primary size-12" />
                  )}
                  <p className="max-w-32 truncate text-xs">{file.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-primary/60 pointer-events-none flex w-full
                items-center justify-center gap-2 px-4 text-sm"
            >
              {statusIcons[dragStatus]}
              <p>{getStatusText(dragStatus)}</p>
            </div>
          )}
        </Button>
      </div>
      {errorMessage && (
        <p className="text-destructive text-sm font-semibold">{errorMessage}</p>
      )}
      <div className="space-y-2 text-sm">
        <p>{t(`save_game.info`)}</p>
        <div
          className="border-input relative rounded border-[1px] py-2 pr-8 pl-3
            font-mono break-all"
        >
          <Button
            variant="outline"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            size="icon"
            onClick={handleCopy}
          >
            <Copy className="size-3" />
          </Button>
          <p>%USERPROFILE%\AppData\LocalLow\semiwork\Repo\saves</p>
        </div>
      </div>
    </div>
  )
}
