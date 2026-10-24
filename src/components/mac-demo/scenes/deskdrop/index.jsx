import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppIcon } from '../../../ProjectArt'
import { deskdrop } from './shared'
import NearbyChapter from './NearbyChapter'
import EdgeChapter from './EdgeChapter'
import HoldChapter from './HoldChapter'
import MessagesChapter from './MessagesChapter'

// Each chapter shows one way of sharing. `time` is how long it plays before the next one (seconds).
export const CHAPTERS = [
  { id: 'nearby', title: 'Nearby', detail: 'Drag a file onto a colleague’s Mac', time: 8.6, Component: NearbyChapter },
  { id: 'edges', title: 'Screen edges', detail: 'Push a file against a colleague’s edge, even with DeskDrop closed', time: 7.0, Component: EdgeChapter },
  { id: 'hold', title: 'Hold to share', detail: 'Hold a dragged file still and nearby Macs appear around it', time: 7.6, Component: HoldChapter },
  { id: 'messages', title: 'Messages', detail: 'Read receipts, typing and tapbacks, like Messages', time: 10.6, Component: MessagesChapter },
]

/**
 * DeskDrop, chapter by chapter. Pass `tab` to pin a chapter (the scroll demo does);
 * without it the chapters play in turn.
 */
export default function DeskDropScene({ tab }) {
  const pinned = tab !== undefined
  const [auto, setAuto] = useState(0)

  useEffect(() => {
    if (pinned) return
    const timer = setTimeout(() => setAuto((i) => (i + 1) % CHAPTERS.length), CHAPTERS[auto].time * 1000)
    return () => clearTimeout(timer)
  }, [pinned, auto])

  const index = pinned ? Math.min(Math.max(tab, 0), CHAPTERS.length - 1) : auto
  const chapter = CHAPTERS[index]

  return (
    <div className="absolute inset-0">
      {/* The window minimises before a gesture chapter starts, so they visibly work with DeskDrop closed. */}
      <AnimatePresence mode="wait" propagate>
        <chapter.Component key={chapter.id} />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-[2.75cqw] z-40 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: '-40%', filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: '-30%', filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-[0.6cqw] rounded-full bg-[#1c1c1e]/90 py-[0.4cqw] pr-[1.1cqw] pl-[0.45cqw] text-[0.92cqw] shadow-[0_0.6cqw_1.6cqw_rgba(0,0,0,0.45)] ring-1 ring-white/10"
          >
            <AppIcon project={deskdrop} className="size-[1.45cqw]" />
            <span className="font-semibold text-white">{chapter.title}</span>
            <span className="text-white/55">{chapter.detail}</span>
            <span className="ml-[0.3cqw] flex gap-[0.25cqw]">
              {CHAPTERS.map((c, i) => (
                <span key={c.id} className={`h-[0.4cqw] rounded-full transition-all duration-300 ${i === index ? 'w-[1.1cqw] bg-white' : 'w-[0.4cqw] bg-white/30'}`} />
              ))}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
