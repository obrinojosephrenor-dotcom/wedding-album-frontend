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
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* 🌸 Background glow layers */}
    <div
      style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        opacity: 0.35,
        filter: 'blur(1px)'
      }}
    >
      <FlowerIcon size={280} color="#F8D7DA" />
    </div>

    <div
      style={{
        position: 'absolute',
        bottom: '-140px',
        right: '-140px',
        opacity: 0.25,
        transform: 'rotate(25deg)'
      }}
    >
      <FlowerIcon size={320} color="#D6E6F2" />
    </div>

    {/* ✨ soft floating glow */}
    <div
      style={{
        position: 'absolute',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(255,192,203,0.25), transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 6s infinite',
      }}
    />

    {/* 💌 HERO CARD */}
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '3rem 2.5rem',
        borderRadius: '28px',
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        maxWidth: '520px',
        width: '90%'
      }}
    >
      {/* Title */}
      <motion.h1 {...slide(0.2)} style={{ fontSize: '2.6rem', marginBottom: '0.5rem' }}>
        Nikki & Michael
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        {...fade(0.4)}
        style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '1.8rem'
        }}
      >
        A Shared Wedding Memory Album ✨
      </motion.p>

      {/* Decorative line */}
      <motion.div
        {...fade(0.5)}
        style={{
          width: '60px',
          height: '2px',
          background: 'linear-gradient(to right, #f8c8dc, #d6e6f2)',
          margin: '0 auto 1.8rem auto',
          borderRadius: '999px'
        }}
      />

      {/* CTA Button */}
      <motion.div {...slide(0.6)}>
        <button
          onClick={enter}
          className="btn-primary"
          style={{
            padding: '12px 26px',
            borderRadius: '999px',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #f8b4c0, #fbcfe8)',
            boxShadow: '0 10px 25px rgba(255, 182, 193, 0.35)',
            transition: 'transform 0.2s ease'
          }}
        >
          ✿ Enter Album
        </button>
      </motion.div>
    </motion.div>

    {/* modal stays unchanged */}
    <WelcomeModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleSubmit}
    />
  </div>
)
}