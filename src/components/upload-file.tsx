'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Copy, File, Grab, PackageOpen, Pointer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { DragEvent, JSX, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Heading from './heading'

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
  fileList?: FileList | null
} & React.HTMLProps<HTMLDivElement>

export default function UploadFile({
  multiple,
  onFilesChange,
  errorMessage,
  imagePreview = true,
  fileList,
  className,
  ...props
}: UploadFileProps) {
  const t = useTranslations('upload_file')
  const fileExtension = 'es3'
  const [dragStatus, setDragStatus] = useState<
    'over' | 'enter' | 'leave' | 'drop' | 'mouseEnter' | 'none'
  >('none')
  const [files, setFiles] = useState<FileList | null>(null)
  const [filesBase64, setFilesBase64] = useState<FileBase64[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onFilesChangeRef = useRef(onFilesChange)
  const [objectUrls, setObjectUrls] = useState<string[]>([])

  useEffect(() => {
    return () => {
      for (const url of objectUrls) URL.revokeObjectURL(url)
    }
  }, [objectUrls])

  useEffect(() => {
    if (fileList && !files) {
      setFiles(fileList)
    }
  }, [fileList, files])

  useEffect(() => {
    onFilesChangeRef.current = onFilesChange
  }, [onFilesChange])

  useEffect(() => {
    if (!files) {
      setFilesBase64([])
      return
    }

    const newUrls: string[] = []
    const fileList = [...files]

    setFilesBase64([])

    for (const file of fileList) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        newUrls.push(url)
      }

      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        const base64 = event.target?.result
        if (typeof base64 === 'string') {
          setFilesBase64((prev) => [
            ...prev,
            {
              name: file.name,
              base64
            }
          ])
        }
      })
      reader.readAsDataURL(file)
    }

    setObjectUrls((prevUrls) => {
      for (const url of prevUrls) URL.revokeObjectURL(url)
      return newUrls
    })
  }, [files])

  useEffect(() => {
    if (filesBase64.length > 0) {
      onFilesChangeRef.current?.(filesBase64)
    }
  }, [filesBase64])

  const handleDragEvent = useCallback(
    (event: DragEvent<HTMLDivElement>, status: 'over' | 'enter' | 'leave') => {
      event.preventDefault()
      setDragStatus(status)
      if (status === 'over') setFiles(null)
    },
    []
  )

  const checkFileType = useCallback(
    (file: File) => {
      if (!fileExtension) return true
      const extension = file.name.split('.').pop()?.toLowerCase()
      return extension === fileExtension.toLowerCase()
    },
    [fileExtension]
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
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

      setFiles(droppedFiles)
    },
    [multiple, checkFileType, t]
  )

  const handleMouseState = useCallback(
    (isEnter: boolean) => {
      if (files) return
      setDragStatus(isEnter ? 'mouseEnter' : 'none')
    },
    [files]
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

        setFiles(selectedFiles)
      }
    },
    [checkFileType, t]
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
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        multiple={multiple}
        accept={`.${fileExtension}`}
        onChange={handleFileInputChange}
      />
      <Heading title={t(`title`)} description={t(`description`)} />
      <div>
        <div
          className={cn(
            'flex min-h-32 w-full cursor-pointer items-center justify-center rounded',
            'border-[1px] py-2 lg:min-h-48',
            errorMessage ? 'border-destructive' : 'border-border',
            className
          )}
          onDragOver={(e) => handleDragEvent(e, 'over')}
          onDragEnter={(e) => handleDragEvent(e, 'enter')}
          onDragLeave={(e) => handleDragEvent(e, 'leave')}
          onDrop={onDrop}
          onMouseEnter={() => handleMouseState(true)}
          onMouseLeave={() => handleMouseState(false)}
          onClick={handleFileSelect}
          {...props}
        >
          {files ? (
            <div
              className={cn(
                'gap-4 text-sm',
                files.length < 5 ? 'flex justify-center' : 'grid grid-cols-5'
              )}
            >
              {[...files].map((file, index) => (
                <div
                  className="flex flex-col items-center justify-center gap-1"
                  key={index}
                >
                  {file.type.startsWith('image/') && imagePreview ? (
                    <Image
                      src={objectUrls[index] || ''}
                      alt={file.name}
                      width={300}
                      height={300}
                      className="aspect-square object-contain"
                    />
                  ) : (
                    <File className="text-primary h-12 w-12" />
                  )}
                  <p className="max-w-32 truncate text-xs">{file.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-primary/60 pointer-events-none flex w-full items-center justify-center
                gap-2 px-4 text-sm"
            >
              {statusIcons[dragStatus]}
              <p>{getStatusText(dragStatus)}</p>
            </div>
          )}
        </div>
      </div>
      {errorMessage && (
        <p className="text-destructive text-sm font-semibold">{errorMessage}</p>
      )}
      <div className="space-y-2 text-sm">
        <p>{t(`save_game.info`)}</p>
        <div className="border-input relative rounded border-[1px] py-2 pr-8 pl-3 font-mono break-all">
          <Button
            variant="outline"
            className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2"
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
