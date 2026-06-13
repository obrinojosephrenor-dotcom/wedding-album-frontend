import { useState } from 'react'

export default function WelcomeModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) return

    setLoading(true)

    try {
      await onSubmit(name)
      setName('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

 return (
  <div
    className="modal-overlay"
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    }}
  >
    {/* 🌸 floating glow */}
    <div
      style={{
        position: 'absolute',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(255,192,203,0.25), transparent 70%)',
        borderRadius: '50%',
        top: '-120px',
        left: '-120px'
      }}
    />

    <div
      className="modal-box"
      style={{
        width: '90%',
        maxWidth: '420px',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)',
        borderRadius: '22px',
        padding: '2.2rem',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
        position: 'relative',
        animation: 'modalPop 0.25s ease-out'
      }}
    >
      {/* 🌷 Title */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
        Welcome 💐
      </h2>

      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Enter your name to join the wedding album
      </p>

      {/* ✨ decorative line */}
      <div
        style={{
          width: '50px',
          height: '2px',
          margin: '0 auto 1.5rem auto',
          background: 'linear-gradient(to right, #f8c8dc, #d6e6f2)',
          borderRadius: '999px'
        }}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #eee',
            outline: 'none',
            marginBottom: '1rem',
            fontSize: '0.95rem',
            background: 'rgba(255,255,255,0.8)'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #f8b4c0, #fbcfe8)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(255,182,193,0.35)',
            transition: 'transform 0.2s ease'
          }}
        >
          {loading ? 'Entering...' : 'Enter Album ✿'}
        </button>
      </form>

      {/* Cancel */}
      <button
        onClick={onClose}
        style={{
          marginTop: '1rem',
          background: 'transparent',
          border: 'none',
          color: '#888',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)
}