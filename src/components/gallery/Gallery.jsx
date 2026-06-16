import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import DownloadPlugin from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { useInView } from 'react-intersection-observer'
import { photoService } from '../../services/api'
import { downloadImage } from '../../utils/downloadImage'
import toast from 'react-hot-toast'

// ── Single photo card ─────────────────────────────────────
function PhotoCard({ photo, index, onOpen }) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  const handleDownload = async (e) => {
    e.stopPropagation()
    await downloadImage(
      photo.image_url,
      `nikki-michael-${photo.id.slice(0, 8)}.jpg`
    )
  }

  return (
    <motion.div
      ref={ref}
      className="masonry-item"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
    >
      <div className="photo-card" onClick={() => onOpen(index)}>
        {!loaded && (
          <div
            className="skeleton"
            style={{ height: `${160 + (index % 5) * 38}px` }}
          />
        )}
        <img
          src={photo.image_url}
          alt={`Shared by ${photo.guest_name}`}
          style={{
            opacity: loaded ? 1 : 0,
            position: loaded ? 'static' : 'absolute',
            transition: 'opacity 0.4s',
            width: '100%',
            display: 'block',
          }}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="photo-card-overlay">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{
              color: '#fff', fontSize: '0.75rem',
              fontFamily: "'Lato', sans-serif", opacity: 0.9,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', maxWidth: '60%',
            }}>
              📷 {photo.guest_name}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={handleDownload}
                style={{
                  background: 'rgba(255,255,255,0.22)', border: 'none',
                  borderRadius: '50%', padding: '0.35rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Download"
              >
                <Download size={13} color="#fff" />
              </button>
              <div style={{
                background: 'rgba(255,255,255,0.18)', borderRadius: '50%',
                padding: '0.35rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <ZoomIn size={13} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Gallery ───────────────────────────────────────────────
export default function Gallery({ refreshTrigger }) {
  const [photos,   setPhotos]   = useState([])
  const [page,     setPage]     = useState(1)
  const [hasMore,  setHasMore]  = useState(true)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [lbIndex,  setLbIndex]  = useState(-1)

  const { ref: sentinelRef, inView: sentinelInView } = useInView({ threshold: 0.4 })

  const load = useCallback(async (pageNum = 1, reset = false) => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await photoService.getPhotos(pageNum, 20)
      const items = data.photos || []
      setPhotos(prev => reset ? items : [...prev, ...items])
      setHasMore(data.hasMore ?? items.length === 20)
      setPage(pageNum)
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to load photos.'
      setError(msg)
      console.error('Gallery load error:', msg)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  // Initial load / refresh
  useEffect(() => {
    load(1, true)
  }, [refreshTrigger]) // eslint-disable-line

  // Infinite scroll
  useEffect(() => {
    if (sentinelInView && hasMore && !loading) {
      load(page + 1)
    }
  }, [sentinelInView]) // eslint-disable-line

  const slides = photos.map(p => ({ src: p.image_url, download: p.image_url }))

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#6B5757', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
          All Memories
        </span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
      </div>

      {/* Error state with retry */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '3rem 1rem',
            background: 'rgba(248,215,218,0.2)',
            borderRadius: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#6B5757', marginBottom: '0.5rem' }}>
            Could not load photos
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', color: '#9A8A8A', marginBottom: '1.25rem' }}>
            The server may be waking up. Please wait a moment and try again.
          </p>
          <button
            onClick={() => load(1, true)}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.7rem 1.75rem' }}
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Empty state */}
      {photos.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '5rem 1rem' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📸</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#6B5757' }}>
            No photos yet
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.875rem', color: '#9A8A8A', marginTop: '0.5rem' }}>
            Be the first to share a memory!
          </p>
        </motion.div>
      )}

      {/* Masonry grid */}
      <div className="masonry-grid">
        {photos.map((p, i) => (
          <PhotoCard key={p.id} photo={p} index={i} onOpen={setLbIndex} />
        ))}
      </div>

      {/* Skeleton rows while loading */}
      {loading && (
        <div className="masonry-grid" style={{ marginTop: photos.length ? '0.25rem' : 0 }}>
          {[180, 240, 160, 210].map((h, i) => (
            <div key={i} className="masonry-item">
              <div className="skeleton" style={{ height: `${h}px` }} />
            </div>
          ))}
        </div>
      )}

      {/* Loading message on first load */}
      {loading && photos.length === 0 && (
        <p style={{
          textAlign: 'center',
          fontFamily: "'Lato', sans-serif",
          fontSize: '0.82rem',
          color: '#9A8A8A',
          marginTop: '1rem',
        }}>
          Waking up the server, please wait a moment…
        </p>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} style={{ height: '2rem' }} />}

      {/* End of feed */}
      {!hasMore && photos.length > 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '260px', margin: '0 auto' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: '#9A8A8A', whiteSpace: 'nowrap' }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} shared
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #B8A99A, transparent)' }} />
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lbIndex >= 0}
        close={() => setLbIndex(-1)}
        index={lbIndex}
        slides={slides}
        plugins={[DownloadPlugin]}
        on={{ view: ({ index }) => setLbIndex(index) }}
      />
    </div>
  )
}