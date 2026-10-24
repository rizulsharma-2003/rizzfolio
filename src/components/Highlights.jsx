import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import HighlightVisual from './HighlightVisual'
import { mesh } from './ProjectArt'
import { Reveal } from './Reveal'
import { site } from '../data/site'
import { EASE_APPLE, EASE_OUT } from '../lib/motion'

const SLIDE_SECONDS = 6
const CARD_WIDTH = 'min(1080px, 88vw)'

/**
 * "Get the highlights": a snapping gallery that plays itself while on screen.
 * The active dot stretches into a pill that fills over each slide's duration.
 */
export default function Highlights() {
  const items = site.highlights
  const section = useRef(null)
  const scroller = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(section, { amount: 0.45 })
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(!reduce)
  const [ended, setEnded] = useState(false)
  const progress = useMotionValue(0)
  const last = items.length - 1

  const goTo = useCallback(
    (i) => {
      const el = scroller.current
      const card = el?.children[i]
      if (!card) return
      el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
    },
    [reduce],
  )

  // Follow whichever card is centred — whether we scrolled there or the visitor swiped.
  useEffect(() => {
    const el = scroller.current
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const centre = el.scrollLeft + el.clientWidth / 2
        let nearest = 0
        let best = Infinity
        Array.from(el.children).forEach((card, i) => {
          const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre)
          if (distance < best) [nearest, best] = [i, distance]
        })
        setIndex(nearest)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // A new slide starts its timer from zero. (Must run before the autoplay effect below.)
  useEffect(() => {
    progress.set(0)
    if (index < last) setEnded(false)
  }, [index, last, progress])

  useEffect(() => {
    if (!playing || !inView) return
    const controls = animate(progress, 1, {
      duration: SLIDE_SECONDS * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => {
        if (index < last) goTo(index + 1)
        else {
          setPlaying(false)
          setEnded(true)
        }
      },
    })
    return () => controls.stop()
  }, [playing, inView, index, last, goTo, progress])

  const toggle = () => {
    if (ended) {
      setEnded(false)
      setPlaying(true)
      goTo(0)
    } else {
      setPlaying((p) => !p)
    }
  }

  const control = ended ? ['replay', RotateCcw, 'Replay'] : playing ? ['pause', Pause, 'Pause'] : ['play', Play, 'Play']
  const [controlKey, ControlIcon, controlLabel] = control

  return (
    <section id="expertise" ref={section} className="py-28 md:py-40" style={{ '--card': CARD_WIDTH }}>
      <Reveal className="mx-auto mb-10 w-[var(--card)] md:mb-14">
        <h2 className="type-headline">Get the highlights.</h2>
      </Reveal>

      <Reveal amount={0.1} y={60}>
        <div
          ref={scroller}
          aria-roledescription="carousel"
          aria-label="Highlights"
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100%_-_var(--card))/2)] md:gap-6"
        >
          {items.map((item, i) => {
            const active = i === index
            return (
              <article
                key={item.title}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${items.length}`}
                data-active={active}
                className="hl-card relative h-[min(680px,72svh)] min-h-[480px] w-[var(--card)] shrink-0 snap-center overflow-hidden rounded-[28px] bg-card"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0.4 }}
                  transition={{ duration: 0.8, ease: EASE_APPLE }}
                >
                  <div className="absolute inset-0 opacity-50" style={{ background: mesh(item.colors, { low: true }) }} />
                  <div className="absolute inset-0 grid place-items-center pt-28 md:pt-20">
                    <HighlightVisual item={item} active={active} />
                  </div>
                </motion.div>
                <motion.p
                  className="relative max-w-[600px] p-8 text-[21px] leading-[1.2] font-semibold tracking-[-0.015em] md:p-12 md:text-[28px]"
                  initial={false}
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 12 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <span className="text-fog">{item.title}</span> <span className="text-mute">{item.body}</span>
                </motion.p>
              </article>
            )
          })}
        </div>
      </Reveal>

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="flex h-14 items-center gap-3.5 rounded-full bg-[#2a2a2d]/80 px-6 backdrop-blur-xl">
          {items.map((item, i) => (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title.replace(/\.$/, '')}`}
              aria-current={i === index}
              className="relative h-2 overflow-hidden rounded-full bg-[#6e6e73] transition-colors hover:bg-[#8e8e93]"
              initial={false}
              animate={{ width: i === index ? 48 : 8 }}
              transition={{ duration: 0.5, ease: EASE_APPLE }}
            >
              {i === index && <motion.span className="absolute inset-0 origin-left rounded-full bg-fog" style={{ scaleX: progress }} />}
            </motion.button>
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={controlLabel}
          className="grid size-14 place-items-center rounded-full bg-[#2a2a2d]/80 text-fog backdrop-blur-xl transition-colors hover:bg-[#3a3a3d]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={controlKey}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ duration: 0.25 }}
            >
              <ControlIcon className="size-5" fill={controlKey === 'replay' ? 'none' : 'currentColor'} strokeWidth={controlKey === 'replay' ? 2.25 : 0} />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </section>
  )
}
