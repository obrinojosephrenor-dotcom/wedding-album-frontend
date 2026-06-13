import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'

const GuestContext = createContext()

export const GuestProvider = ({ children }) => {
  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(false)

  const registerGuest = async (name) => {
    const trimmedName = name.trim()

    if (!trimmedName) throw new Error('Name is required')

    setLoading(true)

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('name', trimmedName)
        .maybeSingle()

      if (fetchError) throw fetchError

      let finalGuest = existing

      if (!existing) {
        const { data, error } = await supabase
          .from('guests')
          .insert([
            {
              name: trimmedName,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) throw error
        finalGuest = data
      }

      // 🔥 THIS IS THE IMPORTANT PART
      setGuest(finalGuest)

      // optional: persist session
      localStorage.setItem('guest', JSON.stringify(finalGuest))

      return finalGuest
    } finally {
      setLoading(false)
    }
  }

  const logoutGuest = () => {
    setGuest(null)
    localStorage.removeItem('guest')
  }

  return (
    <GuestContext.Provider
      value={{
        guest,
        setGuest,
        registerGuest,
        logoutGuest,
        loading,
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

export const useGuest = () => useContext(GuestContext)