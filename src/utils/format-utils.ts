/**
 * Format seconds into a human-readable time string (e.g., "1h 30m 45s")
 */
export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return `${hours}h ${minutes}m ${secs}s`
}
