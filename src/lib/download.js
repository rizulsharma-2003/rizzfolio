// Files bigger than this skip the in-browser progress and go straight to the browser's downloader.
const MAX_BUFFERED_BYTES = 250 * 1024 * 1024

const sizeCache = new Map()

export function isSameOrigin(href) {
  try {
    return new URL(href, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

export function hostOf(href) {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function fileNameOf({ href, filename }) {
  if (filename) return filename
  const path = new URL(href, window.location.href).pathname
  return decodeURIComponent(path.split('/').pop() || 'download')
}

export function formatBytes(bytes) {
  if (!bytes) return ''
  const units = ['bytes', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1000)))
  const n = bytes / 1000 ** i
  return `${i === 0 ? n : n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`
}

/** Asks the server how big a file is, once per URL. Resolves to 0 when unknown. */
export function fetchSize(href) {
  if (!sizeCache.has(href)) {
    const request = fetch(href, { method: 'HEAD' })
      .then((res) => (res.ok ? Number(res.headers.get('content-length')) || 0 : 0))
      .catch(() => 0)
    sizeCache.set(href, request)
  }
  return sizeCache.get(href)
}

/** Hands a URL to the browser's own downloader. */
export function saveFromUrl(href, filename) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.rel = 'noopener'
  document.body.append(a)
  a.click()
  a.remove()
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  saveFromUrl(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

/**
 * Streams a same-origin file so we can report real progress.
 * Resolves to a Blob, or null when the file is too large to buffer (save it with saveFromUrl instead).
 */
export async function fetchWithProgress(href, { signal, onProgress }) {
  const res = await fetch(href, { signal })
  if (!res.ok) throw new Error(`Download failed (${res.status})`)

  const total = Number(res.headers.get('content-length')) || 0
  if (!res.body || total > MAX_BUFFERED_BYTES) {
    res.body?.cancel()
    return null
  }

  const reader = res.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    if (total) onProgress(received / total)
  }
  return new Blob(chunks, { type: res.headers.get('content-type') || 'application/octet-stream' })
}
