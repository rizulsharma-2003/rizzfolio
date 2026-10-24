import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Play, Plus } from 'lucide-react'
import DownloadButton from './DownloadButton'
import { CoverArt } from './ProjectArt'
import { Reveal } from './Reveal'
import Segmented from './Segmented'
import { kindOptions } from '../lib/kinds'
import { KINDS, projects } from '../data/projects'
import { DEMOS } from './mac-demo/scenes'
import { EASE_APPLE } from '../lib/motion'

/** Wide projects take a full row; a half-width tile left without a partner widens to fill its row. */
function arrange(items) {
  const rows = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const next = items[i + 1]
    if (!item.wide && next && !next.wide) {
      rows.push({ project: item, wide: false }, { project: next, wide: false })
      i++
    } else {
      rows.push({ project: item, wide: true })
    }
  }
  return rows
}

/** Apple homepage-style promo tiles: headline, two pills, and artwork that drifts as you scroll. */
export default function Projects({ onOpen, onDemo }) {
  const [kind, setKind] = useState('all')
  const visible = kind === 'all' ? projects : projects.filter((p) => p.kind === kind)

  return (
    <section id="work" className="relative px-3 pt-32 pb-24 md:pt-40">
      <Reveal className="mx-auto max-w-[980px] px-3 text-center">
        <h2 className="type-headline">Projects.</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 mb-10 flex justify-center px-3 md:mb-14">
        <Segmented id="work-filter" label="Filter projects" options={kindOptions(KINDS, projects)} value={kind} onChange={setKind} />
      </Reveal>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={kind}
          className="mx-auto grid max-w-[1680px] grid-cols-1 gap-3 md:grid-cols-2"
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE_APPLE } }}
        >
          {arrange(visible).map(({ project, wide }, i) => (
            <ProjectTile key={project.id} project={project} wide={wide} index={i} onOpen={onOpen} onDemo={onDemo} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ProjectTile({ project, wide, index, onOpen, onDemo }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%'])
  const eyebrow = project.isNew ? 'New' : (project.status ?? project.category)
  const accent = project.isNew || project.status

  return (
    <Reveal amount={0.15} delay={wide ? 0 : (index % 2) * 0.12} className={wide ? 'md:col-span-2' : undefined}>
      <article ref={ref} className="group relative isolate h-[560px] overflow-hidden rounded-[28px] bg-[#0a0a0b] md:h-[640px]">
        <motion.div style={{ y: artY }} className="absolute inset-x-0 -inset-y-[6%] -z-10">
          <div className="size-full transition-transform duration-[1400ms] ease-apple group-hover:scale-[1.04]">
            <CoverArt project={project} low />
          </div>
        </motion.div>

        <div className="px-6 pt-12 text-center md:pt-14">
          <p className={`type-eyebrow ${accent ? 'text-ember' : 'text-mute'}`}>{eyebrow}</p>
          <h3
            className={`mt-1 leading-[1.05] font-semibold tracking-[-0.025em] ${
              wide ? 'text-[44px] md:text-[64px]' : 'text-[40px] md:text-[48px]'
            }`}
          >
            {project.name}
          </h3>
          <p className="mt-1.5 text-[19px] leading-snug text-fog/85 md:text-[24px]">{project.tagline}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <button type="button" onClick={() => onOpen(project)} className="btn btn-primary">
              Learn more
            </button>
            <DownloadButton download={project.download} variant="outline" />
          </div>
        </div>

        {DEMOS[project.id] && (
          <button
            type="button"
            onClick={() => onDemo(project)}
            className="group/demo absolute bottom-5 left-5 flex items-center gap-2.5 rounded-full bg-[#333336]/80 py-1.5 pr-4 pl-1.5 text-[14px] font-medium text-fog backdrop-blur-xl transition-[background-color,transform] duration-300 hover:bg-[#48484c] active:scale-95"
          >
            <span className="grid size-7 place-items-center rounded-full bg-fog text-black transition-transform duration-500 ease-apple group-hover/demo:scale-110">
              <Play className="size-3.5 translate-x-px" fill="currentColor" strokeWidth={0} />
            </span>
            Watch demo
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`More about ${project.name}`}
          className="absolute right-5 bottom-5 grid size-9 place-items-center rounded-full bg-[#333336]/80 text-fog backdrop-blur-xl transition-[background-color,transform] duration-300 hover:bg-[#48484c] active:scale-90"
        >
          <Plus className="size-[18px] transition-transform duration-500 ease-apple group-hover:rotate-90" strokeWidth={2.5} />
        </button>
      </article>
    </Reveal>
  )
}
