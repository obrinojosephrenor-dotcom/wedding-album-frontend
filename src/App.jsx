import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { GuestProvider } from './context/GuestContext'
import LandingPage   from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage     from './pages/AdminPage'
import NotFoundPage  from './pages/NotFoundPage'
import FloatingPetals from './components/ui/FloatingPetals'

export default function App() {
  const location = useLocation()

  return (
    <GuestProvider>
      <FloatingPetals />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"      element={<LandingPage />}   />
          <Route path="/album" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />}     />
          <Route path="*"      element={<NotFoundPage />}  />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Lato, sans-serif',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(184,169,154,0.25)',
            color: '#3D2E2E',
            border: '1px solid rgba(184,169,154,0.18)',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#A8B5A2', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#F0B8BF', secondary: '#fff' } },
        }}
      />
    </GuestProvider>
  )
}
