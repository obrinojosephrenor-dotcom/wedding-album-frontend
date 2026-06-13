export const MAX_UPLOADS     = 25
export const MAX_FILE_SIZE   = 10 * 1024 * 1024  // 10MB in bytes
export const ALLOWED_TYPES   = ['image/jpeg', 'image/png', 'image/webp']
export const API_URL         = import.meta.env.VITE_API_URL || 'https://my-wedding-album-backend.onrender.com'
export const ADMIN_PASSWORD  = import.meta.env.VITE_ADMIN_PASSWORD || 'NikkiMichael2024!'
export const LOCAL_STORAGE_KEY = 'nm_guest'

export const COLORS = {
  blush:      '#F8D7DA',
  blushDeep:  '#F0B8BF',
  sage:       '#A8B5A2',
  sageDeep:   '#7A9472',
  butter:     '#F8E7A1',
  taupe:      '#B8A99A',
  dustyBlue:  '#A7BFD7',
  silver:     '#D9D9D9',
  offWhite:   '#FDFAF8',
  warmWhite:  '#FFF9F5',
  textDark:   '#3D2E2E',
  textMid:    '#6B5757',
  textLight:  '#9A8A8A',
}