import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single className string
 * Merges Tailwind CSS classes without conflicts
 *
 * @param inputs - Array of class values to be combined
 * @returns Merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
