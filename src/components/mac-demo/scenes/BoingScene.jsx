import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Magnet, Undo2, Wind } from 'lucide-react'
import MacWindow, { TrafficLights } from '../MacWindow'
import { Cursor } from '../Desktop'
import { SCREEN_H } from '../geometry'
import { useStoryboard } from '../useStoryboard'

// Boing's accent and the three practice windows (Tour/PracticeApp.swift), at 0.065cqw per point.
const ACCENT = '#8578FF'
const WINDOWS = [
  { id: 'throw', title: 'Throw me', subtitle: 'Hold ⌃⌥, drag me and let go mid-swing', colors: ['#408CFF', '#7359FF'], frame: { x: 13.85, y: 17, w: 24.7, h: 18.2 } },
  { id: 'snap', title: 'Snap me', subtitle: 'Hold ⌃⌥ and drag me to a screen edge', colors: ['#FF5999', '#BF4DFF'], frame: { x: 40.89, y: 13, w: 22.1, h: 19.5 } },
  { id: 'drop', title: 'Drop us', subtitle: 'Press ⌃⌥⌘↓ and watch us fall', colors: ['#FF9933', '#FF5959'], frame: { x: 65.33, y: 18.5, w: 20.8, h: 15.6 } },
]
const [A, B, C] = WINDOWS.map((w) => w.frame)
const FLOOR = 56.2
const RIGHT_HALF = { x: 50.4, y: 2.8, w: 49.2, h: FLOOR - 2.8 }

/** A rectangle on screen, expressed relative to a window's home frame. */
const place = (f, r) => ({
  left: `${((r.x - f.x) / f.w) * 100}%`,
  top: `${((r.y - f.y) / f.h) * 100}%`,
  width: `${(r.w / f.w) * 100}%`,
  height: `${(r.h / f.h) * 100}%`,
})
const at = (f, x, y, size = f) => place(f, { x, y, w: size.w, h: size.h })

// idle · grab · throw · drag to edge · snap · gravity · undo
const STEPS = [1.0, 0.8, 1.7, 1.1, 1.4, 2.0, 1.8]
const SPRING_SNAP = { type: 'spring', stiffness: 273, damping: 23.8 }
const SPRING_BACK = { type: 'spring', stiffness: 200, damping: 22 }

const fall = (delay) => ({
  duration: 0.8,
  delay,
  times: [0, 0.6, 0.78, 1],
  ease: ['easeIn', 'easeOut', 'easeIn'],
})

/** Where each practice window goes, and how, at every step of the demo. */
function choreography(step) {
  const restA = at(A, 2.5, 15.2)
  const floorA = at(A, 2.5, FLOOR - A.h)
  const floorB = at(B, 52, FLOOR - B.h, B)
  const floorC = at(C, 76, FLOOR - C.h)
  const dropTo = (f, target, delay) => ({
    animate: { ...target, top: [null, target.top, `${parseFloat(target.top) - 6}%`, target.top], scaleY: [1, 1, 0.9, 1] },
    transition: { ...fall(delay), left: SPRING_SNAP, width: SPRING_SNAP, height: SPRING_SNAP },
    origin: '50% 100%',
  })
  const home = (f, delay) => ({ animate: { ...place(f, f), scaleX: 1, scaleY: 1 }, transition: { ...SPRING_BACK, delay } })

  return [
    // A — thrown at the left edge, squashes against it and springs back
    step === 2
      ? {
          animate: {
            left: ['0%', '4%', '-56%', '-56%', restA.left],
            top: ['0%', '2%', '-12%', '-12%', restA.top],
            scaleX: [1, 1, 1, 0.86, 1],
            scaleY: [1, 1, 1, 1.05, 1],
          },
          transition: { duration: 1.4, times: [0, 0.15, 0.48, 0.6, 1], ease: ['easeOut', [0.2, 0.8, 0.3, 1], 'easeOut', 'backOut'] },
          origin: '0% 50%',
        }
      : step === 3 || step === 4
        ? { animate: { ...restA, scaleX: 1, scaleY: 1 }, transition: { duration: 0 } }
        : step === 5
          ? dropTo(A, floorA, 0)
          : home(A, 0),
    // B — dragged to the right edge, then snaps into the right half
    step === 3
      ? { animate: at(B, 74, 9), transition: { duration: 0.75, delay: 0.35, ease: [0.4, 0, 0.2, 1] } }
      : step === 4
        ? { animate: { ...place(B, RIGHT_HALF), scaleX: [1, 0.97, 1.015, 1] }, transition: { ...SPRING_SNAP, scaleX: { duration: 0.5, delay: 0.35 } } }
        : step === 5
          ? dropTo(B, floorB, 0.05)
          : home(B, 0.04),
    // C — just falls with the others
    step === 5 ? dropTo(C, floorC, 0.1) : home(C, 0.08),
  ]
}

