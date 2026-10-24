import { AnimatePresence, motion, useTransform } from 'motion/react'
import { ArrowUpRight, Check, Download } from 'lucide-react'
import { useDownload } from '../hooks/useDownload'
import { SPRING_SNAPPY } from '../lib/motion'

/**
 * One button for every kind of download.
 *   variant 'get'               — App Store style: GET → progress ring → ✓
 *   variant 'primary' | 'outline' — Apple pill that fills as the file arrives
 * Links (download.type === 'link') render as a real anchor that opens in a new tab.
 */
export default function DownloadButton({ download, variant = 'primary', ...props }) {
  if (!download?.href) return null
  return variant === 'get' ? <GetButton download={download} /> : <PillButton download={download} variant={variant} {...props} />
}

function defaultLabel(download) {
  return download.label ?? (download.type === 'link' ? 'Get it' : 'Download')
}

/* ------------------------------------------------------------------ */

function PillButton({ download, variant, size, label, className = '' }) {
  const { status, progress, start, cancel } = useDownload(download)
  const percent = useTransform(progress, (v) => `${Math.round(v * 100)}%`)
  const text = label ?? defaultLabel(download)
  const compact = size === 'xs'
  const classes = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`
  const isLink = download.type === 'link'
  const Icon = isLink ? ArrowUpRight : Download

  if (isLink) {
    return (
      <a href={download.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {text}
        <Icon aria-hidden className="size-[1em]" strokeWidth={2.25} />
      </a>
    )
  }

  // Every state is rendered in the same grid cell, so the button never jumps in width.
  const states = {
    idle: (
      <>
        {text}
        {!compact && <Icon aria-hidden className="size-[1em]" strokeWidth={2.25} />}
      </>
    ),
    loading: (
      <>
        {!compact && 'Downloading '}
        <motion.span className="tabular-nums">{percent}</motion.span>
      </>
    ),
    done: (
      <>
        {!compact && 'Downloaded'}
        <Check aria-hidden className="size-[1.05em]" strokeWidth={2.75} />
      </>
    ),
    error: compact ? 'Retry' : 'Couldn’t download',
  }

  return (
    <button
      type="button"
      onClick={status === 'loading' ? cancel : start}
      aria-label={status === 'loading' ? `Cancel download of ${text}` : `${text}`}
      className={classes}
    >
      <motion.span
        aria-hidden
        className={`absolute inset-0 -z-10 origin-left ${variant === 'outline' ? 'bg-link/25' : 'bg-white/20'}`}
        style={{ scaleX: progress }}
        animate={{ opacity: status === 'loading' || status === 'done' ? 1 : 0 }}
      />
      <span className="grid">
        {Object.entries(states).map(([key, content]) => (
          <motion.span
            key={key}
            aria-hidden={key !== status}
            className="col-start-1 row-start-1 inline-flex items-center justify-center gap-[0.4em]"
            initial={false}
            animate={key === status ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 6, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
          >
            {content}
          </motion.span>
        ))}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */

function GetButton({ download }) {
  const { status, progress, start, cancel } = useDownload(download)
  const isLink = download.type === 'link'
  const loading = status === 'loading'
  const Element = isLink ? motion.a : motion.button
  const name = defaultLabel(download)
  const elementProps = isLink
    ? { href: download.href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${name} (opens in a new tab)` }
    : { type: 'button', onClick: loading ? cancel : start, 'aria-label': loading ? 'Cancel download' : name }

  return (
    <Element
      {...elementProps}
      className="group relative inline-grid h-7 place-items-center text-[15px] font-bold tracking-[-0.01em] text-link"
      initial={false}
      animate={{ width: loading ? 28 : 74 }}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_SNAPPY}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-white/[0.12] transition-colors duration-300 group-hover:bg-white/[0.18]"
        animate={{ opacity: loading ? 0 : 1 }}
      />
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          className="relative col-start-1 row-start-1 grid place-items-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {status === 'idle' && 'GET'}
          {loading && <ProgressRing progress={progress} />}
          {status === 'done' && <Check aria-hidden className="size-4" strokeWidth={3} />}
          {status === 'error' && <span className="text-[13px]">RETRY</span>}
        </motion.span>
      </AnimatePresence>
    </Element>
  )
}

function ProgressRing({ progress }) {
  return (
    <span className="relative grid size-7 place-items-center">
      <svg viewBox="0 0 28 28" className="absolute inset-0 -rotate-90">
        <circle cx="14" cy="14" r="12.25" fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="2.5" />
        <motion.circle
          cx="14"
          cy="14"
          r="12.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      </svg>
      <span className="size-[9px] rounded-[2px] bg-current" />
    </span>
  )
}
