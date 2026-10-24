import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, BookOpen, CircleCheck, Circle, Clock, LayoutDashboard, Loader, PenLine, Settings, Sparkles, Terminal, Zap } from 'lucide-react'

// lib/constants.ts
const STAGES = [
  'Keyword Analysis',
  'Competitor Research',
  'Deep Research',
  'Outline Generation',
  'Article Draft',
  'Humanization Pass',
  'SEO Package',
  'Quality Review',
  'Final Compilation',
]
const STREAMS = [
  '## Why admissions are changing\n- AI reads essays at scale\n- Predicted cutoffs shape choices\n## What students should do',
  '# How AI is reshaping college admissions in India\n\nEvery year, more than twelve lakh students sit JEE Main. This year, the',
]
const ACTIVITY = ['Structuring H2 sections…', 'Balancing depth and length…', 'Writing the introduction…', 'Citing research findings…']

const VIOLET = '#8366f4'

export default function ResearchFlowPage() {
  const [running, setRunning] = useState(3) // index of the stage in progress
  const [chars, setChars] = useState(0)

  // Stream text into the running stage, then move on to the next.
  useEffect(() => {
    const text = STREAMS[running - 3] ?? ''
    setChars(0)
    let n = 0
    const id = setInterval(() => {
      n += 3
      setChars(n)
      if (n >= text.length) {
        clearInterval(id)
        if (running < 4) setTimeout(() => setRunning((r) => r + 1), 450)
      }
    }, 38)
    return () => clearInterval(id)
  }, [running])

  const done = running
  const percent = Math.round((done / STAGES.length) * 100)
  const stream = (STREAMS[running - 3] ?? '').slice(0, chars)

  return (
    <div className="absolute inset-0 flex bg-[#05080f] text-[#e1e7ef]" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <aside className="flex w-[14cqw] shrink-0 flex-col border-r border-[#151e32] bg-[#0a0f1a] p-[1cqw]">
        <div className="flex items-center gap-[0.6cqw]">
          <span className="grid size-[2cqw] place-items-center rounded-[0.5cqw]" style={{ background: `${VIOLET}33` }}>
            <Sparkles className="size-[1.1cqw]" style={{ color: VIOLET }} />
          </span>
          <div className="leading-tight">
            <p className="text-[0.9cqw] font-bold text-white">ResearchFlow</p>
            <p className="text-[0.62cqw] text-[#7588a3]">AI Content Studio</p>
          </div>
        </div>
        <nav className="mt-[1.4cqw] space-y-[0.2cqw] text-[0.75cqw] text-[#7588a3]">
          {[
            [LayoutDashboard, 'Dashboard'],
            [PenLine, 'New Article'],
            [Clock, 'History'],
            [Settings, 'Settings'],
          ].map(([Icon, label]) => (
            <p key={label} className="flex items-center gap-[0.6cqw] rounded-[0.5cqw] px-[0.6cqw] py-[0.45cqw]">
              <Icon className="size-[0.9cqw]" /> {label}
            </p>
          ))}
        </nav>
        <div className="mt-auto rounded-[0.7cqw] border border-white/10 bg-white/5 p-[0.7cqw]">
          <p className="flex items-center gap-[0.4cqw] text-[0.72cqw] font-semibold">
            <BookOpen className="size-[0.85cqw]" style={{ color: VIOLET }} /> 9-Stage Pipeline
          </p>
          <p className="mt-[0.3cqw] text-[0.58cqw] leading-snug text-[#7588a3]">Keyword → Research → Outline → Draft → Humanize → SEO → Quality</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-[1.3cqw]">
        <div className="flex items-start gap-[1cqw]">
          <span className="flex items-center gap-[0.3cqw] rounded-[0.5cqw] px-[0.5cqw] py-[0.3cqw] text-[0.72cqw] text-[#7588a3]">
            <ArrowLeft className="size-[0.85cqw]" /> Back
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-[0.6cqw]">
              <span className="flex items-center gap-[0.3cqw] rounded-full bg-blue-500/20 px-[0.6cqw] py-[0.15cqw] text-[0.65cqw] text-blue-400">
                <Loader className="size-[0.7cqw] animate-spin" /> Running
              </span>
              <span className="truncate text-[1.2cqw] font-semibold">How AI is reshaping college admissions in India</span>
            </p>
            <p className="mt-[0.3cqw] text-[0.68cqw] text-[#7588a3]">ai college admissions · India · Created 2m ago</p>
          </div>
          <p className="ml-auto shrink-0 text-[0.72cqw] text-[#7588a3] tabular-nums">
            {done}/9 stages · {percent}%
          </p>
        </div>

        <div className="mt-[1.2cqw] grid grid-cols-[25cqw_1fr] gap-[1.2cqw]">
          <div>
            <p className="flex items-center gap-[0.4cqw] text-[0.62cqw] font-semibold tracking-wider text-[#7588a3] uppercase">
              Pipeline <span className="ml-[0.4cqw] size-[0.45cqw] animate-pulse rounded-full bg-blue-500" />
              <span className="tracking-normal normal-case">Live</span>
            </p>
            <div className="mt-[0.5cqw] flex justify-between text-[0.65cqw] text-[#7588a3]">
              <span>
                Stage {running + 1}/9 — {STAGES[running].toLowerCase()}
              </span>
              <span className="tabular-nums">{percent}%</span>
            </div>
            <div className="mt-[0.3cqw] h-[0.35cqw] overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            <div className="mt-[0.7cqw] space-y-[0.35cqw]">
              {STAGES.map((stage, i) => (
                <Stage key={stage} label={stage} state={i < running ? 'done' : i === running ? 'running' : 'pending'} stream={i === running ? stream : ''} index={i} />
              ))}
            </div>
          </div>

          <div className="space-y-[1cqw]">
            <div className="grid place-items-center rounded-[0.75cqw] border border-white/10 bg-white/[0.03] py-[2.4cqw] text-center">
              <span className="relative grid size-[4.6cqw] place-items-center rounded-[1cqw]" style={{ background: `${VIOLET}26` }}>
                <Loader className="size-[2cqw] animate-spin" style={{ color: VIOLET }} />
                <span className="absolute -top-[0.4cqw] -right-[0.6cqw] rounded-full px-[0.35cqw] text-[0.55cqw] font-semibold text-white tabular-nums" style={{ background: VIOLET }}>
                  {percent}%
                </span>
              </span>
              <p className="mt-[0.9cqw] text-[0.9cqw] font-semibold">Pipeline running…</p>
              <p className="mt-[0.3cqw] max-w-[26cqw] text-[0.68cqw] text-[#7588a3]">
                Watch the pipeline progress on the left. The article will appear here once generation is complete.
              </p>
            </div>
            <Log running={running} />
          </div>
        </div>
      </main>
    </div>
  )
}

