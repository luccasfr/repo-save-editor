import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (globalThis.window === undefined) return () => {}

  const mediaQuery = globalThis.window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener('change', onStoreChange)

  return () => mediaQuery.removeEventListener('change', onStoreChange)
}

function getReducedMotionSnapshot() {
  return globalThis.window?.matchMedia(REDUCED_MOTION_QUERY).matches ?? false
}

function getServerReducedMotionSnapshot() {
  return false
}

/**
 * Reads the OS motion preference without changing the first hydrated render.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )
}