const CURSOR = [
  { x: [55], y: [48] },
  { x: [55, 26], y: [48, 21.5], duration: 0.7 },
  { x: [26, 29, 11], y: [21.5, 22, 17.5], duration: 0.6, times: [0, 0.3, 1] },
  { x: [11, 52, 85], y: [17.5, 14.6, 10.6], duration: 1.1, times: [0, 0.32, 1] },
  { x: [85], y: [10.6] },
  { x: [85, 60], y: [10.6, 30], duration: 0.6 },
  { x: [60], y: [30] },
]

const HUD = [
  null,
  null,
  { icon: Wind, text: 'Throw' },
  { icon: Magnet, text: 'Magnetic Snap' },
  { icon: Magnet, text: 'Right Half' },
  { icon: ArrowDown, text: 'Gravity ↓ · 3 windows dropped' },
  { icon: Undo2, text: 'Undo · 3 windows put back' },
]

// Faces react to what's happening to their window.
const MOODS = {
  2: { throw: [['gasp', 0], ['squished', 0.8], ['happy', 1.25]] },
  4: { snap: [['alert', 0], ['squished', 0.35], ['happy', 0.8]] },
  5: {
    throw: [['alert', 0], ['squished', 0.5], ['happy', 0.95]],
    snap: [['alert', 0.05], ['squished', 0.55], ['happy', 1]],
    drop: [['alert', 0.1], ['squished', 0.6], ['happy', 1.05]],
  },
}

