import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { photoService } from '../../services/api'
import { useGuest } from '../../context/GuestContext'
import { validateImageFile } from '../../utils/fileValidation'

const MAX_UPLOADS = 25

export default function PhotoUpload({ onUploadSuccess }) {
  const { guest, incrementUpload } = useGuest()
  const [preview,   setPreview]   = useState(null)
  const [file,      setFile]      = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [dragOver,  setDragOver]  = useState(false)
  const cameraRef = useRef(null)
  const fileRef   = useRef(null)

  const uploadCount  = guest?.upload_count ?? 0
  const limitReached = uploadCount >= MAX_UPLOADS

  const pick = (raw) => {
    if (!raw) return
    const { valid, error } = validateImageFile(raw)
    if (!valid) { toast.error(error); return }
    setFile(raw)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(raw)
  }

  const clear = () => {
    setPreview(null)
    setFile(null)
    setProgress(0)
    if (cameraRef.current) cameraRef.current.value = ''
    if (fileRef.current)   fileRef.current.value   = ''
  }

  const submit = async () => {
    if (!file || !guest) return
    if (limitReached) { toast.error('Upload limit reached.'); return }

    setUploading(true)
    setProgress(0)

    // Show a toast so the user knows server might be cold-starting
    const loadingToast = toast.loading(
      'Uploading… (first upload may take up to 60s while the server wakes up)',
      { duration: Infinity }
    )

    const fd = new FormData()
    fd.append('photo',      file)
    fd.append('guest_id',   guest.id)
    fd.append('guest_name', guest.name)

    try {
      await photoService.uploadPhoto(fd, (pct) => {
        setProgress(pct)
      })

      toast.dismiss(loadingToast)
      incrementUpload()
      toast.success('Photo shared! 🌸')
      clear()
      if (onUploadSuccess) onUploadSuccess()
    } catch (err) {
      toast.dismiss(loadingToast)
      const msg = err?.response?.data?.error || 'Upload failed. Please try again.'
      toast.error(msg)
      console.error('Upload error:', err.message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  // ── Limit reached ─────────────────────────────────────
  if (limitReached) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '2rem 1rem' }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#3D2E2E', marginBottom: '0.4rem' }}>
          {MAX_UPLOADS} / {MAX_UPLOADS} Uploads Used
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.875rem', color: '#9A8A8A' }}>
          Upload Limit Reached — Thank you for sharing your memories! 💕
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Usage hint */}
      <p style={{
        fontFamily: "'Lato', sans-serif", fontSize: '0.8rem',
        color: '#9A8A8A', textAlign: 'center', marginBottom: '1rem',
      }}>
        You have used{' '}
        <strong style={{ color: '#B8A99A' }}>{uploadCount}</strong> of{' '}
        <strong style={{ color: '#B8A99A' }}>{MAX_UPLOADS}</strong> uploads.
      </p>

      {/* Action buttons — only when no preview */}
      {!preview && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          {/* Camera */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => pick(e.target.files[0])}
          />
          <button
            onClick={() => cameraRef.current?.click()}
            className="btn-primary btn-sage"
          >
            <Camera size={16} /> Take Photo
          </button>

          {/* File picker */}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => pick(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-secondary"
          >
            <Upload size={16} /> Upload Photo
          </button>
        </div>
      )}

      {/* Drag & drop zone */}
      {!preview && (
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            pick(e.dataTransfer.files[0])
          }}
          onClick={() => fileRef.current?.click()}
        >
          <Image
            size={28}
            style={{ margin: '0 auto 0.75rem', color: '#B8A99A', opacity: 0.6, display: 'block' }}
          />
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.875rem', color: '#9A8A8A', margin: '0 0 0.25rem' }}>
            Drag &amp; drop a photo here, or click to browse
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.75rem', color: '#B8A99A', margin: 0 }}>
            JPG · PNG · WEBP · Max 10 MB
          </p>
        </div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            style={{
              position: 'relative',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(184,169,154,0.22)',
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: '22rem', objectFit: 'cover', display: 'block' }}
            />

            {/* Clear button */}
            {!uploading && (
              <button
                onClick={clear}
                style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  background: 'rgba(255,255,255,0.92)', border: 'none',
                  borderRadius: '50%', width: '2rem', height: '2rem',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
                aria-label="Remove photo"
              >
                <X size={15} color="#6B5757" />
              </button>
            )}

            {/* Progress overlay */}
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.875rem', padding: '1.5rem',
              }}>
                {/* Spinner */}
                <svg
                  style={{ animation: 'spin 1s linear infinite', width: '2.5rem', height: '2.5rem' }}
                  viewBox="0 0 24 24" fill="none"
                >
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                  <path style={{ opacity: 0.9 }} fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>

                {/* Progress bar */}
                <div style={{ width: '75%', height: '6px', background: 'rgba(255,255,255,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#fff',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                    minWidth: progress > 0 ? '8px' : '0',
                  }} />
                </div>

                <p style={{
                  color: '#fff', fontFamily: "'Lato', sans-serif",
                  fontSize: '0.875rem', fontWeight: 700, margin: 0, textAlign: 'center',
                }}>
                  {progress > 0 ? `Uploading… ${progress}%` : 'Connecting to server…'}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '0.72rem', margin: 0, textAlign: 'center',
                }}>
                  Please don't close this page
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '0.875rem' }}
        >
          <button
            onClick={submit}
            disabled={uploading}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading…
              </span>
            ) : (
              <><Upload size={15} /> Share This Photo</>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}