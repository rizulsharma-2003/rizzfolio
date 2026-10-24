import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, usePresence, useReducedMotion } from 'motion/react'
import { DOCK, dock } from './geometry'
import { genie } from './genie'

// New windows wait until the previous app's minimise is mostly done, as on a real Mac.
const LAUNCH_DELAY = 0.45
const OPEN_DURATION = 0.62
const CLOSE_DURATION = 0.7

/**
 * A macOS window. Windows of Dock apps open and close with the genie effect;
 * `launch="fade"` is for windows of apps that aren't in the Dock.
 *
 * frame    { x, y, w, h } in cqw
 * app      Dock item it belongs to
 * chrome   'titlebar' (traffic lights + title) | 'bare' (content draws its own top)
 * active   key window — inactive windows get grey traffic lights
 * inner    motion props for the window body, positioned in % of the frame
 *          (demos animate left/top/width/height to move and resize it)
 */
export default function MacWindow({
  frame,
  app,
  launch = 'dock',
  title,
  chrome = 'titlebar',
  active = true,
  delay = 0,
  zIndex,
  className = '',
  inner = {},
  children,
}) {
  const outer = useRef(null)
  const body = useRef(null)
  const effect = useRef(null)
  const [isPresent, safeToRemove] = usePresence()
  const reduce = useReducedMotion()
  const useGenie = launch === 'dock' && !reduce

  const run = (from, to, duration, { onStart, onDone }) => {
    const layer = outer.current?.parentElement
    if (!layer || !body.current) return onDone?.()
    const unit = layer.offsetWidth / 100 // px per cqw
    const slot = dock.slots[app] ?? dock.slots.trash
    effect.current = genie({
      source: body.current,
      layer,
      icon: { x: slot.x * unit, y: slot.y * unit, size: DOCK.icon * unit },
      from,
      to,
      duration,
      onStart,
      onDone,
    })
  }

  // Launch: pour out of the Dock icon, then hand over to the live window.
  useLayoutEffect(() => {
    if (!useGenie) return
    const el = outer.current
    el.style.visibility = 'hidden'
    const timer = setTimeout(() => run(1, 0, OPEN_DURATION, { onDone: () => (el.style.visibility = '') }), (LAUNCH_DELAY + delay) * 1000)
    return () => {
      clearTimeout(timer)
      effect.current?.cancel()
      el.style.visibility = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close: pour back into the Dock, picking up wherever a launch had got to.
  useEffect(() => {
    if (isPresent) return
    if (!useGenie) return safeToRemove()
    const launching = effect.current
    const from = launching ? launching.t : 0
    launching?.cancel()
    const notStarted = !launching && outer.current?.style.visibility === 'hidden'
    if (notStarted) return safeToRemove()
    const el = outer.current
    run(from, 1, CLOSE_DURATION * (1 - from) + 0.05, {
      onStart: () => (el.style.visibility = 'hidden'),
      onDone: safeToRemove,
    })
  }, [isPresent]) // eslint-disable-line react-hooks/exhaustive-deps

  const fade = {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.35 } },
  }

  return (
    <motion.div
      ref={outer}
      className="absolute"
      style={{ left: `${frame.x}cqw`, top: `${frame.y}cqw`, width: `${frame.w}cqw`, height: `${frame.h}cqw`, zIndex }}
      {...(useGenie ? {} : fade)}
    >
      <motion.div
        ref={body}
        {...inner}
        style={{ left: '0%', top: '0%', width: '100%', height: '100%', ...inner.style }}
        className={`absolute flex flex-col overflow-hidden rounded-[1.1cqw] bg-[#1e1e20] shadow-[0_2.5cqw_6cqw_-1cqw_rgba(0,0,0,0.75)] ring-1 ring-white/[0.12] ${className}`}
      >
        {chrome === 'titlebar' && <TitleBar title={title} active={active} />}
        <div className="relative min-h-0 flex-1">{children}</div>
      </motion.div>
    </motion.div>
  )
}

const LIGHTS = ['#ff5f57', '#febc2e', '#28c840']

export function TrafficLights({ active = true, className = '' }) {
  return (
    <div className={`flex gap-[0.55cqw] ${className}`}>
      {LIGHTS.map((c) => (
        <motion.span
          key={c}
          className="size-[0.85cqw] rounded-full"
          style={{ boxShadow: 'inset 0 0 0 0.05cqw rgb(0 0 0 / 0.25)' }}
          initial={false}
          animate={{ backgroundColor: active ? c : '#4b4b4f' }}
          transition={{ duration: 0.15 }}
        />
      ))}
    </div>
  )
}

export function TitleBar({ title, active = true, children, className = '' }) {
  return (
    <div className={`relative flex h-[2.7cqw] shrink-0 items-center border-b border-black/40 bg-[#2a2a2c] px-[1cqw] ${className}`}>
      <TrafficLights active={active} />
      {title && (
        <p
          className={`pointer-events-none absolute inset-x-0 text-center text-[1cqw] font-semibold transition-colors ${
            active ? 'text-white/80' : 'text-white/35'
          }`}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  )
}