function Stage({ label, state, stream, index }) {
  const running = state === 'running'
  const done = state === 'done'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, layout: { duration: 0.35 } }}
      className={`rounded-[0.55cqw] border px-[0.6cqw] py-[0.32cqw] ${
        running ? 'border-blue-500/40 bg-blue-500/5 shadow-[0_0_1cqw_rgba(59,130,246,0.15)]' : done ? 'border-emerald-500/30' : 'border-[#151e32]/30'
      }`}
    >
      <div className="flex items-center gap-[0.5cqw] text-[0.7cqw]">
        {done ? (
          <CircleCheck className="size-[0.85cqw] text-emerald-400" />
        ) : running ? (
          <Loader className="size-[0.85cqw] animate-spin text-blue-400" />
        ) : (
          <Circle className="size-[0.85cqw] text-[#7588a3]/50" />
        )}
        <span className={done ? 'text-emerald-400' : running ? 'text-blue-300' : 'text-[#7588a3]/60'}>{label}</span>
        <span className="ml-auto text-[0.6cqw] text-[#7588a3]/70">
          {running ? (
            <span className="flex items-center gap-[0.3cqw] tabular-nums">
              <Zap className="size-[0.65cqw] text-blue-400" /> Live · {(stream.length * 17).toLocaleString()} chars
            </span>
          ) : done ? (
            'Done'
          ) : (
            'Waiting…'
          )}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {running && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Activity />
            <p className="mt-[0.3cqw] text-[0.52cqw] font-semibold tracking-wider text-[#7588a3] uppercase">Output stream</p>
            <pre className="mt-[0.2cqw] h-[3.4cqw] overflow-hidden rounded-[0.4cqw] bg-black/30 p-[0.4cqw] font-mono text-[0.58cqw] leading-snug whitespace-pre-wrap text-[#cbd5e1]">
              {stream || 'Waiting for first token…'}
              <span className="ml-px inline-block h-[0.7cqw] w-[0.1cqw] translate-y-[0.1cqw] animate-blink bg-blue-400" />
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Activity() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ACTIVITY.length), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-[0.25cqw] text-[0.58cqw] text-[#7588a3]">
        {ACTIVITY[i]}
      </motion.p>
    </AnimatePresence>
  )
}

function Log({ running }) {
  const lines = [
    '▶ [10:42:01 AM] STAGE_COMPLETED [deep_research]: 14 sources',
    '▶ [10:42:02 AM] STAGE_STARTED [outline_generation]: Starting Outline Generation...',
    running > 3 && '▶ [10:42:09 AM] STAGE_STARTED [article_draft]: Starting Article Draft...',
  ].filter(Boolean)
  return (
    <div className="rounded-[0.75cqw] border border-white/10 bg-white/5 p-[0.8cqw]">
      <p className="flex items-center gap-[0.4cqw] text-[0.7cqw] font-semibold">
        <Terminal className="size-[0.8cqw]" /> Pipeline Log
        <span className="ml-auto flex gap-[0.25cqw]">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} className="size-[0.45cqw] rounded-full" style={{ background: c }} />
          ))}
        </span>
      </p>
      <div className="mt-[0.5cqw] space-y-[0.2cqw] font-mono text-[0.56cqw] text-[#7588a3]">
        {lines.map((line) => (
          <motion.p key={line} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="truncate">
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
