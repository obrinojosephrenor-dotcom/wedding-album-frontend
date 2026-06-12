import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGuest } from '../context/GuestContext'
import UploadCounter from '../components/ui/UploadCounter'
import PhotoUpload   from '../components/upload/PhotoUpload'
import Gallery       from '../components/gallery/Gallery'
import FlowerIcon    from '../components/ui/FlowerIcon'
import WelcomeModal  from '../components/ui/WelcomeModal'

export default function DashboardPage() {
  const { guest, loading } = useGuest()
  const [showModal,      setShowModal]      = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!loading && !guest) setShowModal(true)
  }, [guest, loading])

  const firstName = guest?.name?.split(' ')[0] || 'Friend'

  return (
    <div className="paper-texture" style={{ minHeight: '100vh' }}>

      {/* ── Header ── */}
      <header style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 0% 50%,   rgba(248,215,218,0.38) 0%, transparent 52%),
            radial-gradient(ellipse at 100% 50%,  rgba(167,191,215,0.28) 0%, transparent 52%)
          `
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-28%,-28%)', opacity: 0.28, pointerEvents: 'none' }}>
          <FlowerIcon size={130} color="#F8D7DA" />
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(28%,-28%)', opacity: 0.22, pointerEvents: 'none' }}>
          <FlowerIcon size={110} color="#A8B5A2" />
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '3.5rem 1.5rem 2.5rem' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B8A99A', marginBottom: '0.5rem' }}
          >
            Shared Wedding Album
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: '"Dancing Script", cursive', fontSize: 'clamp(2.8rem, 8vw, 4.5rem)', color: '#3D2E2E', margin: '0 0 0.75rem' }}
          >
            Nikki &amp; Michael
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="divider-floral" style={{ maxWidth: '200px', margin: '0 auto' }}>
              <span style={{ fontSize: '1rem' }}>✿</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem 5rem' }}>

        {/* Welcome + counter cards */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
          >
            {/* Welcome card */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8A8A', marginBottom: '0.25rem' }}>
                Welcome back
              </p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.55rem', fontWeight: 600, color: '#3D2E2E', margin: '0 0 0.75rem' }}>
                Hello, {firstName}! 🌸
              </h2>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#6B5757', lineHeight: 1.6, margin: 0 }}>
                We're so glad you're here. Share your favorite moments from Nikki &amp; Michael's special day.
              </p>
            </div>

            {/* Upload counter */}
            <UploadCounter count={guest.upload_count} />
          </motion.div>
        )}

        {/* Upload section */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card"
            style={{ padding: '1.75rem', marginBottom: '2.5rem' }}
          >
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', color: '#3D2E2E', margin: '0 0 0.4rem' }}>
              Share a Photo
            </h3>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', margin: '0 0 1.5rem' }}>
              Take a new photo or upload one from your gallery.
            </p>
            <PhotoUpload onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
          </motion.div>
        )}

        {/* Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Gallery refreshTrigger={refreshTrigger} />
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ textAlign: 'center', padding: '1rem 0 2.5rem' }}>
        <div className="divider-floral" style={{ maxWidth: '200px', margin: '0 auto 1rem' }}>
          <span style={{ opacity: 0.35, fontSize: '0.9rem' }}>✿</span>
        </div>
        <p style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.6rem', color: '#B8A99A', margin: '0 0 0.25rem' }}>
          With love ♡
        </p>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.78rem', color: '#9A8A8A', margin: 0 }}>
          Nikki &amp; Michael
        </p>
      </footer>

      <WelcomeModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
