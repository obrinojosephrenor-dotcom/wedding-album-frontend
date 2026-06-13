import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGuest } from '../context/GuestContext'
import WelcomeModal from '../components/ui/WelcomeModal'
import FlowerIcon from '../components/ui/FlowerIcon'

const fade = (delay) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay }
})

const slide = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay }
})

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  const { guest, registerGuest } = useGuest()
  const navigate = useNavigate()

  const enter = () => {
    if (guest) {
      navigate('/album')
    } else {
      setShowModal(true)
    }
  }

  const handleSubmit = async (name) => {
    try {
      await registerGuest(name)

      setShowModal(false)

      navigate('/album')
    } catch (err) {
      console.error('Guest registration failed:', err)
    }
  }

  return (
    <div
      className="paper-texture"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorations (unchanged) */}
      <div style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-28%,-28%)', opacity: 0.38 }}>
        <FlowerIcon size={230} color="#F8D7DA" />
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem 1.5rem' }}>
        
        <motion.h1 {...slide(0.2)}>
          Nikki & Michael
        </motion.h1>

        <motion.p {...fade(0.4)}>
          Shared Wedding Album
        </motion.p>

        <motion.div {...slide(0.6)}>
          <button onClick={enter} className="btn-primary">
            ✿ Enter Album
          </button>
        </motion.div>
      </div>

      {/* ✅ FIXED WELCOME MODAL CONNECTION */}
      <WelcomeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}