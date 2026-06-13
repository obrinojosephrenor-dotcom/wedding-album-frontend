import { useMemo } from 'react'
import { useGuest } from '../context/GuestContext'

const MAX_UPLOADS = 25

export function useUploadLimit() {
  const { guest } = useGuest()

  const uploadCount  = guest?.upload_count ?? 0
  const remaining    = Math.max(0, MAX_UPLOADS - uploadCount)
  const limitReached = uploadCount >= MAX_UPLOADS
  const percent      = Math.min(100, Math.round((uploadCount / MAX_UPLOADS) * 100))

  const statusText = useMemo(() => {
    if (limitReached) return `${MAX_UPLOADS} / ${MAX_UPLOADS} Uploads Used — Upload Limit Reached`
    return `You have used ${uploadCount} of ${MAX_UPLOADS} uploads.`
  }, [uploadCount, limitReached])

  return { uploadCount, remaining, limitReached, percent, statusText, MAX_UPLOADS }
}