"use server";

import crypto from "crypto";
import { promisify } from "node:util";
import zlib from "node:zlib";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Encrypts data using AES-128-CBC encryption with optional GZIP compression
 *
 * @param data - The buffer containing data to be encrypted
 * @param password - The password used for encryption key derivation
 * @param shouldGzip - Whether to compress the data using GZIP before encryption (default: false)
 * @returns A buffer containing the IV followed by the encrypted data
 */
async function encryptEs3(
  data: Buffer,
  password: string,
  shouldGzip: boolean = false
): Promise<Buffer> {
  if (shouldGzip) {
    data = await gzip(data);
  }
  const iv = crypto.randomBytes(16);

  const key = crypto.pbkdf2Sync(password, iv, 100, 16, "sha1");
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
  return Buffer.concat([iv, encryptedData]);
}

/**
 * Encrypts a string using AES-128-CBC encryption and converts it to a base64 data URI
 *
 * @param data - The string to be encrypted
 * @param password - The password used for encryption key derivation
 * @param shouldGzip - Whether to compress the data using GZIP before encryption (default: false)
 * @returns A base64 data URI containing the encrypted data
 */
export async function encryptEs3Base64(
  data: string,
  password: string,
  shouldGzip: boolean = false
): Promise<string> {
  const bufferData = Buffer.from(data, "utf8");
  const encryptedBuffer = await encryptEs3(bufferData, password, shouldGzip);
  return `data:application/octet-stream;base64,${encryptedBuffer.toString("base64")}`;
}

/**
 * Decrypts AES-128-CBC encrypted data from a base64 data URI and converts to string
 *
 * @param base64Data - Base64 data URI string containing the encrypted data
 * @param password - The password used for decryption key derivation
 * @param encoding - The encoding to use for the string conversion (default: 'utf8')
 * @returns A string containing the decrypted data
 */
export async function decryptEs3(
  base64Data: string,
  password: string,
  encoding: BufferEncoding = "utf8"
): Promise<string> {
  // Extract the base64 part from the data URI if it includes the prefix
  const base64Content = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;

  const encryptedData = Buffer.from(base64Content, "base64");

  const iv = encryptedData.subarray(0, 16);
  const cipherText = encryptedData.subarray(16);

  const key = crypto.pbkdf2Sync(password, iv, 100, 16, "sha1");
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

  const decryptedData = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);

  if (decryptedData.subarray(0, 2).equals(Buffer.from([0x1f, 0x8b]))) {
    const unzippedData = await gunzip(decryptedData);
    return unzippedData.toString(encoding);
  }

  return decryptedData.toString(encoding);
}