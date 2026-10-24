import { useEffect } from 'react'
import { AnimatePresence, animate, cubicBezier, motion, useMotionValue, useTransform } from 'motion/react'
import { ArrowLeftRight, CircleCheck, Pointer } from 'lucide-react'
import MacWindow from '../../MacWindow'
import { useStoryboard } from '../../useStoryboard'
import { ACCENT, CYAN, FileGlyph, Header, LiquidBurst, MacArt, PEERS, SUCCESS, Stage, VIOLET } from './shared'

export const FRAME = { x: 13, y: 5.4, w: 74, h: 47.5 }
const CARD = { w: 13.5, gap: 2.1, top: 16.5 }
const ROW = 3 * CARD.w + 2 * CARD.gap
const cardLeft = (i) => (FRAME.w - ROW) / 2 + i * (CARD.w + CARD.gap)
const screenCentre = (i) => ({ x: cardLeft(i) + CARD.w / 2, y: CARD.top + 3.9 })

const MACS = [{ ...PEERS.me, you: true }, PEERS.priya, PEERS.alex]
const TARGET = 1

// The throw: a quadratic arc, raised by max(70pt, 0.32 × distance), on timingCurve(0.3, 0, 0.2, 1).
const from = screenCentre(0)
const to = screenCentre(TARGET)
const lift = Math.max(5.25, 0.32 * (to.x - from.x))
const control = { x: (from.x + to.x) / 2, y: from.y - lift }
const ARC = `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`
const throwEase = cubicBezier(0.3, 0, 0.2, 1)
const flight = Array.from({ length: 25 }, (_, i) => {
  const t = throwEase(i / 24)
  const u = 1 - t
  return { t, x: u * u * from.x + 2 * u * t * control.x + t * t * to.x, y: u * u * from.y + 2 * u * t * control.y + t * t * to.y }
})

// idle · drag over Priya · throw · sending · delivered
const STEPS = [1.1, 1.6, 1.0, 1.7, 2.3]

/** Drag a file from Finder onto a colleague's card; it arcs across and is delivered. */
export default function NearbyChapter() {
  const step = useStoryboard(STEPS)
  const hovering = step === 1
  const sending = step === 3
  const delivered = step === 4

  return (
    <div className="absolute inset-0">
      <MacWindow frame={FRAME} app="deskdrop" chrome="bare" className="bg-transparent">
        <Stage />
        <Header tab="nearby" />
        {MACS.map((mac, i) => (
          <MacCard key={mac.name} mac={mac} index={i} target={i === TARGET} hovering={hovering} sending={sending} delivered={delivered} />
        ))}
        <p className="absolute inset-x-0 bottom-[2.4cqw] flex items-center justify-center gap-[0.5cqw] text-[0.85cqw] text-white/40">
          <Pointer className="size-[1cqw]" strokeWidth={1.8} />
          Drag files from Finder onto a colleague’s Mac to send them, or click a Mac to choose files.
        </p>
        <Flight step={step} />
      </MacWindow>
      <AnimatePresence>{step === 2 && <LiquidBurst key="burst" origin={{ x: 100, y: 31 }} edge="right" />}</AnimatePresence>
    </div>
  )
}

