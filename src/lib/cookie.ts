'use server'

import { cookies as getCookies } from 'next/headers'

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

export async function deleteCookie(name: string) {
  const cookies = await getCookies()
  return cookies.delete(name)
}

export async function getCookie(name: string) {
  const cookies = await getCookies()
  return cookies.get(name)
}