import { headers } from 'next/headers'

type ServerActionSession = {
  sameOrigin: true
}

export async function auth(): Promise<ServerActionSession | null> {
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')

  if (!origin || !host) return null

  try {
    if (new URL(origin).host !== host) return null
  } catch {
    return null
  }

  return { sameOrigin: true }
}

export async function assertServerActionAuthorized() {
  const session = await auth()

  if (!session?.sameOrigin) {
    throw new Error('Unauthorized')
  }
}
