import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.88,  y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(184,169,154,0.3)',
              padding: '2rem 1.75rem',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
            }}
          >
            <AlertCircle
              size={40}
              color="#F0B8BF"
              style={{ margin: '0 auto 0.75rem', display: 'block' }}
            />
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem',
              color: '#3D2E2E',
              marginBottom: '0.5rem',
            }}>
              Delete Photo?
            </h3>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '0.875rem',
              color: '#9A8A8A',
              lineHeight: 1.65,
              marginBottom: '1.5rem',
            }}>
              This will permanently remove the photo from Cloudinary and the database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={onCancel}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
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
  )
}