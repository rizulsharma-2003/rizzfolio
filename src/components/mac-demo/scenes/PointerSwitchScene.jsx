import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import MacWindow from '../MacWindow'
import { Cursor } from '../Desktop'
import { SCREEN_H } from '../geometry'
import { useStoryboard } from '../useStoryboard'

const EDITOR = { x: 3, y: 4.6, w: 51, h: 34 }
const TERMINAL = { x: 56.5, y: 6, w: 40.5, h: 23 }
const SETTINGS = { x: 56.5, y: 31.5, w: 40.5, h: 23.5 }

// Where focus can go, and the head pose that looks there.
const TARGETS = {
  left: { x: 15.8, y: 23, yaw: -21.4, pitch: -3.1, gaze: '(212, 438)', screen: 91 },
  right: { x: 41.3, y: 23, yaw: -6.2, pitch: -2.4, gaze: '(604, 431)', screen: 88 },
  term: { x: 76.8, y: 18, yaw: 18.7, pitch: -6.0, gaze: '(1186, 302)', screen: 93 },
}
const PLAN = ['left', 'term', 'right', 'left']
const STEPS = [1.2, 2.2, 2.2, 2.0]
const SETTLE = 0.75 // seconds: the 300 ms dwell plus the head turn

export default function PointerSwitchScene() {
  const step = useStoryboard(STEPS, { loopTo: 1, delay: 0.7 })
  const looking = PLAN[Math.max(step, 0)]
  const [focus, setFocus] = useState('left')
  const [visits, setVisits] = useState({ left: 0, right: 0, term: 0 })

  // Focus follows the head only after the gaze has settled.
  useEffect(() => {
    if (step < 0) return
    const timer = setTimeout(() => {
      setFocus(looking)
      setVisits((v) => ({ ...v, [looking]: v[looking] + 1 }))
    }, SETTLE * 1000)
    return () => clearTimeout(timer)
  }, [step, looking])

  const gaze = TARGETS[looking]
  const pointer = TARGETS[focus]

  return (
    <div className="absolute inset-0">
      <MacWindow frame={EDITOR} app="code" launch="fade" title="FocusCoordinator.swift — pointer-switch" active={focus !== 'term'} zIndex={focus === 'term' ? 1 : 3}>
        <div className="absolute inset-0 grid grid-cols-2 divide-x divide-black/50 bg-[#1f1f22]">
          <Pane file="AppController.swift" lines={LEFT_CODE} focused={focus === 'left'} typed="    tracker.start()" visit={visits.left} />
          <Pane file="FocusCoordinator.swift" lines={RIGHT_CODE} focused={focus === 'right'} typed="        await focus.move(to: pane)" visit={visits.right} />
        </div>
      </MacWindow>

      <MacWindow frame={TERMINAL} app="code" launch="fade" delay={0.1} title="zsh — pointer-switch" active={focus === 'term'} zIndex={focus === 'term' ? 3 : 1}>
        <div className="absolute inset-0 bg-[#141416] p-[1cqw] font-mono text-[0.78cqw] leading-[1.55] text-white/80">
          <p className="text-white/40">Last login: Fri Oct 24 on ttys001</p>
          <p>
            <span className="text-[#5ac8fa]">~/pointer-switch</span> <span className="text-[#bf5af2]">main</span> <span className="text-[#30d158]">❯</span>{' '}
            <Typed text="swift test" play={focus === 'term'} visit={visits.term} caret={focus === 'term'} />
          </p>
          {visits.term > 0 && (
            <TermOutput key={visits.term} />
          )}
        </div>
      </MacWindow>

      <MacWindow frame={SETTINGS} app="pointer-switch" title="Pointer Switch Settings" active={false} zIndex={2} delay={0.15}>
        <CameraSettings pose={gaze} />
      </MacWindow>

      {/* The optional gaze dot: red at 45% with a 90% ring, gliding to where you look. */}
      <motion.span
        className="absolute z-40 size-[1.4cqw] -translate-1/2 rounded-full border-[0.16cqw] border-[#ff3b30]/90 bg-[#ff3b30]/45"
        initial={false}
        animate={{ left: `${gaze.x}%`, top: `${(gaze.y / SCREEN_H) * 100}%`, opacity: step < 0 ? 0 : 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      {/* The pointer warps instantly: there's no animation in the app either. */}
      <Cursor initial={false} animate={{ left: `${pointer.x}%`, top: `${(pointer.y / SCREEN_H) * 100}%` }} transition={{ duration: 0 }} />
    </div>
  )
}

// One array per line of code: [kind, text] tokens.
const LEFT_CODE = [
  [['k', 'final class '], ['t', 'AppController {']],
  [],
  [['p', '  let tracker = HeadTracker()']],
  [['p', '  let focus = FocusCoordinator()']],
  [],
  [['k', '  func '], ['f', 'launch() {']],
]
const RIGHT_CODE = [
  [['k', 'actor '], ['t', 'FocusCoordinator {']],
  [],
  [['k', '  func '], ['f', 'didSettle(on target: Target) async {']],
  [['p', '    guard !typing.isActive else { return }']],
  [['k', '    let '], ['p', 'pane = layout.pane(at: target)']],
]

const COLOURS = { k: '#ff7ab2', t: '#5dd8ff', f: '#67b7a4', p: '#e5e5ea' }

function Pane({ file, lines: rows, focused, typed, visit }) {
  return (
    <div className="relative min-w-0 overflow-hidden">
      <div className={`flex h-[2cqw] items-center border-b border-black/50 px-[0.9cqw] text-[0.75cqw] ${focused ? 'bg-[#2b2b2f] text-white/85' : 'bg-[#232326] text-white/40'}`}>
        {file}
      </div>
      <div className="p-[0.9cqw] font-mono text-[0.74cqw] leading-[1.7] whitespace-pre">
        {rows.map((r, i) => (
          <p key={i} className="min-h-[1.26cqw]">
            <span className="mr-[0.8cqw] inline-block w-[1cqw] text-right text-white/20">{i + 1}</span>
            {r.map(([kind, text], j) => (
              <span key={j} style={{ color: COLOURS[kind] }}>
                {text}
              </span>
            ))}
          </p>
        ))}
        <p className="min-h-[1.26cqw] text-[#e5e5ea]">
          <span className="mr-[0.8cqw] inline-block w-[1cqw] text-right text-white/20">{rows.length + 1}</span>
          <Typed text={typed} play={focused} visit={visit} caret={focused} />
        </p>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={{ backgroundColor: focused ? 'rgba(10,132,255,0)' : 'rgba(0,0,0,0.18)' }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}

/** Types `text` once each time the pane gains focus. */
function Typed({ text, play, visit, caret }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!play || visit === 0) return
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [play, visit, text])
  return (
    <>
      {text.slice(0, count)}
      {caret && <span className="ml-px inline-block h-[0.95cqw] w-[0.12cqw] translate-y-[0.15cqw] animate-blink bg-[#5ac8fa]" />}
    </>
  )
}

function TermOutput() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
      <p className="text-white/50">Building for debugging…</p>
      <p className="text-white/50">Test Suite ‘All tests’ started</p>
      <p className="text-[#30d158]">✔ Executed 42 tests, with 0 failures in 1.84s</p>
    </motion.div>
  )
}

