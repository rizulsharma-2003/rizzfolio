import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  cubicBezier,
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ChevronsDown } from 'lucide-react'
import Desktop from './Desktop'
import { dockApp } from './apps'
import Shutter from './Shutter'
import Laptop from './Laptop'
import { DemoContext } from './context'
import { SCENES } from './scenes'
import DownloadButton from '../DownloadButton'
import { AppIcon } from '../ProjectArt'
import { projects } from '../../data/projects'
import { EASE_APPLE, EASE_OUT, clamp01, smoothstep } from '../../lib/motion'

/**
 * The story, in scroll order. `len` is how much scrolling (in vh) each part gets.
 * Scenes are looked up in ./scenes by id.
 */
const SEGMENTS = [
  { id: 'intro', len: 130 },
  { id: 'mac-shutter', len: 95, project: 'mac-shutter', icon: 'mac-shutter' },
  { id: 'deskdrop', len: 320, parts: 4, project: 'deskdrop', icon: 'deskdrop' },
  { id: 'boing', len: 100, project: 'boing', icon: 'boing' },
  { id: 'pointer-switch', len: 100, project: 'pointer-switch', icon: 'pointer-switch' },
  { id: 'slap-my-mac', len: 100, project: 'slap-my-mac', icon: 'slap-my-mac' },
  { id: 'running-devices', len: 100, project: 'running-devices', icon: 'code' },
  { id: 'web', len: 170, tabs: ['research-flow', 'sharma-ice-cream', 'jee-predictor'], icon: 'browser', label: 'Web apps' },
  { id: 'outro', len: 45 },
]
const TOTAL = SEGMENTS.reduce((sum, s) => sum + s.len, 0)
let cursor = 0
for (const s of SEGMENTS) {
  s.start = cursor / TOTAL
  s.end = (cursor + s.len) / TOTAL
  cursor += s.len
}
const CHAPTERS = SEGMENTS.filter((s) => s.project || s.tabs)
const byId = (id) => SEGMENTS.find((s) => s.id === id)
const projectById = (id) => projects.find((p) => p.id === id)

const locate = (p) => SEGMENTS.find((s) => p < s.end) ?? SEGMENTS.at(-1)
const local = (p, s) => clamp01((p - s.start) / (s.end - s.start))
const partsOf = (s) => s.tabs?.length ?? s.parts ?? 0
const tabAt = (p, s) => Math.min(partsOf(s) - 1, Math.floor(local(p, s) * partsOf(s)))

// Fits the laptop plus the chapter strip and caption inside one screen, below the sticky nav.
const LAPTOP_WIDTH = 'min(900px, 94vw, max(280px, calc((100svh - 390px) * 1.6)))'
const NAV_HEIGHT = 52
const shutterEase = cubicBezier(0.2, 0, 0.6, 1)

/**
 * The Mac theatre: the laptop zooms out, a metal shutter rolls up, and each Mac app
 * launches from the Dock, plays a short demo and minimises as the next one opens.
 */
