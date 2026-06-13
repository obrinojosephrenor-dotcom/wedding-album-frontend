const ALLOWED_MIME  = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' }

  if (!ALLOWED_MIME.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WEBP images are allowed.' }
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'File size must be under 10MB.' }
  }

  return { valid: true, error: null }
}

export function formatFileSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}