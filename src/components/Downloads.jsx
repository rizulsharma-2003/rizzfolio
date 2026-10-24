import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import DownloadButton from './DownloadButton'
import { AppIcon } from './ProjectArt'
import { Reveal } from './Reveal'
import Segmented from './Segmented'
import { kindOptions } from '../lib/kinds'
import { KINDS, projects } from '../data/projects'
import { useDownloadCaption } from '../hooks/useDownload'
import { SPRING } from '../lib/motion'

/** Everything downloadable, App Store style: icon, name, and a GET button. */
export default function Downloads({ onOpen }) {
  const [kind, setKind] = useState('all')
  const items = projects.filter((p) => p.download?.href)
  const visible = kind === 'all' ? items : items.filter((p) => p.kind === kind)
  const hasNotes = visible.some((p) => p.download.note)

  return (
    <section id="downloads" className="px-4 py-28 md:py-40">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="text-center">
          <h2 className="type-headline">Downloads.</h2>
          <p className="type-lead mx-auto mt-5 max-w-[640px] text-mute">
            Mac apps download right here. Everything else opens in the right store, or as source code.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Segmented id="downloads-filter" label="Filter downloads" options={kindOptions(KINDS, items)} value={kind} onChange={setKind} />
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <motion.ul
            layout
            style={{ borderRadius: 28 }}
            className="relative grid grid-cols-1 bg-card px-5 py-2 md:grid-cols-2 md:gap-x-12 md:px-8"
            transition={SPRING}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={SPRING}
                  className="relative after:absolute after:right-0 after:bottom-0 after:left-20 after:h-px after:bg-white/10 last:after:hidden md:[&:nth-last-child(-n+2)]:after:hidden"
                >
                  <DownloadRow project={project} onOpen={onOpen} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </Reveal>

        <AnimatePresence initial={false}>
          {hasNotes && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-6 max-w-[720px] text-center text-[12px] leading-relaxed text-dim"
            >
              The Mac apps aren’t notarized by Apple yet, so macOS blocks them the first time. Open System Settings › Privacy &amp;
              Security and click Open Anyway. You only need to do it once per app.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function DownloadRow({ project, onOpen }) {
  const caption = useDownloadCaption(project.download)
  const meta = [project.category, project.version && `v${project.version}`].filter(Boolean).join(' · ')

  return (
    <div className="flex items-center gap-4 py-4">
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`About ${project.name}`}
        className="shrink-0 rounded-[23%] transition-transform duration-300 ease-apple hover:scale-[1.05] active:scale-95"
      >
        <AppIcon project={project} className="size-16" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] leading-tight font-semibold">{project.name}</p>
        <p className="mt-0.5 truncate text-[14px] text-mute">{project.tagline}</p>
        <p className="mt-1 truncate text-[12px] text-dim">{meta}</p>
      </div>
      <div className="flex w-[84px] shrink-0 flex-col items-center gap-1">
        <DownloadButton download={project.download} variant="get" />
        <span className="max-w-full truncate text-[10px] text-dim">{caption}</span>
      </div>
    </div>
  )
}
