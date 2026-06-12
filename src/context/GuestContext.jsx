import { createContext, useContext, useState, useEffect } from 'react'
import { guestService } from '../services/api'

const GuestContext = createContext(null)

export function GuestProvider({ children }) {
  const [guest,   setGuest]   = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Rehydrate from localStorage on mount ── */
  useEffect(() => {
    const raw = localStorage.getItem('nm_guest')
    if (!raw) { setLoading(false); return }

    let parsed
    try { parsed = JSON.parse(raw) } catch { setLoading(false); return }

    /* Refresh upload_count from server so it's always accurate */
    guestService.getGuest(parsed.id)
      .then(({ data }) => {
        const fresh = { ...parsed, upload_count: data.upload_count }
        setGuest(fresh)
        localStorage.setItem('nm_guest', JSON.stringify(fresh))
      })
      .catch(() => setGuest(parsed))   /* use cached if offline */
      .finally(() => setLoading(false))
  }, [])

  /* ── Register new guest ── */
  const registerGuest = async (name, phone) => {
    const { data } = await guestService.createGuest({ name, phone })
    localStorage.setItem('nm_guest', JSON.stringify(data))
    setGuest(data)
    return data
  }

  /* ── Optimistic increment after upload ── */
  const incrementUpload = () => {
    if (!guest) return
    const updated = { ...guest, upload_count: guest.upload_count + 1 }
    setGuest(updated)
    localStorage.setItem('nm_guest', JSON.stringify(updated))
  }

  /* ── Sync from server ── */
  const refreshGuest = async () => {
    if (!guest) return
    try {
      const { data } = await guestService.getGuest(guest.id)
      const updated = { ...guest, upload_count: data.upload_count }
      setGuest(updated)
      localStorage.setItem('nm_guest', JSON.stringify(updated))
    } catch (err) {
      console.warn('refreshGuest failed:', err.message)
    }
  }

  return (
    <GuestContext.Provider value={{ guest, loading, registerGuest, incrementUpload, refreshGuest }}>
      {children}
    </GuestContext.Provider>
  )
}

export const useGuest = () => {
  const ctx = useContext(GuestContext)
  if (!ctx) throw new Error('useGuest must be inside <GuestProvider>')
  return ctx
}
