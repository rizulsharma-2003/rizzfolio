import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, cubicBezier, motion, useAnimate, useMotionValue, useTransform } from 'motion/react'
import { ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react'
import Desktop from './Desktop'
import Laptop from './Laptop'
import Shutter from './Shutter'
import { DemoContext } from './context'
import { DEMOS, SCENES } from './scenes'
import DownloadButton from '../DownloadButton'
import { AppIcon } from '../ProjectArt'
import { projects } from '../../data/projects'
import { useScrollLock } from '../../hooks/useScrollLock'
import { EASE_APPLE, EASE_OUT, SPRING } from '../../lib/motion'

const ORDER = Object.keys(DEMOS)
const LAPTOP_WIDTH = 'min(1100px, 92vw, calc((100svh - 230px) * 1.6))'

/**
 * A full-screen player for one app's demo: the MacBook rises in, the app launches
 * from the Dock, and the visitor can replay it or step to the next app.
 */
export default function DemoPlayer({ projectId, onClose, onChange }) {
  return (
    <AnimatePresence>
      {projectId && DEMOS[projectId] && <Player key="player" projectId={projectId} onClose={onClose} onChange={onChange} />}
    </AnimatePresence>
  )
}

function Player({ projectId, onClose, onChange }) {
  const demo = DEMOS[projectId]
  const project = projects.find((p) => p.id === projectId)
  const scene = demo.scene ? SCENES[demo.scene] : null
  const index = ORDER.indexOf(projectId)
  const [ready, setReady] = useState(false)
  const [run, setRun] = useState(0)
  const closeButton = useRef(null)
  const [laptop, animateLaptop] = useAnimate()
  useScrollLock(true)

  // Let the MacBook settle before the app launches.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 650)
    return () => clearTimeout(timer)
  }, [])

  const step = useCallback((dir) => onChange(ORDER[(index + dir + ORDER.length) % ORDER.length]), [index, onChange])

  useEffect(() => {
    const returnFocusTo = document.activeElement
    closeButton.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      returnFocusTo?.focus?.({ preventScroll: true })
    }
  }, [onClose, step])

  // Mac Shutter: the door rolls up over 5 s on its own curve, as in the app.
  const door = useMotionValue(0)
  const doorY = useTransform(door, (v) => `${v}%`)
  useEffect(() => {
    door.set(0)
    if (!demo.shutter || !ready) return
    const controls = animate(door, -101, { duration: 5, delay: 0.5, ease: cubicBezier(0.2, 0, 0.6, 1) })
    return () => controls.stop()
  }, [demo.shutter, ready, run, door])

  const shake = useCallback(
    (strength = 1) => {
      if (!laptop.current) return
      const s = strength * 7
      animateLaptop(laptop.current, { x: [0, s, -s, s * 0.6, -s * 0.3, 0] }, { duration: 0.45, ease: 'easeOut' })
    },
    [laptop, animateLaptop],
  )
  const context = useMemo(() => ({ shake }), [shake])
  const sceneKey = `${demo.scene ?? 'shutter'}-${run}`

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} demo`}
      className="fixed inset-0 z-[120] flex flex-col bg-black/85 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE_APPLE } }}
      transition={{ duration: 0.35, ease: EASE_APPLE }}
    >
      <div className="flex items-center gap-3 px-5 pt-5 md:px-8 md:pt-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            className="flex min-w-0 items-center gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <AppIcon project={project} className="size-9 md:size-10" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[17px] font-semibold md:text-[19px]">{project.name}</p>
              <p className="truncate text-[13px] text-mute md:text-[14px]">{project.tagline}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close demo"
          className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-fog/80 transition-colors hover:bg-white/20 hover:text-fog"
        >
          <X className="size-[18px]" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <motion.div
          style={{ width: LAPTOP_WIDTH }}
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.3 } }}
          transition={SPRING}
        >
          <div ref={laptop}>
            <Laptop>
              <Desktop
                app={ready ? scene?.app : undefined}
                menuIcon={ready ? scene?.menuIcon : undefined}
                overlay={demo.shutter && <Shutter y={doorY} />}
              >
                <DemoContext.Provider value={context}>
                  <AnimatePresence>{ready && scene && <scene.Component key={sceneKey} tab={demo.tab} />}</AnimatePresence>
                </DemoContext.Provider>
              </Desktop>
            </Laptop>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4 pt-4 pb-6 md:pb-8">
        <div className="flex items-center gap-2">
          <RoundButton label="Previous app" onClick={() => step(-1)}>
            <ChevronLeft className="size-5" strokeWidth={2.25} />
          </RoundButton>
          <span className="min-w-[56px] text-center text-[14px] text-fog/60 tabular-nums sm:hidden">
            {index + 1} of {ORDER.length}
          </span>
          <div className="hidden items-center gap-1.5 rounded-full bg-white/[0.07] p-1.5 sm:flex">
            {ORDER.map((id) => {
              const p = projects.find((x) => x.id === id)
              const selected = id === projectId
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(id)}
                  aria-label={`${p.name} demo`}
                  aria-current={selected ? 'true' : undefined}
                  className={`relative grid size-8 place-items-center rounded-full transition-opacity ${selected ? '' : 'opacity-45 hover:opacity-90'}`}
                >
                  {selected && <motion.span layoutId="player-dot" className="absolute inset-0 rounded-full bg-white/15" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <AppIcon project={p} className="relative size-5" />
                </button>
              )
            })}
          </div>
          <RoundButton label="Next app" onClick={() => step(1)}>
            <ChevronRight className="size-5" strokeWidth={2.25} />
          </RoundButton>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[14px] font-medium text-fog/85 transition-colors hover:bg-white/20 hover:text-fog"
          >
            <motion.span key={run} initial={{ rotate: 0 }} animate={{ rotate: run ? -360 : 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
              <RotateCcw className="size-4" strokeWidth={2.25} />
            </motion.span>
            Replay
          </button>
          <DownloadButton download={project.download} variant="outline" size="sm" />
        </div>
      </div>
    </motion.div>
  )
}

function RoundButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-white/10 text-fog/85 transition-[background-color,transform] hover:bg-white/20 hover:text-fog active:scale-90"
    >
      {children}
    </button>
  )
}
