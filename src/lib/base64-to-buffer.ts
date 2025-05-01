/**
 * Converts a base64-encoded data URL to a Buffer
 *
 * @param base64File - Base64-encoded data URL (format: "data:[<mediatype>][;base64],<data>")
 * @returns A buffer containing the decoded file data
 */
export default async function base64ToBuffer(base64File: string) {
  const base64Data = base64File.split(',')[1]
  const buffer = Buffer.from(base64Data, 'base64')
  return buffer
}
