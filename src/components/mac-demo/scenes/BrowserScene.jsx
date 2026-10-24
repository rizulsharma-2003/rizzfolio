import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, PanelLeft, Plus, RotateCw, Share } from 'lucide-react'
import MacWindow, { TrafficLights } from '../MacWindow'
import ResearchFlowPage from './web/ResearchFlowPage'
import SharmaPage from './web/SharmaPage'
import JeePage from './web/JeePage'

const FRAME = { x: 4, y: 3.6, w: 92, h: 52 }

// One tab per web project, in the order the scroll reveals them.
const TABS = [
  { title: 'ResearchFlow — AI Content Studio', url: 'localhost:3000/dashboard/article/7f3a', dot: '#8366f4', Page: ResearchFlowPage },
  { title: 'Sharma Ice-Cream — Dashboard', url: 'localhost:3000/dashboard', dot: '#38bdf8', Page: SharmaPage },
  { title: 'JEE College Predictor', url: 'localhost:5173/predict', dot: '#ef233c', Page: JeePage },
]

export default function BrowserScene({ tab = 0 }) {
  const current = TABS[tab] ?? TABS[0]
  return (
    <div className="absolute inset-0">
      <MacWindow frame={FRAME} app="browser" chrome="bare" className="bg-[#1c1c1e]">
        <div className="relative flex h-[3.1cqw] shrink-0 items-center gap-[0.9cqw] bg-[#2a2a2c] px-[1cqw] text-white/55">
          <TrafficLights />
          <PanelLeft className="ml-[0.6cqw] size-[1cqw]" strokeWidth={1.8} />
          <ChevronLeft className="size-[1.1cqw]" strokeWidth={2} />
          <ChevronRight className="size-[1.1cqw] opacity-40" strokeWidth={2} />
          <div className="mx-auto flex w-[38cqw] items-center justify-center gap-[0.4cqw] rounded-[0.6cqw] bg-white/[0.08] py-[0.4cqw] text-[0.8cqw] text-white/75">
            <Lock className="size-[0.7cqw]" strokeWidth={2.2} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={current.url} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.2 }}>
                {current.url}
              </motion.span>
            </AnimatePresence>
            <RotateCw className="ml-auto mr-[0.6cqw] size-[0.75cqw] opacity-60" strokeWidth={2} />
          </div>
          <Share className="size-[1cqw]" strokeWidth={1.8} />
          <Plus className="size-[1.1cqw]" strokeWidth={1.8} />
        </div>

        <LayoutGroup id="browser-tabs">
          <div className="flex h-[2.3cqw] shrink-0 gap-[0.3cqw] border-b border-black/50 bg-[#232325] px-[0.6cqw] pt-[0.35cqw]">
            {TABS.map((t, i) => (
              <div key={t.title} className="relative flex min-w-0 flex-1 items-center gap-[0.45cqw] px-[0.8cqw] text-[0.72cqw]">
                {i === tab && <motion.span layoutId="active-tab" className="absolute inset-0 rounded-t-[0.5cqw] bg-[#3a3a3c]" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                <span className="relative size-[0.6cqw] shrink-0 rounded-full" style={{ background: t.dot }} />
                <span className={`relative truncate ${i === tab ? 'text-white/90' : 'text-white/45'}`}>{t.title}</span>
              </div>
            ))}
          </div>
        </LayoutGroup>

        <div className="absolute inset-x-0 top-[5.4cqw] bottom-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={tab}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <current.Page />
            </motion.div>
          </AnimatePresence>
        </div>
      </MacWindow>
    </div>
  )
}