/** The Camera section of Pointer Switch's settings: live preview, face box and pose readout. */
function CameraSettings({ pose }) {
  const turn = pose.yaw / 25 // -1…1
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#232326] px-[1.2cqw] py-[0.9cqw] text-[0.8cqw] text-white/85">
      <p className="text-[0.68cqw] font-semibold tracking-wide text-white/40 uppercase">Camera</p>
      <div className="mt-[0.5cqw] flex items-center justify-between rounded-[0.5cqw] bg-white/[0.06] px-[0.8cqw] py-[0.45cqw]">
        <span>Camera</span>
        <span className="flex items-center gap-[0.3cqw] text-white/60">
          Automatic (prefer external) <ChevronDown className="size-[0.8cqw]" />
        </span>
      </div>
      <div className="mt-[0.6cqw] flex gap-[1cqw]">
        <div className="relative h-[9.5cqw] w-[15cqw] shrink-0 overflow-hidden rounded-[0.6cqw] bg-black">
          <svg viewBox="0 0 160 100" className="absolute inset-0 size-full">
            <defs>
              <radialGradient id="ps-skin" cx="45%" cy="40%" r="60%">
                <stop offset="0" stopColor="#5b5b63" />
                <stop offset="1" stopColor="#2a2a30" />
              </radialGradient>
            </defs>
            <rect width="160" height="100" fill="#0b0b0d" />
            <path d="M40 100 Q80 70 120 100" fill="#26262c" />
            <motion.g initial={false} animate={{ x: turn * 9 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
              <ellipse cx="80" cy="47" rx="19" ry="25" fill="url(#ps-skin)" />
              <motion.g initial={false} animate={{ x: turn * 7 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
                <ellipse cx="73" cy="44" rx="2.6" ry="1.6" fill="#0b0b0d" />
                <ellipse cx="87" cy="44" rx="2.6" ry="1.6" fill="#0b0b0d" />
                <path d="M80 47 l-2 8 h4" fill="none" stroke="#1a1a1f" strokeWidth="1.2" />
                <path d="M75 62 q5 2 10 0" fill="none" stroke="#1a1a1f" strokeWidth="1.4" strokeLinecap="round" />
              </motion.g>
              <rect x="57" y="18" width="46" height="58" rx="6" fill="none" stroke="#30d158" strokeWidth="2" />
            </motion.g>
          </svg>
        </div>
        <div className="min-w-0 space-y-[0.35cqw] pt-[0.2cqw] font-mono text-[0.68cqw] leading-snug text-white/70 tabular-nums">
          <p>
            Yaw {fmt(pose.yaw)}°  Pitch {fmt(pose.pitch)}°
          </p>
          <p>Roll +0.4°</p>
          <p>Face 23%  Confidence 95%</p>
          <p className="text-white/50">Gaze: Built-in Retina</p>
          <p className="text-white/50">
            {pose.gaze} · {pose.screen}%
          </p>
        </div>
      </div>
    </div>
  )
}

const fmt = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`
