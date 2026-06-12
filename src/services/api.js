import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'https://my-wedding-album-backend.onrender.com'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

/* ── Guest ─────────────────────────────────────────── */
export const guestService = {
  createGuest: (data)  => api.post('/api/guest', data),
  getGuest:    (id)    => api.get(`/api/guest/${id}`),
}

/* ── Photos ────────────────────────────────────────── */
export const photoService = {
  getPhotos: (page = 1, limit = 20) =>
    api.get(`/api/photos?page=${page}&limit=${limit}`),

  uploadPhoto: (formData, onProgress) =>
    api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    }),

  deletePhoto: (id, adminPassword) =>
    api.delete(`/api/photos/${id}`, {
      headers: { 'x-admin-password': adminPassword },
    }),
}

/* ── Admin ─────────────────────────────────────────── */
export const adminService = {
  getStats: (pw) =>
    api.get('/api/admin/stats', { headers: { 'x-admin-password': pw } }),

  getAllGuests: (pw) =>
    api.get('/api/admin/guests', { headers: { 'x-admin-password': pw } }),

  getAllPhotos: (pw, page = 1, search = '') =>
    api.get(
      `/api/admin/photos?page=${page}&search=${encodeURIComponent(search)}`,
      { headers: { 'x-admin-password': pw } }
    ),
}

export default api
