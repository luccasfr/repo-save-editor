'use server'

import { cookies as getCookies } from 'next/headers'

/**
 * Sets an HTTP cookie with secure defaults
 *
 * @param name - The name of the cookie to set
 * @param value - The value to store in the cookie
 */
export async function setCookie(name: string, value: string) {
  const cookies = await getCookies()
  cookies.set({
    name,
    value,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
}

/**
 * Deletes a cookie by name
 *
 * @param name - The name of the cookie to delete
 * @returns The result of the delete operation
 */
export async function deleteCookie(name: string) {
  const cookies = await getCookies()
  return cookies.delete(name)
}

/**
 * Retrieves a cookie by name
 *
 * @param name - The name of the cookie to retrieve
 * @returns The cookie object if found, otherwise undefined
 */
export async function getCookie(name: string) {
  const cookies = await getCookies()
  return cookies.get(name)
}