function MacCard({ mac, index, target, hovering, sending, delivered }) {
  const over = target && hovering
  const landed = target && (sending || delivered)

  return (
    <motion.div
      className="absolute flex flex-col items-center rounded-[1.65cqw] border border-white/10 px-[1.05cqw] pt-[1.65cqw] pb-[1.2cqw]"
      style={{ left: `${cardLeft(index)}cqw`, top: `${CARD.top}cqw`, width: `${CARD.w}cqw` }}
      initial={false}
      animate={{
        scale: over ? 1.06 : landed && sending ? [1, 1.12, 1] : 1,
        backgroundColor: over ? 'rgba(76,143,255,0.28)' : 'rgba(255,255,255,0.06)',
        boxShadow: over ? `0 0 2cqw ${ACCENT}6b, inset 0 0 0 0.12cqw ${ACCENT}` : '0 0 0cqw rgba(0,0,0,0), inset 0 0 0 0cqw rgba(0,0,0,0)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <MacArt peer={mac} glow={over ? 'targeted' : mac.you ? 'local' : 'on'} />
      <div className="mt-[0.9cqw] flex items-center gap-[0.4cqw]">
        {mac.you && (
          <span className="rounded-full px-[0.4cqw] text-[0.75cqw] font-bold text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${VIOLET})` }}>
            You
          </span>
        )}
        <span className="text-[0.98cqw] font-semibold text-white/90">{mac.name}</span>
      </div>
      <div className="mt-[0.3cqw] flex h-[1.2cqw] items-center gap-[0.35cqw] text-[0.86cqw] text-white/55">
        <AnimatePresence mode="popLayout" initial={false}>
          {over ? (
            <motion.span key="release" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold" style={{ color: ACCENT }}>
              Release to send
            </motion.span>
          ) : (
            <motion.span key="status" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-[0.35cqw]">
              <span className="size-[0.5cqw] rounded-full" style={{ background: SUCCESS }} />
              {mac.you ? 'This Mac · Visible' : 'Available'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-[0.5cqw] flex h-[1.2cqw] items-center text-[0.8cqw]">
        <AnimatePresence mode="popLayout" initial={false}>
          {target && sending ? (
            <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-[0.3cqw] font-medium" style={{ color: ACCENT }}>
              <ArrowLeftRight className="size-[0.9cqw]" strokeWidth={2.2} />
              Sending <Percent />
            </motion.span>
          ) : target && delivered ? (
            <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-[0.3cqw] font-medium" style={{ color: SUCCESS }}>
              <CircleCheck className="size-[0.9cqw]" strokeWidth={2.2} />
              Delivered
            </motion.span>
          ) : (
            <motion.span key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-white/30">
              ID {['7F3A', 'B21C', '4E9D'][index]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function Percent() {
  const value = useMotionValue(0)
  const text = useTransform(value, (v) => `${Math.round(v)}%`)
  useEffect(() => {
    const controls = animate(value, 100, { duration: 1.5, ease: [0.4, 0, 0.6, 1] })
    return () => controls.stop()
  }, [value])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

/** Cursor, dragged file, the dotted arc and the throw itself, drawn in window coordinates. */
function Flight({ step }) {
  const dragIn = step === 1
  const throwing = step === 2
  const start = { x: 4, y: 44 }
  const hover = { x: to.x + 0.8, y: to.y + 0.4 }

  return (
    <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <defs>
        <linearGradient id="dd-arc" x1="0" x2="1">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.25" />
          <stop offset="1" stopColor={ACCENT} />
        </linearGradient>
        <linearGradient id="dd-trail" x1="0" x2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="1" stopColor={CYAN} stopOpacity="0.7" />
        </linearGradient>
        <filter id="dd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Dotted arc while a file hovers over a colleague: dots drift toward the recipient. */}
      <motion.path
        d={ARC}
        fill="none"
        stroke="url(#dd-arc)"
        strokeWidth="0.16"
        strokeLinecap="round"
        strokeDasharray="0.04 0.64"
        initial={false}
        animate={{ opacity: dragIn ? 1 : 0, strokeDashoffset: dragIn ? [0, -6.8] : 0 }}
        transition={{ opacity: { duration: 0.3 }, strokeDashoffset: { duration: 5, ease: 'linear', repeat: Infinity } }}
      />

      {throwing && (
        <motion.path
          d={ARC}
          fill="none"
          stroke="url(#dd-trail)"
          strokeWidth="0.22"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 0, opacity: 1 }}
          animate={{ pathLength: [0, 0.28, 0.28, 0], pathOffset: [0, 0.2, 0.72, 1], opacity: [1, 1, 1, 0] }}
          transition={{ duration: 0.85, ease: [0.3, 0, 0.2, 1], times: [0, 0.3, 0.85, 1] }}
        />
      )}

      {/* The file in flight: grows to 1.25×, shrinks to 0.65×, tilts with sin(πt). */}
      {throwing && (
        <motion.g
          initial={{ x: from.x, y: from.y, scale: 1, rotate: 0, opacity: 1 }}
          animate={{
            x: flight.map((p) => p.x),
            y: flight.map((p) => p.y),
            scale: flight.map((p) => (p.t < 0.18 ? 1 + (p.t / 0.18) * 0.25 : 1.25 - ((p.t - 0.18) / 0.82) * 0.6)),
            rotate: flight.map((p) => Math.sin(Math.PI * p.t) * 9),
            opacity: flight.map((p) => (p.t > 0.92 ? 1 - (p.t - 0.92) / 0.08 : 1)),
          }}
          transition={{ duration: 0.85, ease: 'linear' }}
        >
          <circle r="2" fill={ACCENT} opacity="0.45" filter="url(#dd-glow)" />
          <FileGlyph />
        </motion.g>
      )}

      {/* Dragging a file in from Finder. */}
      <motion.g
        initial={false}
        animate={dragIn ? { x: [start.x, hover.x], y: [start.y, hover.y], opacity: [0, 1] } : { x: hover.x, y: hover.y, opacity: 0 }}
        transition={dragIn ? { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], opacity: { duration: 0.2 } } : { duration: 0.15 }}
      >
        <g transform="translate(-0.6 -1.6) scale(0.8)" opacity="0.92">
          <FileGlyph />
        </g>
        <path d="M0 0v2.25l0.58-0.55 0.39 0.89 0.37-0.16-0.37-0.86h0.8z" fill="#fff" stroke="#000" strokeWidth="0.1" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}
