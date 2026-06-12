import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import DownloadPlugin from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { useInView } from 'react-intersection-observer'
import { photoService } from '../../services/api'
import toast from 'react-hot-toast'

/* ── Single photo card ── */
function PhotoCard({ photo, index, onOpen }) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  const download = async (e) => {
    e.stopPropagation()
    try {
      const res  = await fetch(photo.image_url)
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `nikki-michael-${photo.id.slice(0, 8)}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Download failed. Right-click the image to save.')
    }
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
        {/* Skeleton while loading */}
        {!loaded && (
          <div className="skeleton" style={{ height: `${160 + (index % 5) * 38}px` }} />
        )}
        <img
          src={photo.image_url}
          alt={`Shared by ${photo.guest_name}`}
          style={{ opacity: loaded ? 1 : 0, position: loaded ? 'static' : 'absolute', transition: 'opacity 0.4s' }}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="photo-card-overlay">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#fff', fontSize: '0.75rem', fontFamily: 'Lato, sans-serif', opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
              📷 {photo.guest_name}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={download}
                style={{ background: 'rgba(255,255,255,0.22)', border: 'none', borderRadius: '50%', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                aria-label="Download photo"
              >
                <Download size={13} color="#fff" />
              </button>
              <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '50%', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZoomIn size={13} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Gallery ── */
export default function Gallery({ refreshTrigger }) {
  const [photos,  setPhotos]  = useState([])
  const [page,    setPage]    = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [lbIndex, setLbIndex] = useState(-1)

  const { ref: sentinelRef, inView: sentinelInView } = useInView({ threshold: 0.4 })

  const load = useCallback(async (pageNum, reset = false) => {
    if (loading) return
    setLoading(true)
    try {
      const { data } = await photoService.getPhotos(pageNum, 20)
      const items = data.photos || []
      setPhotos(prev => reset ? items : [...prev, ...items])
      setHasMore(data.hasMore ?? items.length === 20)
    } catch (err) {
      console.error('Gallery load error:', err.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Initial / refresh */
  useEffect(() => {
    setPage(1)
    load(1, true)
  }, [refreshTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Infinite scroll */
  useEffect(() => {
    if (sentinelInView && hasMore && !loading) {
      const next = page + 1
      setPage(next)
      load(next)
    }
  }, [sentinelInView]) // eslint-disable-line react-hooks/exhaustive-deps

  const slides = photos.map(p => ({ src: p.image_url, download: p.image_url }))

  return (
    <div>
      {/* Section header */}
      <div className="divider-floral" style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: '#6B5757', fontStyle: 'italic' }}>
          All Memories
        </span>
      </div>

      {/* Empty state */}
      {photos.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📸</div>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: '#6B5757' }}>No photos yet</p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', marginTop: '0.5rem' }}>
            Be the first to share a memory!
          </p>
        </motion.div>
      )}

      {/* Masonry */}
      <div className="masonry-grid">
        {photos.map((p, i) => (
          <PhotoCard key={p.id} photo={p} index={i} onOpen={setLbIndex} />
        ))}
      </div>

      {/* Skeleton rows while loading */}
      {loading && (
        <div className="masonry-grid" style={{ marginTop: '0.25rem' }}>
          {[180, 240, 160, 210].map((h, i) => (
            <div key={i} className="masonry-item">
              <div className="skeleton" style={{ height: `${h}px` }} />
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} style={{ height: '2rem' }} />}

      {/* End of feed */}
      {!hasMore && photos.length > 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
          <div className="divider-floral" style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.78rem', color: '#9A8A8A' }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} shared
            </span>
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
