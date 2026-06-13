/**
 * Low-level hook for reading/writing the guest record in localStorage.
 * Prefer useGuest() (from GuestContext) in most components.
 */
export function useLocalGuest() {
  const KEY = 'nm_guest'

  const get = () => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const set = (guest) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(guest))
    } catch (e) {
      console.warn('localStorage write failed:', e)
    }
  }

  const clear = () => localStorage.removeItem(KEY)

  return { get, set, clear }
}