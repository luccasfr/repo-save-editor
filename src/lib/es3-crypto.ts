'use server'

import crypto from 'node:crypto'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { assertServerActionAuthorized } from './server-action-auth'

const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)
const pbkdf2 = promisify(crypto.pbkdf2)
const MAX_SAVE_BYTES = 5 * 1024 * 1024
const MAX_ENCRYPTED_BYTES = MAX_SAVE_BYTES + 32
const MAX_BASE64_LENGTH = Math.ceil(MAX_ENCRYPTED_BYTES / 3) * 4
const BASE64_PATTERN = /^[A-Za-z\d+/]*={0,2}$/

async function deriveKey(password: string, iv: Buffer): Promise<Buffer> {
  return pbkdf2(password, iv, 100, 16, 'sha1')
}

function decodeEncryptedData(base64Data: string): Buffer {
  if (typeof base64Data !== 'string') {
    throw new TypeError('Encrypted save data must be a string')
  }

  const separatorIndex = base64Data.indexOf('base64,')
  const base64Content =
    separatorIndex === -1
      ? base64Data
      : base64Data.slice(separatorIndex + 'base64,'.length)

  if (
    base64Content.length === 0 ||
    base64Content.length > MAX_BASE64_LENGTH ||
    base64Content.length % 4 !== 0 ||
    !BASE64_PATTERN.test(base64Content)
  ) {
    throw new TypeError('Invalid or oversized save data')
  }

  const encryptedData = Buffer.from(base64Content, 'base64')
  if (
    encryptedData.length < 32 ||
    encryptedData.length > MAX_ENCRYPTED_BYTES ||
    (encryptedData.length - 16) % 16 !== 0
  ) {
    throw new TypeError('Invalid or oversized encrypted save data')
  }

  return encryptedData
}

async function encryptBuffer(
  data: Buffer,
  password: string,
  shouldGzip: boolean = false
): Promise<Buffer> {
  if (shouldGzip) {
    data = await gzip(data)
  }
  const iv = crypto.randomBytes(16)

  const key = await deriveKey(password, iv)
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()])
  return Buffer.concat([iv, encryptedData])
}

/**
 * Encrypts a string using AES-128-CBC encryption with optional GZIP compression
 *
 * @param data - The string to be encrypted
 * @param shouldGzip - Whether to compress the data (default: false)
 * @returns Uint8Array suitable for creating a binary file
 */
export async function encryptEs3(
  data: string,
  shouldGzip: boolean = false
): Promise<Uint8Array> {
  await assertServerActionAuthorized()
  if (typeof data !== 'string' || Buffer.byteLength(data) > MAX_SAVE_BYTES) {
    throw new TypeError('Invalid or oversized save data')
  }

  const bufferData = Buffer.from(data, 'utf8')
  const encryptedBuffer = await encryptBuffer(
    bufferData,
    ENCRYPTION_KEY,
    shouldGzip
  )
  return encryptedBuffer
}

/**
 * Decrypts AES-128-CBC encrypted data from a base64 data URI and converts to string
 *
 * @param base64Data - Base64 data URI string containing the encrypted data
 * @returns A string containing the decrypted data
 */
export async function decryptEs3(
  base64Data: string
): Promise<string> {
  await assertServerActionAuthorized()
  const encryptedData = decodeEncryptedData(base64Data)

  const iv = encryptedData.subarray(0, 16)
  const cipherText = encryptedData.subarray(16)

  const key = await deriveKey(ENCRYPTION_KEY, iv)
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)

  const decryptedData = Buffer.concat([
    decipher.update(cipherText),
    decipher.final()
  ])

  if (decryptedData.subarray(0, 2).equals(Buffer.from([31, 139]))) {
    const unzippedData = await gunzip(decryptedData, {
      maxOutputLength: MAX_SAVE_BYTES
    })
    return unzippedData.toString('utf8')
  }

  if (decryptedData.length > MAX_SAVE_BYTES) {
    throw new TypeError('Decrypted save data is too large')
  }

  return decryptedData.toString('utf8')
}
