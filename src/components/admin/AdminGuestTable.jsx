import { motion } from 'framer-motion'

const MAX = 25

export default function AdminGuestTable({ guests }) {
  if (!guests || guests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#6B5757' }}>No guests yet.</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Lato', sans-serif", fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(184,169,154,0.25)' }}>
            {['Guest Name', 'Phone', 'Uploads', 'Progress', 'Joined'].map(h => (
              <th key={h} style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#9A8A8A',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guests.map((g, i) => (
            <motion.tr
              key={g.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                borderBottom: '1px solid rgba(184,169,154,0.12)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,215,218,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '0.875rem 1rem', color: '#3D2E2E', fontWeight: 600 }}>
                {g.name}
              </td>
              <td style={{ padding: '0.875rem 1rem', color: '#6B5757' }}>
                {g.phone || <span style={{ opacity: 0.4 }}>—</span>}
              </td>
              <td style={{ padding: '0.875rem 1rem', color: '#3D2E2E' }}>
                <span style={{ fontWeight: 700 }}>{g.upload_count}</span>
                <span style={{ color: '#9A8A8A' }}> / {MAX}</span>
              </td>
              <td style={{ padding: '0.875rem 1rem', minWidth: '100px' }}>
                <div style={{ background: 'rgba(184,169,154,0.18)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (g.upload_count / MAX) * 100)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    style={{
                      height: '100%',
                      borderRadius: '4px',
                      background: g.upload_count >= MAX
                        ? 'linear-gradient(90deg, #F0B8BF, #B8A99A)'
                        : 'linear-gradient(90deg, #A8B5A2, #7A9472)',
                    }}
                  />
                </div>
              </td>
              <td style={{ padding: '0.875rem 1rem', color: '#9A8A8A', fontSize: '0.8rem' }}>
                {new Date(g.created_at).toLocaleDateString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}