import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Download, Users, Image, Star, AlertCircle, LogOut } from 'lucide-react'
import { adminService, photoService } from '../services/api'
import toast from 'react-hot-toast'

const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'NikkiMichael2024!'

function StatCard({ label, value, icon, bg }) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8A8A', margin: '0 0 0.2rem' }}>
            {label}
          </p>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.9rem', fontWeight: 600, color: '#3D2E2E', margin: 0 }}>
            {value ?? '—'}
          </p>
        </div>
        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed,    setAuthed]   = useState(false)
  const [pwInput,   setPwInput]  = useState('')
  const [stats,     setStats]    = useState(null)
  const [photos,    setPhotos]   = useState([])
  const [search,    setSearch]   = useState('')
  const [page,      setPage]     = useState(1)
  const [hasMore,   setHasMore]  = useState(false)
  const [loading,   setLoading]  = useState(false)
  const [deleteId,  setDeleteId] = useState(null)

  const login = (e) => {
    e.preventDefault()
    if (pwInput === ADMIN_PW) {
      setAuthed(true)
      toast.success('Welcome, Admin! 🌸')
    } else {
      toast.error('Incorrect password.')
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await adminService.getStats(ADMIN_PW)
      setStats(data)
    } catch {}
  }

  const fetchPhotos = async (p = 1, q = '', reset = false) => {
    setLoading(true)
    try {
      const { data } = await adminService.getAllPhotos(ADMIN_PW, p, q)
      const items = data.photos || []
      setPhotos(prev => reset ? items : [...prev, ...items])
      setHasMore(data.hasMore ?? false)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    if (authed) { fetchStats(); fetchPhotos(1, '', true) }
  }, [authed]) // eslint-disable-line

  const handleSearch = (e) => {
    const q = e.target.value
    setSearch(q)
    setPage(1)
    fetchPhotos(1, q, true)
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchPhotos(next, search)
  }

  const confirmDelete = async (id) => {
    try {
      await photoService.deletePhoto(id, ADMIN_PW)
      setPhotos(prev => prev.filter(p => p.id !== id))
      fetchStats()
      toast.success('Photo deleted.')
    } catch {
      toast.error('Delete failed. Try again.')
    }
    setDeleteId(null)
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="paper-texture" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ padding: '2.5rem 2rem', width: '100%', maxWidth: '380px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: '#3D2E2E', margin: '0 0 0.4rem' }}>
            Admin Panel
          </h1>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', margin: '0 0 1.75rem' }}>
            Nikki &amp; Michael's Wedding Album
          </p>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <input
              type="password"
              className="input-wedding"
              placeholder="Enter admin password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary">Enter Admin Panel</button>
          </form>
        </motion.div>
      </div>
    )
  }

  /* ── Dashboard ── */
  return (
    <div className="paper-texture" style={{ minHeight: '100vh' }}>

      {/* Top bar */}
      <header style={{
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(217,217,217,0.55)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: '#3D2E2E', margin: 0 }}>Admin Panel</h1>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.75rem', color: '#9A8A8A', margin: 0 }}>Nikki &amp; Michael's Wedding Album</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => toast('ZIP export: implement /api/admin/download-all on backend.', { icon: 'ℹ️' })}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.6rem 1.2rem' }}
            >
              <Download size={14} /> Export All
            </button>
            <button
              onClick={() => setAuthed(false)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.6rem 1.2rem' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}
          >
            <StatCard label="Total Guests"  value={stats.totalGuests}   bg="rgba(167,191,215,0.18)" icon={<Users  size={18} color="#A7BFD7" />} />
            <StatCard label="Total Uploads" value={stats.totalPhotos}   bg="rgba(248,215,218,0.35)" icon={<Image  size={18} color="#F0B8BF" />} />
            <StatCard label="Avg per Guest" value={stats.avgPerGuest}   bg="rgba(248,231,161,0.35)" icon={<Star   size={18} color="#B8A99A" />} />
            <StatCard label="Most Active"   value={stats.mostActiveGuest?.split(' ')[0] ?? '—'} bg="rgba(168,181,162,0.20)" icon={<Star size={18} color="#A8B5A2" />} />
          </motion.div>
        )}

        {/* Search */}
        <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={17} color="#9A8A8A" style={{ flexShrink: 0 }} />
          <input
            type="text"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Lato, sans-serif', fontSize: '0.9rem', color: '#3D2E2E' }}
            placeholder="Search by guest name…"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 14px rgba(184,169,154,0.16)', aspectRatio: '1 / 1' }}
                className="group"
              >
                <img
                  src={photo.image_url}
                  alt={`By ${photo.guest_name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0)',
                  transition: 'background 0.3s',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.50)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                >
                  <p style={{ color: '#fff', fontSize: '0.7rem', fontFamily: 'Lato, sans-serif', textAlign: 'center', padding: '0 0.5rem', margin: 0, opacity: 0, transition: 'opacity 0.3s' }}
                    ref={(el) => { if (el) { const p = el.closest('div'); p?.addEventListener('mouseenter', () => el.style.opacity = '1'); p?.addEventListener('mouseleave', () => el.style.opacity = '0') } }}>
                    {photo.guest_name}<br />
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{new Date(photo.created_at).toLocaleDateString()}</span>
                  </p>
                  <button
                    onClick={() => setDeleteId(photo.id)}
                    style={{
                      background: 'rgba(239,68,68,0.82)', border: 'none', borderRadius: '50%',
                      padding: '0.45rem', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.3s',
                    }}
                    ref={(el) => { if (el) { const p = el.closest('div'); p?.addEventListener('mouseenter', () => el.style.opacity = '1'); p?.addEventListener('mouseleave', () => el.style.opacity = '0') } }}
                    aria-label="Delete photo"
                  >
                    <Trash2 size={14} color="#fff" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ aspectRatio: '1/1', borderRadius: '0.75rem' }} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={loadMore} className="btn-secondary">Load More</button>
          </div>
        )}

        {/* Empty */}
        {!loading && photos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: '#6B5757' }}>No photos found</p>
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="card"
              style={{ padding: '2rem 1.75rem', width: '100%', maxWidth: '360px', textAlign: 'center' }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
            >
              <AlertCircle size={40} style={{ margin: '0 auto 0.75rem', color: '#F0B8BF', display: 'block' }} />
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: '#3D2E2E', margin: '0 0 0.5rem' }}>
                Delete Photo?
              </h3>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                This will permanently remove the photo from Cloudinary and the database.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button
                  onClick={() => confirmDelete(deleteId)}
                  className="btn-primary"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #F0B8BF, #e57373)' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
