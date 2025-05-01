'use client'
import { Copy, File, Grab, PackageOpen, Pointer } from 'lucide-react'
import Image from 'next/image'
import { DragEvent, JSX, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'

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
  const [filesBase64, setFilesBase64] = useState<FileBase64[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filesBase64Ref = useRef<FileBase64[] | null>(null)
  const onFilesChangeRef = useRef(onFilesChange)

  useEffect(() => {
    if (fileList) {
      setFiles((prev) => {
        if (prev) return prev
        return fileList
      })
    }
  }, [fileList])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragStatus('over')
    setFiles(null)
  }, [])

  const onDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragStatus('enter')
  }, [])

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragStatus('leave')
  }, [])

  const checkFileType = useCallback(
    (file: File) => {
      if (!fileExtension) return true
      const extension = file.name.split('.').pop()
      if (extension !== fileExtension) {
        toast.error(t('error.invalid_file_type'))
        return false
      }
      return true
    },
    [fileExtension, t]
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragStatus('drop')
      const files = event.dataTransfer.files
      if (!multiple && files.length > 1) {
        toast.error(t('error.select_one_file'))
        return
      }
      const invalidFiles = Array.from(files).filter(
        (file) => !checkFileType(file)
      )
      if (invalidFiles.length > 0) {
        toast.error(t('error.invalid_file_type'))
        return
      }
      setFiles(files)
    },
    [multiple, checkFileType, t]
  )

  const onMouseEnter = useCallback(() => {
    if (files) return
    setDragStatus('mouseEnter')
  }, [files])

  const onMouseLeave = useCallback(() => {
    if (files) return
    setDragStatus('none')
  }, [files])

  const handleFileSelect = () => {
    const input = fileInputRef.current
    if (!input) return
    input.click()
    input.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files
      setFiles(files)
    })
  }

  useEffect(() => {
    onFilesChangeRef.current = onFilesChange
  }, [onFilesChange])

  useEffect(() => {
    setFilesBase64(null)
    if (files) {
      const fileList = Array.from(files)
      fileList.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result
          if (typeof base64 === 'string') {
            setFilesBase64((prev) => [
              ...(prev || []),
              {
                name: file.name,
                base64: base64 as string
              }
            ])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }, [files])

  const getFileType = useCallback(() => {
    return `.${fileExtension}`
  }, [fileExtension])

  useEffect(() => {
    if (filesBase64) {
      filesBase64Ref.current = filesBase64
      onFilesChangeRef.current?.(filesBase64)
    }
  }, [filesBase64])

  const getStatusText = useCallback(
    (status: string) => {
      switch (status) {
        case 'over':
          return t('status.over')
        case 'enter':
          return t('status.enter')
        case 'leave':
          return t('status.leave')
        case 'none':
          return t('status.none')
        case 'mouseEnter':
          return t('status.mouseEnter')
        default:
          return t('status.none')
      }
    },
    [t]
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(
      'C:\\Users\\%USERNAME%\\AppData\\LocalLow\\semiwork\\Repo\\saves'
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
        accept={getFileType()}
      />
      <p className={`font-semibold ${errorMessage && 'text-destructive'}`}>
        {t('title')}
      </p>
      <div>
        <div
          className={cn(
            `cusor-default flex min-h-32 w-full items-center justify-center rounded
            border-[1px] py-2 lg:min-h-48 ${
            errorMessage ? 'border-destructive' : 'border-border' }`,
            className
          )}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={handleFileSelect}
          {...props}
        >
          {files ? (
            <div
              className={`${files.length < 5 ? 'flex justify-center' : 'grid grid-cols-5'} gap-4 text-sm`}
            >
              {Array.from(files).map((file, index) => (
                <div
                  className="flex items-center justify-center gap-1"
                  key={index}
                >
                  {file.type.split('/')[0] === 'image' && imagePreview ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={300}
                      height={300}
                      className="aspect-square object-contain"
                    />
                  ) : (
                    <File />
                  )}
                  <p className="text-xs">{file.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-primary/60 pointer-events-none flex w-full items-center justify-center
                gap-2 px-4 text-sm`}
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
          <p>
            <span className="font-bold text-yellow-600">C:</span>
            \Users\%USERNAME%\AppData\LocalLow\semiwork\Repo\saves
          </p>
        </div>
        <p>
          <span className="font-bold text-yellow-600">
            {t(`save_game.warning`)}
          </span>{' '}
          {t(`save_game.check_drive_letter`)}{' '}
          <span className="font-bold text-yellow-600">C</span>.
        </p>
      </div>
    </div>
  )
}
