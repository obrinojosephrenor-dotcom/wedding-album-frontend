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
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>Welcome 💐</h2>
        <p>Please enter your name to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Entering...' : 'Enter Album'}
          </button>
        </form>

        <button onClick={onClose} className="close-btn">
          Cancel
        </button>

      </div>
    </div>
  )
}