/**
 * Download an image from a URL to the user's device.
 * Falls back to opening in a new tab if fetch fails.
 */
export async function downloadImage(url, filename = 'wedding-photo.jpg') {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Fetch failed')
    const blob    = await response.blob()
    const objUrl  = URL.createObjectURL(blob)
    const anchor  = document.createElement('a')
    anchor.href     = objUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(objUrl)
  } catch {
    // Fallback: open in new tab so user can long-press save on mobile
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}