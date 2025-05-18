/**
 * Downloads a file to the user's device through the browser.
 * 
 * Creates a temporary anchor element to trigger the browser's file download functionality.
 * The blob data is converted to an object URL which is then used for the download.
 * 
 * @param {Blob} data - The blob data to be downloaded as a file
 * @param {string} filename - The name that will be given to the downloaded file
 * @throws {TypeError} When called outside of a browser environment
 * 
 * @example
 * // Download a text file
 * const blob = new Blob(["Hello, world!"], {type: "text/plain"});
 * downloadFile(blob, "hello.txt");
 */
export default function downloadFile(data: Blob, filename: string) {
  if (globalThis.window === undefined) {
    throw new TypeError('This function can only be used in the browser')
  }

  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
