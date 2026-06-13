import { useState, useCallback } from 'react'
import { photoService } from '../services/api'

export function usePhotos() {
  const [photos,  setPhotos]  = useState([])
  const [page,    setPage]    = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchPhotos = useCallback(async (pageNum = 1, reset = false) => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await photoService.getPhotos(pageNum, 20)
      const items = data.photos || []
      setPhotos(prev => reset ? items : [...prev, ...items])
      setHasMore(data.hasMore ?? items.length === 20)
      setPage(pageNum)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load photos.')
      console.error('usePhotos error:', err.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  const refresh = () => fetchPhotos(1, true)

  const loadMore = () => {
    if (hasMore && !loading) fetchPhotos(page + 1)
  }

  return { photos, loading, error, hasMore, refresh, loadMore }
}