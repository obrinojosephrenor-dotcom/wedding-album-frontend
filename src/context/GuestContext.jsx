import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'

const GuestContext = createContext()

export const GuestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const registerGuest = async (name) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new Error('Name is required')
    }

    setLoading(true)

    try {
      // 1. Check if guest already exists (safe version)
      const { data: existing, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('name', trimmedName)
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existing) {
        return existing
      }

      // 2. Insert new guest
      const { data, error } = await supabase
        .from('guests')
        .insert([
          {
            name: trimmedName,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle()

      // 3. Handle duplicate insert (race condition safety)
      if (error) {
        // Postgres unique violation
        if (error.code === '23505') {
          const { data: fallback } = await supabase
            .from('guests')
            .select('*')
            .eq('name', trimmedName)
            .maybeSingle()

          return fallback
        }

        throw error
      }

      return data
    } catch (err) {
      console.error('registerGuest error:', err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestContext.Provider value={{ registerGuest, loading }}>
      {children}
    </GuestContext.Provider>
  )
}

export const useGuest = () => useContext(GuestContext)