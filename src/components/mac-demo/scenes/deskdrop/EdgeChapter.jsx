import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightToLine } from 'lucide-react'
import { useStoryboard } from '../../useStoryboard'
import { ACCENT, CYAN, LiquidBurst, MacArt, PEERS, SPECTRUM, VIOLET } from './shared'
import { DesktopFiles, Drag, FILES, VISIBLE } from './desk'

// Views/Gestures/EdgePortalView.swift, at 0.078cqw per point.
const CARD = { x: 100 - 136 * 0.078, w: 220 * 0.078 }
const OPEN_BAND = 280 * 0.078
const STRIP = 4 * 0.078
const Y = 30
const file = FILES[0]

// idle · drag to the right edge · portal open · release into the portal · portal closes · settle
const STEPS = [0.9, 1.8, 0.9, 0.5, 1.4, 0.8]

/** Push a file against the screen edge assigned to a colleague: a portal opens, and releasing sends it. */
export default function EdgeChapter() {
  const step = useStoryboard(STEPS, { delay: 0.6 })
  const dragging = step >= 1 && step <= 3
  const open = step === 2 || step === 3
  const released = step === 3
  const sent = step === 3 || step === 4

  const path =
    step <= 0
      ? [{ x: 42, y: 36, t: 0 }, { x: 42, y: 36, t: 1 }]
      : step === 1
        ? [
            { x: 42, y: 36, t: 0 },
            { x: file.x, y: file.y + 1.6, t: 0.28 },
            { x: 70, y: Y + 2, t: 0.75 },
            { x: 99.2, y: Y, t: 1 },
          ]
        : step === 2 || step === 3
          ? [{ x: 99.2, y: Y, t: 0 }, { x: 99.2, y: Y, t: 1 }]
          : [{ x: 99.2, y: Y, t: 0 }, { x: 86, y: Y + 5, t: 1 }]

  return (
    <div className="absolute inset-0">
      <DesktopFiles dragging={dragging ? file.id : null} />

      {/* Assigned edges show a thin live strip while a file is being dragged. */}
      <AnimatePresence>
        {(dragging || sent) &&
          ['left', 'right'].map((edge) => (
            <motion.span
              key={edge}
              className="absolute z-30"
              style={{
                [edge]: 0,
                top: `${VISIBLE.top}cqw`,
                height: `${VISIBLE.bottom - VISIBLE.top}cqw`,
                width: `${STRIP}cqw`,
                background: `linear-gradient(180deg, ${CYAN}59, ${ACCENT}e6, ${VIOLET}59)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }}
            />
          ))}
      </AnimatePresence>

      {/* The edge warms up as the file approaches it. */}
      <motion.span
        className="pointer-events-none absolute right-0 z-20 h-[30cqw] w-[9cqw] -translate-y-1/2 mix-blend-screen"
        style={{ top: `${Y}cqw`, background: `radial-gradient(60% 50% at 100% 50%, ${ACCENT}99, ${VIOLET}33 55%, transparent 80%)` }}
        initial={false}
        animate={{ opacity: step === 1 ? [0, 0, 0.5, 1] : open ? 1 : 0 }}
        transition={step === 1 ? { duration: STEPS[1], times: [0, 0.5, 0.85, 1] } : { duration: 0.4 }}
      />

      <AnimatePresence>
        {open && (
          <motion.div key="portal" className="absolute inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
            <div className="absolute top-0 right-0 h-full bg-gradient-to-l from-black/45 to-transparent" style={{ width: `${OPEN_BAND}cqw` }} />
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${CARD.x}cqw`, top: `${Y}cqw`, width: `${CARD.w}cqw` }}
              initial={{ x: '70%', opacity: 0 }}
              animate={{ x: '-50%', opacity: 1, scale: 1.04 }}
              exit={{ x: '70%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 305, damping: 25 }}
            >
              <PortalCard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{sent && <LiquidBurst key="burst" origin={{ x: 100, y: Y }} edge="right" />}</AnimatePresence>

      <Drag
        path={path}
        duration={step === 1 ? STEPS[1] : step === 4 ? 0.9 : 0.01}
        carry={step === 1 ? 0.28 : step === 2 || step === 3 ? 0 : null}
        drop={released ? { x: CARD.x, y: Y - 2.6 } : null}
        file={file.kind}
      />
    </div>
  )
}

/** The colleague shown in the portal: orb, name, "Release to send" and which edge this is. */
function PortalCard() {
  return (
    <div className="rounded-[2cqw] p-px" style={{ background: SPECTRUM }}>
      <div className="flex flex-col items-center gap-[0.75cqw] rounded-[calc(2cqw-1px)] bg-black/[0.82] px-[1.7cqw] py-[1.55cqw]">
        <div
          className="relative grid size-[8.75cqw] place-items-center rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 0%, #333, #0f0f0f 70%)', boxShadow: `0 0 2cqw ${ACCENT}b3` }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: SPECTRUM,
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 0.2cqw), #000 calc(100% - 0.2cqw))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 0.2cqw), #000 calc(100% - 0.2cqw))',
            }}
          />
          <MacArt peer={PEERS.priya} glow="targeted" scale={0.75} />
        </div>
        <p className="text-[1.25cqw] font-semibold text-white">{PEERS.priya.name}</p>
        <p className="-mt-[0.4cqw] text-[0.98cqw] font-medium" style={{ color: CYAN }}>
          Release to send
        </p>
        <p className="flex items-center gap-[0.3cqw] text-[0.82cqw] font-medium text-white/50">
          <ArrowRightToLine className="size-[0.85cqw]" strokeWidth={2.2} /> Right edge
        </p>
      </div>
    </div>
  )
}
