import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

export default function AdminPhotoGrid({ photos, loading, onDeleteClick }) {
  return (
    <>
      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem',
      }}>
        <AnimatePresence>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'relative',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                boxShadow: '0 4px 14px rgba(184,169,154,0.16)',
                background: '#f0ebe8',
              }}
            >
              <img
                src={photo.image_url}
                alt={`By ${photo.guest_name}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />

              {/* Hover overlay — CSS hover via onMouse events */}
              <PhotoOverlay photo={photo} onDeleteClick={onDeleteClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginTop: '0.75rem',
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div
              key={i}
              className="skeleton"
              style={{ aspectRatio: '1/1', borderRadius: '0.75rem' }}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#6B5757' }}>
            No photos found
          </p>
        </div>
      )}
    </>
  )
}

function PhotoOverlay({ photo, onDeleteClick }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'background 0.25s ease',
        padding: '0.5rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.52)'
        e.currentTarget.querySelectorAll('[data-show]').forEach(el => el.style.opacity = '1')
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0)'
        e.currentTarget.querySelectorAll('[data-show]').forEach(el => el.style.opacity = '0')
      }}
    >
      <p
        data-show
        style={{
          color: '#fff',
          fontSize: '0.72rem',
          fontFamily: "'Lato', sans-serif",
          textAlign: 'center',
          opacity: 0,
          transition: 'opacity 0.25s',
          padding: '0 0.25rem',
          lineHeight: 1.4,
        }}
      >
        {photo.guest_name}<br />
        <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>
          {new Date(photo.created_at).toLocaleDateString()}
        </span>
      </p>
      <button
        data-show
        onClick={() => onDeleteClick(photo.id)}
        style={{
          background: 'rgba(239,68,68,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.25s',
          flexShrink: 0,
        }}
        aria-label="Delete photo"
      >
        <Trash2 size={13} color="#fff" />
      </button>
    </div>
  )
}