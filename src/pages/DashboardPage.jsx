import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGuest } from '../context/GuestContext'
import UploadCounter from '../components/ui/UploadCounter'
import PhotoUpload from '../components/upload/PhotoUpload'
import Gallery from '../components/gallery/Gallery'
import FlowerIcon from '../components/ui/FlowerIcon'
import WelcomeModal from '../components/ui/WelcomeModal'

export default function DashboardPage() {
  const { guest, loading } = useGuest()

  const [showModal, setShowModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!loading && !guest) setShowModal(true)
  }, [guest, loading])

  const firstName = guest?.name?.split(' ')[0] || 'Friend'

  return (
    <div
      className="paper-texture"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff7fb, #f4fbff, #fffdf5)',
        position: 'relative'
      }}
    >

      {/* 🌸 soft background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 10% 20%, rgba(255,182,193,0.25), transparent 45%),
            radial-gradient(circle at 90% 30%, rgba(173,216,230,0.22), transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(255,228,181,0.22), transparent 55%)
          `,
          pointerEvents: 'none'
        }}
      />

      {/* ───── HEADER ───── */}
      <header style={{ textAlign: 'center', padding: '4rem 1rem 2rem', position: 'relative' }}>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#C98C95'
          }}
        >
          Shared Wedding Album
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "Grace Taylor",
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            color: '#3D2E2E',
            margin: '0.5rem 0'
          }}
        >
          Nikki &amp; Michael
        </motion.h1>

        <div
          style={{
            width: '140px',
            height: '2px',
            margin: '0 auto',
            background: 'linear-gradient(90deg, transparent, #FFB6C1, #B5D8EB, transparent)',
            borderRadius: '999px'
          }}
        />
      </header>

      {/* ───── MAIN ───── */}
      <main
        style={{
          maxWidth: '1050px',
          margin: '0 auto',
          padding: '0 1rem 5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.8rem'
        }}
      >

        {/* 🌸 WELCOME + COUNTER GRID */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.2rem'
            }}
          >

            {/* Welcome Card */}
            <div
              style={{
                padding: '1.8rem',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 12px 35px rgba(255,182,193,0.15)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C98C95'
              }}>
                Welcome back
              </p>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.6rem',
                color: '#3D2E2E',
                marginTop: '0.3rem'
              }}>
                Hello, {firstName} 🌸
              </h2>

              <p style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.95rem',
                color: '#6B5757',
                lineHeight: 1.6,
                marginTop: '0.5rem'
              }}>
                Share your favorite memories from Nikki & Michael’s special day.
              </p>
            </div>

            <UploadCounter count={guest.upload_count} />
          </motion.div>
        )}

        {/* ───── UPLOAD SECTION ───── */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '2rem',
              borderRadius: '26px',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 15px 40px rgba(173,216,230,0.18)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              color: '#3D2E2E',
              marginBottom: '0.4rem'
            }}>
              Share a Photo
            </h3>

            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '0.95rem',
              color: '#7A5C61',
              marginBottom: '1.2rem'
            }}>
              Capture or upload your favorite wedding moment ✨
            </p>

            <PhotoUpload onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
          </motion.div>
        )}

        {/* ───── GALLERY ───── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Gallery refreshTrigger={refreshTrigger} />
        </motion.div>

      </main>

      {/* ───── FOOTER ───── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 4rem'
        }}
      >
        <p style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '2rem',
          color: '#C98C95'
        }}>
          With love ♡
        </p>

        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: '0.85rem',
          color: '#9A8A8A'
        }}>
          Nikki &amp; Michael
        </p>
      </footer>

      {/* MODAL */}
      <WelcomeModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </div>
  )
}