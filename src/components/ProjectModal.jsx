import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, CirclePlay, Download, Info, X } from 'lucide-react'
import DownloadButton from './DownloadButton'
import { CoverArt } from './ProjectArt'
import { DEMOS } from './mac-demo/scenes'
import { useDownloadCaption } from '../hooks/useDownload'
import { useScrollLock } from '../hooks/useScrollLock'
import { EASE_APPLE, EASE_OUT, SPRING } from '../lib/motion'

const list = { hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
}

/** Apple's product-page modal: a sheet that rises over a frosted backdrop. */
export default function ProjectModal({ project, onClose, onDemo }) {
  return <AnimatePresence>{project && <Sheet key={project.id} project={project} onClose={onClose} onDemo={onDemo} />}</AnimatePresence>
}

function Sheet({ project, onClose, onDemo }) {
  const panel = useRef(null)
  const closeButton = useRef(null)
  const caption = useDownloadCaption(project.download)
  useScrollLock(true)

  useEffect(() => {
    const returnFocusTo = document.activeElement
    closeButton.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') trapFocus(e, panel.current)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      returnFocusTo?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  const details = [
    ['Category', project.category],
    ['My role', project.role],
    ['Status', project.status],
    ['Platform', project.platform],
    ['Version', project.version],
    ['Released', project.year],
    ['Built with', project.stack?.join(', ')],
    [project.download?.type === 'link' ? 'Available on' : 'Download size', caption],
  ].filter(([, value]) => value)

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE_APPLE }}
    >
      <div aria-hidden className="fixed inset-0 bg-black/70 backdrop-blur-xl" />
      <div
        className="relative flex min-h-full justify-center px-3 py-12 md:px-6 md:py-20"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.article
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${project.id}-title`}
          className="relative h-fit w-full max-w-[1000px] overflow-clip rounded-[28px] bg-card shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98, transition: { duration: 0.3, ease: EASE_APPLE } }}
          transition={SPRING}
        >
          <div className="sticky top-0 z-20 flex h-0 justify-end">
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="mt-4 mr-4 grid size-9 shrink-0 place-items-center rounded-full bg-[#333336]/90 text-fog/80 backdrop-blur-xl transition-colors hover:bg-[#424245] hover:text-fog md:mt-6 md:mr-6"
            >
              <X className="size-[18px]" strokeWidth={2.5} />
            </button>
          </div>

          <div className="h-[280px] md:h-[440px]">
            <CoverArt project={project} />
          </div>

          <motion.div variants={list} initial="hidden" animate="shown" className="px-6 py-10 md:px-16 md:py-16">
            <motion.p variants={item} className="type-eyebrow text-ember">
              {project.isNew ? 'New' : (project.status ?? project.category)}
            </motion.p>
            <motion.h2 variants={item} id={`${project.id}-title`} className="type-title mt-2">
              {project.name}
            </motion.h2>
            <motion.p variants={item} className="mt-2 text-[21px] leading-tight text-fog/85 md:text-[28px]">
              {project.tagline}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <DownloadButton download={project.download} variant="primary" />
              {DEMOS[project.id] && (
                <button type="button" onClick={() => onDemo(project)} className="link-chevron gap-1.5 text-[17px]">
                  <CirclePlay className="size-[18px]" strokeWidth={2} />
                  Watch demo
                </button>
              )}
              {project.links?.map((link) => {
                const LinkIcon = link.download ? Download : ArrowUpRight
                const target = link.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' }
                return (
                  <a key={link.href + link.label} href={link.href} {...target} className="link-chevron text-[17px]">
                    {link.label}
                    <LinkIcon className="size-4" strokeWidth={2.25} />
                  </a>
                )
              })}
            </motion.div>
            {project.download?.note && (
              <motion.p variants={item} className="mt-4 flex max-w-[560px] items-start gap-2 text-[13px] leading-snug text-mute">
                <Info className="mt-px size-4 shrink-0" strokeWidth={2} />
                {project.download.note}
              </motion.p>
            )}

            <motion.div variants={item} className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-14">
              <div>
                <p className="text-[17px] leading-relaxed text-mute md:text-[19px]">{project.description}</p>
                {project.features?.length > 0 && (
                  <ul className="mt-8 space-y-4">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[17px]">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ember/15 text-ember">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <dl className="h-fit divide-y divide-white/10 rounded-2xl bg-white/[0.04] px-5">
                {details.map(([term, value]) => (
                  <div key={term} className="flex items-baseline justify-between gap-6 py-3.5 text-[14px]">
                    <dt className="shrink-0 text-mute">{term}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  )
}

function trapFocus(e, root) {
  const focusable = root?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  if (!focusable?.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
