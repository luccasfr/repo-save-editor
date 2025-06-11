import { Crown } from 'lucide-react'
import Image from 'next/image'

type PlayerAvatarProps = {
  name: string
  url?: string
  hasCrown?: boolean
}

export default function PlayerAvatar({
  name,
  url,
  hasCrown = false
}: PlayerAvatarProps) {
  return (
    <div className="relative flex h-6 items-baseline gap-2">
      {hasCrown ? (
        <div className="absolute -top-4 left-1">
          <Crown className="size-3.5 text-yellow-500" />
        </div>
      ) : null}
      {url && (
        <Image src={url} alt="avatar" className="" width={24} height={24} />
      )}
      <p>{name}</p>
    </div>
  )
}
