import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ChevronRight, MapPin } from 'lucide-react'
import { Rise } from './Reveal'
import { AppIcon } from './ProjectArt'
import { site } from '../data/site'
import { featuredProject, projects } from '../data/projects'
import { useClock } from '../hooks/useClock'
import { EASE_OUT } from '../lib/motion'

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  // Scrolling away: the content sinks, shrinks and fades while the glow swells.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.45])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15])

  // Pointer parallax for the floating widgets.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 50, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 50, damping: 18 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5)
      pointerY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, pointerX, pointerY])

  const floating = { x: smoothX, y: smoothY, scroll: scrollYProgress }

  return (
    <section
      id="overview"
      ref={ref}
      className="relative isolate -mt-[52px] flex min-h-svh items-center justify-center overflow-hidden px-6 pt-[52px] pb-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <motion.div
          style={reduce ? undefined : { scale: glowScale, opacity: glowOpacity }}
          className="absolute top-1/2 left-1/2 size-[min(1100px,135vw)] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            className="hero-glow size-full rounded-full"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_OUT }}
          >
            <div className="hero-glow-spin size-full animate-spin-slow rounded-full" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* Floating widgets (large screens) */}
      <Floating {...floating} depth={34} delay={1.0} className="top-[16%] left-[6%]" float="animate-float-a">
        <ClockWidget />
      </Floating>
      <Floating {...floating} depth={-26} delay={1.15} className="top-[20%] right-[6%]" float="animate-float-b">
        <ShippedWidget />
      </Floating>
      <Floating {...floating} depth={-20} delay={1.3} className="bottom-[16%] left-[9%]" float="animate-float-c">
        <DownloadWidget />
      </Floating>
      <Floating {...floating} depth={28} delay={1.45} className="right-[9%] bottom-[18%]" float="animate-float-a">
        <ChartWidget />
      </Floating>

      <motion.div
        style={reduce ? undefined : { scale: contentScale, opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-[980px] text-center"
      >
        <h1>
          {/* Tracks in from wide and blurred, the way Apple introduces a product name. */}
          <motion.span
            className="type-hero text-gradient-silver block pb-[0.06em]"
            initial={{ opacity: 0, letterSpacing: '0.12em', filter: 'blur(18px)' }}
            animate={{ opacity: 1, letterSpacing: '-0.035em', filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.15, ease: EASE_OUT }}
          >
            {site.name}.
          </motion.span>
          <Rise as="span" delay={0.55} className="mt-2 block text-[clamp(26px,4.2vw,52px)] leading-[1.1] font-semibold tracking-[-0.025em]">
            {site.role}
          </Rise>
        </h1>

        <Rise delay={0.75}>
          <p className="type-lead mx-auto mt-6 max-w-[600px] text-mute">{site.intro}</p>
        </Rise>

        <Rise delay={0.9} className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a href="#demo" className="btn btn-primary">
            Watch the demo
          </a>
          <a href="#work" className="link-chevron text-[17px]">
            See all projects
            <ChevronRight className="size-4" strokeWidth={2.25} />
          </a>
        </Rise>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Floating({ x, y, scroll, depth, delay, className, float, children }) {
  const px = useTransform(x, (v) => v * depth)
  const py = useTransform(y, (v) => v * depth)
  const drift = useTransform(scroll, [0, 1], [0, depth * -5])

  return (
    <motion.div style={{ y: drift }} className={`pointer-events-none absolute hidden xl:block ${className}`}>
      <motion.div style={{ x: px, y: py }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay, ease: EASE_OUT }}
        >
          <div className={float}>{children}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function ClockWidget() {
  const time = useClock(site.timeZone)
  return (
    <div className="widget w-[196px]">
      <p className="widget-label">Local time</p>
      <p className="mt-1.5 text-[34px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{time}</p>
      <p className="mt-2.5 flex items-center gap-1 text-[12px] text-fog/60">
        <MapPin className="size-3" />
        {site.location}
      </p>
    </div>
  )
}

function ShippedWidget() {
  return (
    <div className="widget">
      <p className="widget-label">Recently shipped</p>
      <div className="mt-3 flex gap-2.5">
        {projects.slice(0, 4).map((p) => (
          <AppIcon key={p.id} project={p} className="size-11" />
        ))}
      </div>
    </div>
  )
}

function DownloadWidget() {
  const p = featuredProject
  return (
    <div className="widget w-[250px]">
      <div className="flex items-center gap-3">
        <AppIcon project={p} className="size-10" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">
            {p.name} {p.version}
          </p>
          <p className="text-[11px] text-fog/50">Downloading…</p>
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full origin-left animate-progress-loop rounded-full bg-link" />
      </div>
    </div>
  )
}

function ChartWidget() {
  return (
    <div className="widget w-[204px]">
      <p className="widget-label">Downloads this week</p>
      <div className="mt-3 flex h-16 items-end gap-2">
        {[0.45, 0.7, 0.55, 0.9, 0.65, 1, 0.8].map((h, i) => (
          <span
            key={i}
            className="flex-1 origin-bottom animate-bars rounded-[5px] bg-gradient-to-t from-ember to-[#ff9f0a]"
            style={{ height: `${h * 100}%`, animationDelay: `${i * -0.35}s` }}
          />
        ))}
      </div>
    </div>
  )
}
