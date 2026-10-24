import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { AudioWaveform, CircleCheck, Hand, Info, Play, Settings, Square, Volume1, Volume2, Zap } from 'lucide-react'
import MacWindow, { TrafficLights } from '../MacWindow'
import { useDemo } from '../context'
import { useStoryboard } from '../useStoryboard'

// Colours from Extensions/Color+Extensions.swift
const LISTENING = '#33D66B'
const STOPPED = '#F24A4A'
const GRAPH = '#599EFF'

const FRAME = { x: 34, y: 3.6, w: 32, h: 51.6 }
const SAMPLES = 120 // 4 s of history at 30 Hz
const THRESHOLD = 0.38 // Medium

// open · slap · harder slap · calm
const STEPS = [1.3, 1.7, 1.7, 1.1]
const SLAPS = { 1: 0.81, 2: 0.96 }

const clock = () => {
  const d = new Date()
  const pad = (n, l = 2) => String(n).padStart(l, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

export default function SlapScene() {
  const step = useStoryboard(STEPS, { loopTo: 1 })
  const { shake } = useDemo()
  const [content, animateContent] = useAnimate()
  const [stats, setStats] = useState({ today: 12, strongest: 87 })
  const [log, setLog] = useState(() => [
    { kind: 'info', time: clock(), text: 'Selected detection method: Microphone Impact Analysis.' },
    { kind: 'ok', time: clock(), text: 'Listening...' },
  ])
  const [hit, setHit] = useState(0)
  const samples = useSamples()

  // A slap lands 0.3 s into its step: count it, log it, and shake everything.
  useEffect(() => {
    const strength = SLAPS[step]
    if (!strength) return
    const timer = setTimeout(() => {
      setHit((h) => h + 1)
      samples.inject(strength)
      setStats((s) => ({ today: s.today + 1, strongest: Math.max(s.strongest, Math.round(strength * 100)) }))
      setLog((l) => [...l.slice(-4), { kind: 'ok', time: clock(), text: `Impact detected — confidence ${strength > 0.9 ? 97 : 92}%.` }])
      if (content.current) {
        animateContent(content.current, { x: ['0%', '1.6%', '-1.6%', '1.6%', '0%'] }, { duration: 0.35, ease: 'linear' })
      }
      shake(strength)
    }, 300)
    return () => clearTimeout(timer)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0">
      <MacWindow frame={FRAME} app="slap-my-mac" chrome="bare">
        <div className="relative flex h-[2.6cqw] shrink-0 items-center border-b border-black/40 bg-[#2a2a2c] px-[1cqw]">
          <TrafficLights />
          <p className="absolute inset-x-0 text-center text-[0.95cqw] font-semibold text-white/80">Slap My Mac</p>
          <Settings className="ml-auto size-[1cqw] text-white/60" strokeWidth={2} />
        </div>
        <div ref={content} className="absolute inset-x-0 top-[2.6cqw] bottom-0 flex flex-col gap-[0.9cqw] bg-[#1e1e20] px-[1.3cqw] py-[1.1cqw] text-white">
          <div className="text-center">
            <p className="text-[2cqw] leading-none font-bold" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", -apple-system, sans-serif' }}>
              Slap My Mac
            </p>
            <p className="mx-auto mt-[0.45cqw] max-w-[90%] text-[0.62cqw] leading-snug text-white/50">
              Listening for sharp acoustic transients through the microphone and filtering out speech, typing, and steady background noise.
            </p>
          </div>

          <StatusPill flash={hit} />

          <div className="grid grid-cols-2 gap-[0.9cqw] text-[0.95cqw] font-semibold">
            <span className="flex items-center justify-center gap-[0.4cqw] rounded-[0.6cqw] py-[0.55cqw] opacity-40" style={{ background: LISTENING }}>
              <Play className="size-[0.95cqw]" fill="currentColor" /> Start
            </span>
            <span className="flex items-center justify-center gap-[0.4cqw] rounded-[0.6cqw] py-[0.55cqw]" style={{ background: STOPPED }}>
              <Square className="size-[0.85cqw]" fill="currentColor" /> Stop
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-[0.78cqw]">
              <span className="flex items-center gap-[0.35cqw] font-semibold">
                <AudioWaveform className="size-[0.9cqw]" strokeWidth={2.2} /> Sensitivity
              </span>
              <span className="text-white/50">Medium</span>
            </div>
            <Slider value={0.5} ticks={5} />
            <div className="mt-[0.2cqw] flex justify-between text-[0.58cqw] text-white/35">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          <div className="flex items-center gap-[0.6cqw]">
            <motion.span key={hit} initial={{ scale: 1 }} animate={{ scale: hit ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.45 }} className="grid size-[1.75cqw] place-items-center rounded-full" style={{ background: GRAPH }}>
              <Volume2 className="size-[1cqw]" strokeWidth={2.4} />
            </motion.span>
            <div className="leading-tight">
              <p className="text-[0.78cqw] font-semibold">Impact Sound</p>
              <p className="text-[0.62cqw] text-white/50">Default Slap</p>
            </div>
            <span className="ml-auto rounded-[0.4cqw] bg-white/10 px-[0.5cqw] py-[0.2cqw] text-[0.65cqw]">Choose Sound…</span>
            <span className="flex items-center gap-[0.2cqw] rounded-[0.4cqw] bg-white/10 px-[0.5cqw] py-[0.2cqw] text-[0.65cqw]">
              <Play className="size-[0.6cqw]" fill="currentColor" /> Test
            </span>
          </div>
          <div className="-mt-[0.4cqw] flex items-center gap-[0.5cqw] text-white/50">
            <Volume1 className="size-[0.8cqw]" />
            <Slider value={0.8} className="flex-1" />
            <Volume2 className="size-[0.8cqw]" />
            <span className="font-mono text-[0.6cqw]">80%</span>
          </div>

          <Graph samples={samples.values} />

          <div className="grid grid-cols-2 gap-[1.5cqw]">
            <Stat icon={Hand} value={stats.today} label="Slaps Today" />
            <Stat icon={Zap} value={`${stats.strongest}%`} label="Strongest Slap" />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-[0.75cqw] bg-white/[0.05] px-[0.7cqw] py-[0.5cqw] text-[0.6cqw]">
            <AnimatePresence initial={false}>
              {log.map((line) => (
                <motion.p
                  key={line.time + line.text}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-[0.4cqw] py-[0.12cqw]"
                >
                  {line.kind === 'ok' ? <CircleCheck className="size-[0.7cqw] shrink-0 text-[#30d158]" /> : <Info className="size-[0.7cqw] shrink-0 text-white/40" />}
                  <span className="shrink-0 font-mono text-white/40">{line.time}</span>
                  <span className="truncate text-white/75">{line.text}</span>
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </MacWindow>
      <SlapHand step={step} />
    </div>
  )
}

/** Microphone level history, scrolling right to left at 30 Hz. Impacts add a sharp spike. */
function useSamples() {
  const [values, setValues] = useState(() => Array.from({ length: SAMPLES }, () => 0.04 + Math.random() * 0.06))
  const pending = useRef([])

  useEffect(() => {
    const id = setInterval(() => {
      const next = pending.current.length ? pending.current.shift() : 0.04 + Math.random() * 0.07
      setValues((v) => [...v.slice(1), next])
    }, 33)
    return () => clearInterval(id)
  }, [])

  return {
    values,
    inject(strength) {
      // A transient: near-instant rise, quick decay. A threshold-crossing slap reaches ~67% height.
      const peak = 0.55 + strength * 0.4
      pending.current = [peak * 0.45, peak, peak * 0.7, peak * 0.42, peak * 0.25, peak * 0.15, 0.1]
    },
  }
}

function Graph({ samples }) {
  const points = samples.map((v, i) => `${(i / (SAMPLES - 1)) * 120},${100 - v * 100}`).join(' ')
  return (
    <div className="relative h-[7.6cqw] shrink-0 overflow-hidden rounded-[0.75cqw] bg-white/[0.05]">
      <svg viewBox="0 0 120 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="slap-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={GRAPH} stopOpacity="0.35" />
            <stop offset="1" stopColor={GRAPH} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 120,100`} fill="url(#slap-area)" />
        <line x1="0" x2="120" y1={(1 - THRESHOLD) * 100} y2={(1 - THRESHOLD) * 100} stroke="rgb(255 255 255 / 0.4)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <polyline points={points} fill="none" stroke={GRAPH} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

function StatusPill({ flash }) {
  return (
    <div className="flex justify-center">
      <span className="relative flex items-center gap-[0.55cqw] overflow-hidden rounded-full bg-white/[0.07] px-[1cqw] py-[0.5cqw] ring-1 ring-white/10">
        <span className="relative grid size-[0.75cqw] place-items-center">
          <span className="absolute size-[1.4cqw] animate-ping rounded-full opacity-35" style={{ background: LISTENING, animationDuration: '1.2s' }} />
          <span className="size-[0.75cqw] rounded-full" style={{ background: LISTENING }} />
        </span>
        <span className="text-[0.95cqw] font-semibold" style={{ color: LISTENING }}>
          Listening
        </span>
        <motion.span
          key={flash}
          className="absolute inset-0"
          style={{ background: LISTENING }}
          initial={{ opacity: flash ? 0.5 : 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </span>
    </div>
  )
}

function Slider({ value, ticks, className = '' }) {
  return (
    <div className={`relative mt-[0.45cqw] h-[0.9cqw] ${className}`}>
      <span className="absolute inset-x-0 top-1/2 h-[0.22cqw] -translate-y-1/2 rounded-full bg-white/15" />
      <span className="absolute top-1/2 left-0 h-[0.22cqw] -translate-y-1/2 rounded-full" style={{ width: `${value * 100}%`, background: GRAPH }} />
      {ticks &&
        Array.from({ length: ticks }, (_, i) => (
          <span key={i} className="absolute top-full h-[0.3cqw] w-px bg-white/25" style={{ left: `${(i / (ticks - 1)) * 100}%` }} />
        ))}
      <span className="absolute top-1/2 size-[0.9cqw] -translate-1/2 rounded-full bg-white shadow" style={{ left: `${value * 100}%` }} />
    </div>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-[0.55cqw] rounded-[0.6cqw] bg-white/[0.06] px-[0.75cqw] py-[0.5cqw]">
      <Icon className="size-[1.05cqw]" style={{ color: GRAPH }} fill="currentColor" strokeWidth={1.5} />
      <div className="leading-tight">
        <motion.p key={value} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[1cqw] font-semibold tabular-nums">
          {value}
        </motion.p>
        <p className="text-[0.58cqw] text-white/50">{label}</p>
      </div>
    </div>
  )
}

/** The slap itself: a hand swings in from the right and strikes the screen. */
function SlapHand({ step }) {
  const swinging = step === 1 || step === 2
  return (
    <AnimatePresence>
      {swinging && (
        <motion.div key={step} className="pointer-events-none absolute top-[18%] right-[6%] z-40" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.span
            className="block text-[10cqw] leading-none drop-shadow-[0_1.5cqw_2cqw_rgba(0,0,0,0.5)]"
            initial={{ x: '400%', rotate: 35, scale: 1.25, opacity: 0 }}
            animate={{ x: ['400%', '0%', '30%', '300%'], rotate: [35, -8, 0, 20], scale: [1.25, 1, 1.02, 1.1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.95, times: [0, 0.32, 0.5, 1], ease: ['easeIn', 'easeOut', 'easeIn'] }}
          >
            ✋
          </motion.span>
          <motion.span
            className="absolute top-1/2 left-1/3 size-[6cqw] -translate-1/2 rounded-full border-[0.3cqw] border-white/70"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.8], opacity: [0.9, 0] }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
