import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGuest } from '../../context/GuestContext'
import FlowerIcon from './FlowerIcon'

export default function WelcomeModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const { registerGuest } = useGuest()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter your name 🌸')
      return
    }

    setLoading(true)

    try {
      // ✅ FUNCTIONALITY UNCHANGED (only name now)
      await registerGuest(name.trim())

      toast.success(`Welcome, ${name.trim()}! 🌸`)

      setName('')
      onClose()
      navigate('/album')
    } catch (err) {
      toast.error(
        err?.response?.data?.error || 'Something went wrong. Try again.'
      )
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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          <motion.div
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '26px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '22px',
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)'
            }}
          >
            {/* 🌸 decorative flower */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                opacity: 0.5
              }}
            >
              <FlowerIcon size={60} />
            </div>

            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p
                style={{
                  fontFamily: 'Dancing Script',
                  fontSize: '2rem',
                  color: '#B8A99A',
                  margin: 0
                }}
              >
                Welcome to
              </p>

              <h2
                style={{
                  color: '#3D2E2E',
                  lineHeight: 1.4,
                  marginTop: '8px'
                }}
              >
                Nikki & Michael's <br /> Shared Album
              </h2>

              <p
                style={{
                  color: '#9A8A8A',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}
              >
                Tell us your name so we can keep track of your beautiful uploads.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={submit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#6B5757'
                  }}
                >
                  Your Name *
                </label>

                <input
                  type="text"
                  className="input-wedding"
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Entering...' : 'Enter Album ✿'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}