export default function MacDemo({ onOpen }) {
  const section = useRef(null)
  const screen = useRef(null)
  const reduce = useReducedMotion()
  const cover = useMotionValue(2.5)
  const [laptop, animateLaptop] = useAnimate()

  // Scenes can jolt the whole MacBook (Slap My Mac does).
  const shake = useCallback(
    (strength = 1) => {
      if (reduce || !laptop.current) return
      const s = strength * 7
      animateLaptop(laptop.current, { x: [0, s, -s, s * 0.6, -s * 0.3, 0], rotate: [0, -0.35 * strength, 0.35 * strength, -0.15 * strength, 0] }, { duration: 0.45, ease: 'easeOut' })
    },
    [reduce, laptop, animateLaptop],
  )
  const demo = useMemo(() => ({ shake }), [shake])
  const [state, setState] = useState({ segment: reduce ? 'deskdrop' : 'intro', tab: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const { offsetWidth: w, offsetHeight: h } = screen.current
      cover.set(Math.max(window.innerWidth / w, (window.innerHeight + NAV_HEIGHT) / h) * 1.08)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [cover])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0002 })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return
    const s = locate(p)
    const tab = partsOf(s) ? tabAt(p, s) : 0
    setState((prev) => (prev.segment === s.id && prev.tab === tab ? prev : { segment: s.id, tab }))
  })

  const intro = byId('intro')
  const shutterSeg = byId('mac-shutter')
  const scale = useTransform([smooth, cover], ([p, c]) => c + (1 - c) * smoothstep(clamp01(local(p, intro) / 0.9)))
  const introOpacity = useTransform(smooth, [intro.start + 0.004, intro.start + (intro.end - intro.start) * 0.3], [1, 0])
  const chromeOpacity = useTransform(smooth, [intro.start + (intro.end - intro.start) * 0.7, intro.end], [0, 1])
  const shutterY = useTransform(
    smooth,
    [shutterSeg.start + (shutterSeg.end - shutterSeg.start) * 0.08, shutterSeg.start + (shutterSeg.end - shutterSeg.start) * 0.85],
    ['0%', '-101%'],
    { ease: shutterEase },
  )
  const segmentProgress = useTransform(scrollYProgress, (p) => local(p, locate(p)))

  // Which scene is on screen: the outro keeps the last one open.
  const segment = byId(state.segment)
  const sceneId = segment.id === 'outro' ? 'web' : segment.id
  const scene = SCENES[sceneId]
  const tabs = byId('web').tabs
  const project = segment.tabs || segment.id === 'outro' ? projectById(tabs[state.tab]) : projectById(segment.project)

  const scrollToSegment = (id) => {
    const s = byId(id)
    if (reduce) {
      setState({ segment: id, tab: 0 })
      return
    }
    const el = section.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const distance = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + distance * (s.start + (s.end - s.start) * 0.12), behavior: 'smooth' })
  }
  const skip = () => {
    const el = section.current
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight + 2, behavior: 'smooth' })
  }

  return (
    <section
      ref={section}
      id="demo"
      aria-label="Live demo of my Mac apps"
      className="relative"
      style={{ height: reduce ? 'auto' : `${TOTAL + 100}vh` }}
    >
      <div className={`${reduce ? 'relative py-56' : 'sticky top-0 h-svh overflow-hidden pt-[52px]'} flex items-center justify-center`}>
        <motion.div
          aria-hidden
          style={reduce ? undefined : { opacity: chromeOpacity }}
          className="pointer-events-none absolute top-1/2 left-1/2 size-[min(1300px,150vw)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(111,124,240,0.18),transparent)]"
        />

        <div className="relative" style={{ width: LAPTOP_WIDTH }}>
          <motion.div
            style={reduce ? undefined : { opacity: chromeOpacity }}
            className="absolute bottom-full left-1/2 mb-6 w-[min(96vw,980px)] -translate-x-1/2 md:mb-9"
          >
            <Chapters active={segment.id === 'outro' ? 'web' : segment.id} progress={segmentProgress} onSelect={scrollToSegment} />
          </motion.div>

          <div ref={laptop}>
            <motion.div style={reduce ? undefined : { scale }} className="origin-[50%_48%]">
              <Laptop screenRef={screen}>
                <Desktop app={scene?.app} menuIcon={scene?.menuIcon} overlay={!reduce && <Shutter y={shutterY} />}>
                  <DemoContext.Provider value={demo}>
                    <AnimatePresence>{scene && <scene.Component key={sceneId} tab={state.tab} />}</AnimatePresence>
                  </DemoContext.Provider>
                </Desktop>
              </Laptop>
            </motion.div>
          </div>

          <motion.div
            style={reduce ? undefined : { opacity: chromeOpacity }}
            className="absolute top-full left-1/2 mt-6 w-[min(92vw,680px)] -translate-x-1/2 text-center md:mt-9"
          >
            <Caption project={project} onOpen={onOpen} />
          </motion.div>
        </div>

        {!reduce && (
          <>
            <motion.div
              aria-hidden
              style={{ opacity: introOpacity }}
              className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 px-6 text-center"
            >
              <p className="type-display">Meet the Mac apps.</p>
            </motion.div>

            <motion.button
              type="button"
              onClick={skip}
              style={{ opacity: chromeOpacity }}
              className="absolute right-4 bottom-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-fog/85 backdrop-blur-xl transition-colors hover:bg-white/20 hover:text-fog md:right-8 md:bottom-8"
            >
              Skip demo
              <ChevronsDown className="size-4" strokeWidth={2.25} />
            </motion.button>
          </>
        )}
      </div>
    </section>
  )
}

function Chapters({ active, progress, onSelect }) {
  return (
    <LayoutGroup id="mac-demo-chapters">
      <nav aria-label="Demo chapters" className="flex justify-center">
        <ul className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.07] p-1">
          {CHAPTERS.map((c) => {
            const selected = c.id === active
            const app = dockApp(c.icon)
            const label = c.label ?? projectById(c.project)?.name
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={selected ? 'step' : undefined}
                  aria-label={label}
                  className={`relative flex items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 lg:px-3 ${
                    selected ? 'text-fog' : 'text-fog/55 hover:text-fog'
                  }`}
                >
                  {selected && (
                    <motion.span layoutId="chapter" transition={{ type: 'spring', stiffness: 380, damping: 34 }} className="absolute inset-0 overflow-hidden rounded-full bg-white/[0.12]">
                      <motion.span className="absolute inset-0 origin-left bg-white/[0.08]" style={{ scaleX: progress }} />
                    </motion.span>
                  )}
                  <AppIcon project={app} className="relative size-5" />
                  <span className="relative hidden lg:inline">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </LayoutGroup>
  )
}

function Caption({ project, onOpen }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={project?.id ?? 'none'}
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } }}
        exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.22, ease: EASE_APPLE } }}
      >
        {project && (
          <>
            <p className="text-[19px] leading-snug md:text-[21px]">
              <span className="font-semibold">{project.name}.</span> <span className="text-mute">{project.tagline}</span>
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => onOpen(project)} className="btn btn-primary btn-sm">
                Learn more
              </button>
              <DownloadButton download={project.download} variant="outline" size="sm" />
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
