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

  const { guest } = useGuest()
  const navigate = useNavigate()

  const enter = () => {
    if (guest) navigate('/album')
    else setShowModal(true)
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

      {/* 🌸 Corner flowers */}
      <div style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-28%,-28%)', opacity: 0.38, pointerEvents: 'none' }}>
        <FlowerIcon size={230} color="#F8D7DA" />
      </div>

      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(28%,-28%)', opacity: 0.28, pointerEvents: 'none' }}>
        <FlowerIcon size={190} color="#A8B5A2" />
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'translate(-22%,28%)', opacity: 0.22, pointerEvents: 'none' }}>
        <FlowerIcon size={170} color="#A7BFD7" />
      </div>

      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'translate(22%,28%)', opacity: 0.32, pointerEvents: 'none' }}>
        <FlowerIcon size={210} color="#F8E7A1" />
      </div>

      {/* 🌿 Watercolor background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 15% 32%, rgba(248,215,218,0.34) 0%, transparent 46%),
            radial-gradient(ellipse at 86% 68%, rgba(167,191,215,0.24) 0%, transparent 46%),
            radial-gradient(ellipse at 52% 88%, rgba(168,181,162,0.18) 0%, transparent 40%)
          `
        }}
      />

      {/* 💌 CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '2rem 1.5rem',
          maxWidth: '680px',
          width: '100%'
        }}
      >

        {/* Top flower */}
        <motion.div {...fade(0.1)} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <FlowerIcon size={60} color="#F0B8BF" className="animate-float" />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          {...fade(0.2)}
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8A99A',
            marginBottom: '0.75rem'
          }}
        >
          Wedding Day Memories
        </motion.p>

        {/* Names */}
        <motion.h1 {...slide(0.32)} style={{ margin: 0 }}>
          <span
            style={{
              display: 'block',
              fontFamily: '"Grace Taylor", cursive',
              fontSize: 'clamp(4rem, 12vw, 6.5rem)',
              color: '#3D2E2E',
              lineHeight: 1.05,
              textShadow: '0 2px 14px rgba(240,184,191,0.28)'
            }}
          >
            Nikki
          </span>

          <span
            style={{
              display: 'block',
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#B8A99A',
              margin: '0.35rem 0'
            }}
          >
            &amp;
          </span>

          <span
            style={{
              display: 'block',
              fontFamily: '"Dancing Script", cursive',
              fontSize: 'clamp(4rem, 12vw, 6.5rem)',
              color: '#3D2E2E',
              lineHeight: 1.05,
              textShadow: '0 2px 14px rgba(167,191,215,0.28)'
            }}
          >
            Michael
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div {...fade(0.48)} style={{ marginTop: '1.25rem' }}>
          <div className="divider-floral" style={{ maxWidth: '340px', margin: '0 auto' }}>
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                fontSize: '1.15rem',
                color: '#6B5757'
              }}
            >
              Shared Wedding Album
            </span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          {...fade(0.6)}
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.95rem',
            color: '#6B5757',
            lineHeight: 1.7,
            margin: '1.5rem 0 2.25rem'
          }}
        >
          Help us capture every beautiful moment.<br />
          Upload your favorite photos and memories.
        </motion.p>

        {/* CTA */}
        <motion.div {...slide(0.72)}>
          <button onClick={enter} className="btn-primary" style={{ fontSize: '0.95rem', padding: '1rem 2.5rem' }}>
            ✿ Enter Album
          </button>
        </motion.div>

        {/* Footnote */}
        <motion.p
          {...fade(0.88)}
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.75rem',
            color: '#9A8A8A',
            marginTop: '1.5rem'
          }}
        >
          Each guest may upload up to 25 photos
        </motion.p>
      </div>

      {/* 🌼 side accents */}
      <div style={{ position: 'absolute', left: '2%', top: '38%', opacity: 0.18, pointerEvents: 'none' }}>
        <FlowerIcon size={46} color="#F8E7A1" />
      </div>

      <div style={{ position: 'absolute', right: '3%', top: '58%', opacity: 0.14, pointerEvents: 'none' }}>
        <FlowerIcon size={38} color="#A8B5A2" />
      </div>

      {/* MODAL (unchanged logic) */}
      <WelcomeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}