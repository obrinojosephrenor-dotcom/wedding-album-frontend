import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FlowerIcon from '../components/ui/FlowerIcon'

export default function NotFoundPage() {
  return (
    <div className="paper-texture" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', opacity: 0.6 }}>
          <FlowerIcon size={72} color="#F8D7DA" />
        </div>
        <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '5rem', color: '#F0B8BF', margin: '0 0 0.5rem' }}>404</h1>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#3D2E2E', margin: '0 0 0.6rem' }}>Page Not Found</p>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.9rem', color: '#9A8A8A', margin: '0 0 2rem' }}>
          This petal seems to have blown away…
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
          ✿ Back to Album
        </Link>
      </motion.div>
    </div>
  )
}
