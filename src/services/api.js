import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'https://my-wedding-album-backend.onrender.com'

// ── Base instance ─────────────────────────────────────────
// timeout: 0 = no timeout (Render free tier cold-starts can take 50-60s)
const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 0,
})

// ── Wake-up ping ──────────────────────────────────────────
// Call this once on app load to wake Render before the user interacts
export async function wakeUpServer() {
  try {
    await axios.get(`${BASE}/health`, { timeout: 0 })
    console.log('✅ Server is awake')
  } catch (err) {
    console.warn('⚠️ Server wake-up failed:', err.message)
  }
}

// ── Guest ─────────────────────────────────────────────────
export const guestService = {
  createGuest: (data) => api.post('/api/guest', data),
  getGuest:    (id)   => api.get(`/api/guest/${id}`),
}

// ── Photos ────────────────────────────────────────────────
export const photoService = {
  getPhotos: (page = 1, limit = 20) =>
    api.get(`/api/photos?page=${page}&limit=${limit}`),

  // No timeout on uploads — large files + cold start need unlimited time
  uploadPhoto: (formData, onProgress) =>
    axios.post(`${BASE}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress: (e) => {
        if (onProgress) {
          // e.total can be 0 on some browsers — guard it
          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0
          onProgress(pct)
        }
      },
    }),

  deletePhoto: (id, adminPassword) =>
    api.delete(`/api/photos/${id}`, {
      headers: { 'x-admin-password': adminPassword },
    }),
}

// ── Admin ─────────────────────────────────────────────────
export const adminService = {
  getStats: (pw) =>
    api.get('/api/admin/stats', {
      headers: { 'x-admin-password': pw },
    }),

  getAllGuests: (pw) =>
    api.get('/api/admin/guests', {
      headers: { 'x-admin-password': pw },
    }),

  getAllPhotos: (pw, page = 1, search = '') =>
    api.get(
      `/api/admin/photos?page=${page}&search=${encodeURIComponent(search)}`,
      { headers: { 'x-admin-password': pw } }
    ),
}

export default api