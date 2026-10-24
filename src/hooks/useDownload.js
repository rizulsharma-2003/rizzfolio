import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import {
  fetchSize,
  fetchWithProgress,
  fileNameOf,
  formatBytes,
  hostOf,
  isSameOrigin,
  saveBlob,
  saveFromUrl,
} from '../lib/download'

const MIN_DURATION = 1100 // ms — even instant downloads get a satisfying ring
const RESET_AFTER = 2600

/**
 * Drives a download button: status is 'idle' | 'loading' | 'done' | 'error', and `progress`
 * is a 0–1 motion value that animates smoothly whether or not the server reports a size.
 */
export function useDownload(download) {
  const [status, setStatus] = useState('idle')
  const progress = useMotionValue(0)
  const cancelRef = useRef(null)
  const resetTimer = useRef(0)

  useEffect(
    () => () => {
      cancelRef.current?.()
      clearTimeout(resetTimer.current)
    },
    [],
  )

  const settle = useCallback(
    (next) => {
      cancelRef.current = null
      setStatus(next)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => {
        setStatus('idle')
        animate(progress, 0, { duration: 0.5, ease: EASE_OUT })
      }, RESET_AFTER)
    },
    [progress],
  )

  const start = useCallback(() => {
    if (!download?.href || download.type === 'link' || cancelRef.current) return

    const filename = fileNameOf(download)
    const controller = new AbortController()
    const startedAt = performance.now()
    let fraction = null // real progress, when the server sends a size
    let payload // undefined while in flight, then a Blob, 'direct' or 'opened'
    let frame = 0

    const tick = () => {
      const elapsed = performance.now() - startedAt
      const pace = Math.min(1, elapsed / MIN_DURATION)
      const estimate = payload !== undefined ? 1 : (fraction ?? 0.92 * (1 - Math.exp(-elapsed / 1400)))
      progress.set(Math.min(pace, estimate))

      if (payload !== undefined && pace >= 1) {
        if (payload instanceof Blob) saveBlob(payload, filename)
        else if (payload === 'direct') saveFromUrl(download.href, filename)
        settle('done')
        return
      }
      frame = requestAnimationFrame(tick)
    }

    if (isSameOrigin(download.href)) {
      fetchWithProgress(download.href, {
        signal: controller.signal,
        onProgress: (f) => (fraction = Math.min(1, f)),
      })
        .then((blob) => (payload = blob ?? 'direct'))
        .catch((err) => {
          if (controller.signal.aborted) return
          cancelAnimationFrame(frame)
          console.error(err)
          settle('error')
        })
    } else {
      // Can't stream another site's file — open it right away, while we still have the click.
      window.open(download.href, '_blank', 'noopener')
      payload = 'opened'
    }

    cancelRef.current = () => {
      controller.abort()
      cancelAnimationFrame(frame)
    }
    progress.set(0)
    setStatus('loading')
    frame = requestAnimationFrame(tick)
  }, [download, progress, settle])

  const cancel = useCallback(() => {
    cancelRef.current?.()
    cancelRef.current = null
    setStatus('idle')
    animate(progress, 0, { duration: 0.3 })
  }, [progress])

  return { status, progress, start, cancel }
}

/** Human-readable size for a file download, detected from the server when not given. */
export function useFileSize(download) {
  const [bytes, setBytes] = useState(0)
  const href = download?.href
  const detect = download?.type === 'file' && !download.size && href && isSameOrigin(href)

  useEffect(() => {
    if (!detect) return
    let live = true
    fetchSize(href).then((n) => live && setBytes(n))
    return () => {
      live = false
    }
  }, [detect, href])

  return download?.size ?? formatBytes(bytes)
}

/** The small grey caption under a download: file size, or where the link goes. */
export function useDownloadCaption(download) {
  const size = useFileSize(download)
  if (!download) return ''
  return download.type === 'link' ? hostOf(download.href) : size
}
