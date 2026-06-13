import { Users, Image, Star, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

function StatCard({ label, value, icon, bg, delay = 0 }) {
  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#9A8A8A',
            marginBottom: '0.25rem',
          }}>
            {label}
          </p>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 600,
            color: '#3D2E2E',
          }}>
            {value ?? '—'}
          </p>
        </div>
        <div style={{
          width: '3rem', height: '3rem',
          borderRadius: '50%',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminStats({ stats }) {
  if (!stats) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    }}>
      <StatCard
        label="Total Guests"
        value={stats.totalGuests}
        bg="rgba(167,191,215,0.2)"
        icon={<Users size={18} color="#A7BFD7" />}
        delay={0.05}
      />
      <StatCard
        label="Total Uploads"
        value={stats.totalPhotos}
        bg="rgba(248,215,218,0.4)"
        icon={<Image size={18} color="#F0B8BF" />}
        delay={0.1}
      />
      <StatCard
        label="Avg per Guest"
        value={stats.avgPerGuest}
        bg="rgba(248,231,161,0.4)"
        icon={<TrendingUp size={18} color="#B8A99A" />}
        delay={0.15}
      />
      <StatCard
        label="Most Active"
        value={stats.mostActiveGuest?.split(' ')[0] ?? '—'}
        bg="rgba(168,181,162,0.22)"
        icon={<Star size={18} color="#A8B5A2" />}
        delay={0.2}
      />
    </div>
  )
}