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
            radial-gradient(ellipse at 0% 50%,  rgba(248,215,218,0.38) 0%, transparent 52%),
            radial-gradient(ellipse at 100% 50%, rgba(167,191,215,0.28) 0%, transparent 52%)
          `
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-30%,-30%)', opacity: 0.26, pointerEvents: 'none' }}>
          <FlowerIcon size={140} color="#F8D7DA" />
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(30%,-30%)', opacity: 0.2, pointerEvents: 'none' }}>
          <FlowerIcon size={120} color="#A8B5A2" />
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '3rem 1.5rem 2.25rem' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B8A99A', marginBottom: '0.5rem' }}
          >
            Shared Wedding Album
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.4rem, 8vw, 4.5rem)', color: '#3D2E2E', margin: '0 0 0.75rem' }}
          >
            Nikki &amp; Michael
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '160px', margin: '0 auto' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
              <span style={{ color: '#B8A99A', fontSize: '1rem' }}>✿</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem 5rem' }}>

        {/* Welcome + counter */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}
          >
            <div className="card" style={{ padding: '1.5rem' }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8A8A', marginBottom: '0.3rem' }}>
                Welcome back
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#3D2E2E', marginBottom: '0.75rem' }}>
                Hello, {firstName}! 🌸
              </h2>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.875rem', color: '#6B5757', lineHeight: 1.65 }}>
                We're so glad you're here. Share your favorite moments from Nikki &amp; Michael's special day.
              </p>
            </div>
            <UploadCounter count={guest.upload_count} />
          </motion.div>
        )}

        {/* Upload section */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
            className="card"
            style={{ padding: '1.75rem', marginBottom: '2.5rem' }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#3D2E2E', marginBottom: '0.4rem' }}>
              Share a Photo
            </h3>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.875rem', color: '#9A8A8A', marginBottom: '1.5rem' }}>
              Take a new photo or upload one from your gallery.
            </p>
            <PhotoUpload onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
          </motion.div>
        )}

        {/* Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}>
          <Gallery refreshTrigger={refreshTrigger} />
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ textAlign: 'center', padding: '1rem 0 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '200px', margin: '0 auto 1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)', opacity: 0.4 }} />
          <span style={{ color: '#B8A99A', opacity: 0.4 }}>✿</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)', opacity: 0.4 }} />
        </div>
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.6rem', color: '#B8A99A', marginBottom: '0.25rem' }}>With love ♡</p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: '#9A8A8A' }}>Nikki &amp; Michael</p>
      </footer>

      <WelcomeModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}return (
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
          radial-gradient(circle at 10% 20%, rgba(255,182,193,0.25), transparent 40%),
          radial-gradient(circle at 90% 30%, rgba(173,216,230,0.25), transparent 45%),
          radial-gradient(circle at 50% 90%, rgba(255,228,181,0.25), transparent 45%)
        `,
        pointerEvents: 'none'
      }}
    />

    {/* ── HEADER ── */}
    <header style={{ position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '3.5rem 1.5rem 2rem' }}>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.32em',
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
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(3rem, 8vw, 4.8rem)',
            color: '#3D2E2E',
            margin: '0.5rem 0'
          }}
        >
          Nikki &amp; Michael
        </motion.h1>

        {/* decorative line */}
        <div style={{
          width: '140px',
          height: '2px',
          margin: '0 auto',
          background: 'linear-gradient(90deg, transparent, #FFB6C1, #B5D8EB, transparent)',
          borderRadius: '999px'
        }} />
      </div>
    </header>

    {/* ── MAIN ── */}
    <main style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 1rem 5rem',
      position: 'relative',
      zIndex: 2
    }}>

      {/* Welcome + Counter */}
      {guest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >

          {/* Welcome Card */}
          <div
            className="card"
            style={{
              padding: '1.6rem',
              background: 'rgba(255,255,255,0.85)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(255,182,193,0.15)'
            }}
          >
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#D38C9A' }}>
              Welcome back
            </p>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.6rem',
              color: '#3D2E2E'
            }}>
              Hello, {firstName} 🌸
            </h2>

            <p style={{
              fontSize: '0.9rem',
              color: '#6B5757',
              lineHeight: 1.6
            }}>
              Share your favorite memories from this beautiful day.
            </p>
          </div>

          <UploadCounter count={guest.upload_count} />
        </motion.div>
      )}

      {/* Upload Section */}
      {guest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1.8rem',
            borderRadius: '22px',
            background: 'rgba(255,255,255,0.88)',
            boxShadow: '0 12px 35px rgba(173,216,230,0.18)',
            marginBottom: '2.5rem'
          }}
        >
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            color: '#3D2E2E'
          }}>
            Share a Photo
          </h3>

          <p style={{
            fontSize: '0.9rem',
            color: '#7A5C61',
            marginBottom: '1.2rem'
          }}>
            Capture or upload your favorite moment ✨
          </p>

          <PhotoUpload onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
        </motion.div>
      )}

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Gallery refreshTrigger={refreshTrigger} />
      </motion.div>

    </main>

    {/* ── FOOTER ── */}
    <footer style={{
      textAlign: 'center',
      padding: '2rem 0 3rem',
      position: 'relative',
      zIndex: 2
    }}>
      <p style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: '1.7rem',
        color: '#C98C95'
      }}>
        With love ♡
      </p>

      <p style={{
        fontSize: '0.8rem',
        color: '#9A8A8A'
      }}>
        Nikki &amp; Michael
      </p>
    </footer>

    <WelcomeModal isOpen={showModal} onClose={() => setShowModal(false)} />
  </div>
)