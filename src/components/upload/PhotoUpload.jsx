import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { photoService } from '../../services/api'
import { useGuest } from '../../context/GuestContext'

const MAX_UPLOADS  = 25
const MAX_SIZE     = 10 * 1024 * 1024
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export default function PhotoUpload({ onUploadSuccess }) {
  const { guest, incrementUpload } = useGuest()
  const [preview,    setPreview]   = useState(null)
  const [file,       setFile]      = useState(null)
  const [uploading,  setUploading] = useState(false)
  const [progress,   setProgress]  = useState(0)
  const [dragOver,   setDragOver]  = useState(false)
  const cameraRef = useRef(null)
  const fileRef   = useRef(null)

  const uploadCount  = guest?.upload_count ?? 0
  const limitReached = uploadCount >= MAX_UPLOADS

  const pick = (raw) => {
    if (!raw) return
    if (!ALLOWED_MIME.includes(raw.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed.')
      return
    }
    if (raw.size > MAX_SIZE) {
      toast.error('File must be under 10 MB.')
      return
    }
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
    const fd = new FormData()
    fd.append('photo',      file)
    fd.append('guest_id',   guest.id)
    fd.append('guest_name', guest.name)
    try {
      const { data } = await photoService.uploadPhoto(fd, setProgress)
      incrementUpload()
      toast.success('Photo shared! 🌸')
      clear()
      if (onUploadSuccess) onUploadSuccess(data)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  /* ── Limit reached state ── */
  if (limitReached) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: '#3D2E2E', marginBottom: '0.4rem' }}>
          {MAX_UPLOADS} / {MAX_UPLOADS} Uploads Used
        </p>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A' }}>
          Upload Limit Reached — Thank you for sharing your beautiful memories!
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Usage hint */}
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#9A8A8A', textAlign: 'center', marginBottom: '1rem' }}>
        You have used <strong style={{ color: '#B8A99A' }}>{uploadCount}</strong> of <strong style={{ color: '#B8A99A' }}>{MAX_UPLOADS}</strong> uploads.
      </p>

      {/* Buttons — only when no preview */}
      {!preview && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Camera */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => pick(e.target.files[0])}
          />
          <button onClick={() => cameraRef.current?.click()} className="btn-primary btn-sage">
            <Camera size={17} /> Take Photo
          </button>

          {/* File picker */}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => pick(e.target.files[0])}
          />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary">
            <Upload size={17} /> Upload Photo
          </button>
        </div>
      )}

      {/* Drop zone — only when no preview */}
      {!preview && (
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true)  }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
        >
          <Image size={30} style={{ margin: '0 auto 0.75rem', color: '#B8A99A', opacity: 0.6, display: 'block' }} />
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: '#9A8A8A', margin: '0 0 0.25rem' }}>
            Drag &amp; drop a photo here, or click to browse
          </p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.75rem', color: '#B8A99A', margin: 0 }}>
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
            exit={{   opacity: 0, scale: 0.96 }}
            style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 32px rgba(184,169,154,0.22)' }}
          >
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '22rem', objectFit: 'cover', display: 'block' }} />

            {/* Clear button */}
            <button
              onClick={clear}
              style={{
                position: 'absolute', top: '0.75rem', right: '0.75rem',
                background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
                width: '2rem', height: '2rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}
              aria-label="Remove photo"
            >
              <X size={15} color="#6B5757" />
            </button>

            {/* Upload progress overlay */}
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              }}>
                <div style={{ width: '70%', height: '8px', background: 'rgba(255,255,255,0.25)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#fff', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
                <p style={{ color: '#fff', fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>
                  Uploading… {progress}%
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      {preview && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '0.875rem' }}>
          <button onClick={submit} disabled={uploading} className="btn-primary w-full">
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path  className="opacity-75"  fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
