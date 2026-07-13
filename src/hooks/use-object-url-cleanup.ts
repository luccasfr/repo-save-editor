import { useEffect } from 'react'

export function useObjectUrlCleanup(urls: string[]) {
  useEffect(() => {
    return () => {
      for (const url of urls) URL.revokeObjectURL(url)
    }
  }, [urls])
}
