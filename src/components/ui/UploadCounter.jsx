import { motion } from 'framer-motion'

const MAX = 25

export default function UploadCounter({ count = 0 }) {
  const used      = Math.min(count, MAX)
  const pct       = (used / MAX) * 100
  const isFull    = used >= MAX
  const remaining = MAX - used

  return (
    <div className="card p-5 w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.7rem', color: '#9A8A8A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>
            Upload Count
          </p>
          <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.75rem', fontWeight: 600, color: '#3D2E2E', margin: 0 }}>
            {used}
            <span style={{ color: '#9A8A8A', fontSize: '1.1rem', fontWeight: 400 }}> / {MAX}</span>
          </p>
        </div>
        <div style={{
          width: '3.2rem', height: '3.2rem', borderRadius: '50%',
          background: isFull ? 'rgba(240,184,191,0.18)' : 'rgba(168,181,162,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {isFull ? '📷' : '🌸'}
        </div>
      </div>

      {/* Bar */}
      <div className="progress-bar mb-2">
        <motion.div
          className={`progress-fill${isFull ? ' full' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      </div>

      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.78rem', color: '#9A8A8A', margin: 0 }}>
        {isFull ? (
          <span style={{ color: '#F0B8BF', fontWeight: 700 }}>
            ✿ Upload Limit Reached — Thank you!
          </span>
        ) : (
          <>
            <span style={{ color: '#A8B5A2', fontWeight: 700 }}>{remaining} photo{remaining !== 1 ? 's' : ''}</span>
            {' '}remaining
          </>
        )}
      </p>

      {isFull && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: 'rgba(248,215,218,0.28)',
            border: '1px solid rgba(240,184,191,0.25)',
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.8rem',
            color: '#6B5757',
            textAlign: 'center',
          }}
        >
          You've used all <strong>{MAX}</strong> upload slots.<br />We love your photos! 💕
        </motion.div>
      )}
    </div>
  )
}
