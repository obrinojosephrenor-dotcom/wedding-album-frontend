import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGuest } from '../../context/GuestContext'
import FlowerIcon from './FlowerIcon'

export default function WelcomeModal({ isOpen, onClose }) {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const { registerGuest } = useGuest()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Please enter your name 🌸'); return }
    setLoading(true)
    try {
      await registerGuest(name.trim(), phone.trim())
      toast.success(`Welcome, ${name.trim()}! 🌸`)
      onClose()
      navigate('/album')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
              className="card w-full max-w-md relative"
              style={{
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '1.5rem',
                margin: '1rem'
              }}
          >
            {/* Corner flowers */}
            <div className="absolute -top-7 -right-7 opacity-60 pointer-events-none">
              <FlowerIcon size={64} color="#F8D7DA" />
            </div>
            <div className="absolute -bottom-5 -left-5 opacity-40 pointer-events-none">
              <FlowerIcon size={44} color="#A8B5A2" />
            </div>

            {/* Header */}
            <div className="text-center mb-7">
              <p style={{ fontFamily: '"Dancing Script", cursive', fontSize: '2rem', color: '#B8A99A', marginBottom: '0.25rem' }}>
                Welcome to
              </p>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.45rem', color: '#3D2E2E', lineHeight: 1.3, margin: 0 }}>
                Nikki &amp; Michael's<br />Shared Album
              </h2>

              <div className="divider-floral mt-4 mb-4">
                <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.3rem' }}>✿</span>
              </div>

              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', lineHeight: 1.6 }}>
                Tell us who you are so we can keep track<br />of your beautiful uploads.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#6B5757', marginBottom: '0.4rem', marginLeft: '0.25rem' }}>
                  Your Name <span style={{ color: '#F0B8BF' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-wedding"
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', color: '#6B5757', marginBottom: '0.4rem', marginLeft: '0.25rem' }}>
                  Mobile Number <span style={{ color: '#9A8A8A', fontWeight: 300 }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  className="input-wedding"
                  placeholder="+63 912 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={24}
                />
              </div>

              <div className="pt-1">
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path  className="opacity-75"  fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Entering…
                    </span>
                  ) : 'Enter Album ✿'}
                </button>
              </div>
            </form>

            <p style={{ textAlign: 'center', fontFamily: 'Lato, sans-serif', fontSize: '0.75rem', color: '#9A8A8A', marginTop: '1.25rem', lineHeight: 1.6 }}>
              Your info is only used to track your uploads.<br />We'll never share it. 🌸
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