export default function BoingScene() {
  const step = useStoryboard(STEPS, { loopTo: 1 })
  const moves = choreography(step)
  const cursor = CURSOR[Math.max(step, 0)]
  const hud = HUD[step]

  return (
    <div className="absolute inset-0">
      <SnapPreview show={step === 3 || step === 4} />
      <EdgeGlow play={step === 2} />

      {WINDOWS.map((w, i) => (
        <MacWindow
          key={w.id}
          frame={w.frame}
          app="boing"
          chrome="bare"
          delay={i * 0.12}
          zIndex={(step === 3 || step === 4) && i === 1 ? 5 : step === 2 && i === 0 ? 5 : 1}
          className="bg-transparent"
          inner={{
            animate: moves[i].animate,
            transition: moves[i].transition,
            style: { transformOrigin: moves[i].origin ?? '50% 50%' },
          }}
        >
          <PracticeCard window={w} step={step} look={lookFor(w.frame, cursor)} />
        </MacWindow>
      ))}

      <Cursor
        initial={false}
        animate={{ left: cursor.x.map((x) => `${x}%`), top: cursor.y.map((y) => `${(y / SCREEN_H) * 100}%`) }}
        transition={{ duration: cursor.duration ?? 0, times: cursor.times, ease: 'easeInOut' }}
      />

      <div className="absolute inset-x-0 top-[5cqw] z-40 flex justify-center">
        <AnimatePresence mode="wait">
          {hud && (
            <motion.div
              key={hud.text}
              initial={{ opacity: 0, y: '1.1cqw' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-0.6cqw' }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="flex items-center gap-[0.6cqw] rounded-full bg-[#2a2a30]/90 px-[1.3cqw] py-[0.6cqw] text-[1.05cqw] font-semibold text-white shadow-[0_0.8cqw_2cqw_rgba(0,0,0,0.4)] ring-1 ring-white/15"
            >
              <hud.icon className="size-[1.2cqw]" style={{ color: ACCENT }} strokeWidth={2.4} />
              {hud.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Unit vector from a window's centre toward the cursor, so the eyes can follow it. */
function lookFor(frame, cursor) {
  const cx = cursor.x.at(-1)
  const cy = cursor.y.at(-1)
  const dx = cx - (frame.x + frame.w / 2)
  const dy = cy - (frame.y + frame.h / 2)
  const len = Math.hypot(dx, dy) || 1
  return { x: dx / len, y: dy / len }
}

function PracticeCard({ window: w, step, look }) {
  const mood = useMood(step, w.id)
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[0.35cqw] rounded-[inherit] text-white"
      style={{ background: `radial-gradient(70% 60% at 15% 10%, rgb(255 255 255 / 0.35), transparent 60%), linear-gradient(135deg, ${w.colors[0]}, ${w.colors[1]})` }}
    >
      <TrafficLights className="absolute top-[0.8cqw] left-[0.9cqw] scale-[0.85] origin-top-left" />
      <Face mood={mood} look={look} />
      <p className="text-[1.55cqw] leading-none font-bold" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", -apple-system, sans-serif' }}>
        {w.title}
      </p>
      <p className="max-w-[90%] text-center text-[0.8cqw] font-medium text-white/85" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", -apple-system, sans-serif' }}>
        {w.subtitle}
      </p>
    </div>
  )
}

function useMood(step, id) {
  const [mood, setMood] = useState('happy')
  useEffect(() => {
    const plan = MOODS[step]?.[id]
    if (!plan) {
      setMood('happy')
      return
    }
    const timers = plan.map(([m, t]) => setTimeout(() => setMood(m), t * 1000))
    return () => timers.forEach(clearTimeout)
  }, [step, id])
  return mood
}

/** The practice-window face: eyes that follow the pointer, a mouth that changes with the mood. */
function Face({ mood, look }) {
  const big = mood === 'gasp'
  const r = big ? 17 : 14
  const pupil = { x: look.x * r * 0.42, y: look.y * r * 0.42 }
  return (
    <svg viewBox="0 0 120 92" className="w-[7.8cqw] overflow-visible">
      {[31, 89].map((cx, i) =>
        mood === 'squished' ? (
          <path
            key={cx}
            d={i === 0 ? `M${cx - 9} 26 L${cx + 7} 34 L${cx - 9} 42` : `M${cx + 9} 26 L${cx - 7} 34 L${cx + 9} 42`}
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <g key={cx} className="boing-blink" style={{ animationDelay: `${i * 0.02 + (cx % 7) * 0.4}s` }}>
            <motion.circle cx={cx} cy="34" fill="#fff" initial={false} animate={{ r }} transition={{ type: 'spring', stiffness: 320, damping: 18 }} />
            <motion.circle
              cx={cx}
              cy="34"
              r={r * 0.45}
              fill="#111"
              initial={false}
              animate={{ x: pupil.x, y: pupil.y }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            />
          </g>
        ),
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.g
          key={mood}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {mood === 'happy' && <path d="M46 68 Q60 80 74 68" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />}
          {mood === 'alert' && <rect x="49" y="70" width="22" height="6" rx="3" fill="#fff" />}
          {mood === 'gasp' && <ellipse cx="60" cy="74" rx="8" ry="10" fill="#2a1446" stroke="#fff" strokeWidth="3" />}
          {mood === 'squished' && (
            <path d="M44 72 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}

/** Boing's snap preview: a tile tinted with the theme colour, labelled with where it lands. */
function SnapPreview({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute z-0 grid place-items-center rounded-[1.25cqw] border-[0.12cqw] border-white/60"
          style={{
            left: `${RIGHT_HALF.x}cqw`,
            top: `${RIGHT_HALF.y}cqw`,
            width: `${RIGHT_HALF.w}cqw`,
            height: `${RIGHT_HALF.h}cqw`,
            background: `${ACCENT}29`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 270, damping: 28, delay: 0.75 } }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.25 } }}
        >
          <span className="rounded-full bg-[#2a2a30]/85 px-[1cqw] py-[0.45cqw] text-[0.95cqw] font-semibold text-white ring-1 ring-white/15">
            Right Half
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** The glow where a thrown window hits the edge of the screen. */
function EdgeGlow({ play }) {
  return (
    <AnimatePresence>
      {play && (
        <motion.span
          className="absolute left-0 z-30 h-[18cqw] w-[7cqw]"
          style={{ top: `${A.y - 4}cqw`, background: `radial-gradient(60% 50% at 0% 50%, ${ACCENT}8c, ${ACCENT}2e 55%, transparent 80%)`, transformOrigin: '0% 50%' }}
          initial={{ opacity: 0, scaleY: 0.55 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0.55, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.62, times: [0, 0.18, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
