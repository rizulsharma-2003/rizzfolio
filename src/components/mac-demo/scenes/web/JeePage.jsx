import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'

const RED = '#ef233c'
const DISPLAY = { fontFamily: '"Bebas Neue", "Arial Narrow", sans-serif', letterSpacing: '0.02em' }
const STAMP = { fontFamily: '"Special Elite", "Courier New", monospace' }
const RANK = '25000'

// Real rows from backend/data/cutoffs.csv (General, Gender-Neutral, 2025).
// Chance rule (utils/chance.js): closing ≥ rank × 1.15 → Safe, closing ≥ rank → Border.
const RESULTS = [
  { body: 'AKTU', institute: 'Institute Of Engineering & Technology, Lucknow', program: 'Computer Science And Engineering', quota: 'Uttar Pradesh', open: 13599, close: 33715, round: 2 },
  { body: 'JOSAA', institute: 'IIIT Kota, Rajasthan', program: 'Computer Science And Engineering', quota: 'All India', open: 15209, close: 25011, round: 2 },
  { body: 'JOSAA', institute: 'National Institute Of Technology Agartala', program: 'Electronics And Communication Engineering', quota: 'Other State', open: 20215, close: 25164, round: 1 },
]
const chance = (close) => (close >= 25000 * 1.15 ? 'Safe' : close >= 25000 ? 'Border' : 'Reach')
const CHANCE_STYLE = {
  Safe: 'text-green-400 bg-green-500/10 ring-green-500/30',
  Border: 'text-amber-400 bg-amber-500/10 ring-amber-500/30',
  Reach: 'text-red-400 bg-red-500/10 ring-red-500/30',
}
const TABS = [
  ['All', 412],
  ['JoSAA', 268],
  ['JAC Delhi', 41],
  ['IPU', 63],
  ['AKTU', 40],
]

export default function JeePage() {
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState('typing') // typing · loading · results

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(i)
      if (i >= RANK.length) {
        clearInterval(id)
        setTimeout(() => setPhase('loading'), 300)
        setTimeout(() => setPhase('results'), 950)
      }
    }, 140)
    return () => clearInterval(id)
  }, [])

  const rank = RANK.slice(0, typed)

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black text-white"
      style={{
        fontFamily: 'Manrope, -apple-system, sans-serif',
        backgroundImage: [
          `radial-gradient(45% 50% at 15% 0%, ${RED}38, transparent 70%)`,
          `radial-gradient(40% 45% at 100% 100%, ${RED}26, transparent 70%)`,
          'linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px)',
          'linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, auto, 3cqw 3cqw, 3cqw 3cqw',
      }}
    >
      <nav className="mx-auto mt-[0.9cqw] flex w-fit items-center gap-[1.6cqw] rounded-full border border-white/10 bg-zinc-900/70 py-[0.4cqw] pr-[0.5cqw] pl-[0.9cqw]">
        <span className="flex items-center gap-[0.6cqw]">
          <span className="size-[1cqw] rotate-12 rounded-[0.15cqw]" style={{ background: RED }} />
          <span className="leading-none">
            <span className="block text-[0.5cqw] text-white/60" style={STAMP}>
              JEE 2026
            </span>
            <span className="block text-[1.05cqw]" style={DISPLAY}>
              College Predictor
            </span>
          </span>
        </span>
        <span className="flex items-center gap-[0.3cqw] text-[0.7cqw] text-white/60">
          <span className="rounded-full px-[0.8cqw] py-[0.3cqw] text-white" style={{ background: RED }}>
            Predict
          </span>
          {['Percentile', 'Colleges', 'About'].map((l) => (
            <span key={l} className="px-[0.6cqw] py-[0.3cqw]">
              {l}
            </span>
          ))}
        </span>
      </nav>

      <p className="mt-[1cqw] text-center text-[2.2cqw] leading-none" style={DISPLAY}>
        Predict your best college options.
      </p>

      <div className="mx-[1.6cqw] mt-[1.2cqw] grid grid-cols-[22cqw_1fr] gap-[1.2cqw]">
        <div className="rounded-[1cqw] border border-white/10 bg-zinc-900/60 p-[1cqw]">
          <p className="text-[0.55cqw] tracking-widest text-white/40 uppercase">Search setup</p>
          <div className="flex items-center justify-between">
            <p className="text-[1.4cqw] leading-tight" style={DISPLAY}>
              Filters
            </p>
            <span className="rounded-full px-[0.6cqw] py-[0.15cqw] text-[0.6cqw] text-white/50 ring-1 ring-white/15">Reset</span>
          </div>

          <Field label="Your JEE Main Rank (CRL)">
            <div className="rounded-[0.6cqw] bg-white/5 px-[0.7cqw] py-[0.5cqw] text-[0.85cqw] ring-1" style={{ '--tw-ring-color': phase === 'typing' ? RED : 'rgb(255 255 255 / 0.1)' }}>
              {rank || <span className="text-white/30">e.g. 25000</span>}
              {phase === 'typing' && <span className="ml-px inline-block h-[0.85cqw] w-[0.1cqw] translate-y-[0.1cqw] animate-blink bg-white/80" />}
            </div>
            <p className="mt-[0.25cqw] text-[0.55cqw] text-white/35">Enter your all India CRL rank</p>
          </Field>
          <Field label="Category">
            <Select value="General" />
          </Field>
          <Field label="Round mode">
            <Select value="All Rounds" />
          </Field>
          <Field label="Counselling">
            <div className="space-y-[0.3cqw]">
              {['JoSAA (IITs, NITs, IIITs, GFTIs)', 'JAC Delhi (DTU, NSUT, IGDTUW, IIITD)', 'IPU (GGSIPU colleges)', 'AKTU (UP Colleges)'].map((c) => (
                <p key={c} className="flex items-center gap-[0.4cqw] text-[0.6cqw] text-white/75">
                  <span className="grid size-[0.8cqw] place-items-center rounded-[0.2cqw]" style={{ background: RED }}>
                    <Check className="size-[0.6cqw]" strokeWidth={3} />
                  </span>
                  {c}
                </p>
              ))}
            </div>
          </Field>
          <div className="mt-[0.9cqw] rounded-[0.6cqw] bg-red-600 py-[0.5cqw] text-center text-[0.75cqw] font-semibold">Find colleges</div>
        </div>

        <div className="min-w-0">
          <div className="rounded-[1cqw] border border-white/10 bg-zinc-900/60 px-[1cqw] py-[0.7cqw]">
            <div className="flex gap-[0.4cqw] text-[0.55cqw]" style={STAMP}>
              {['General', 'JoSAA + JAC Delhi + IPU + AKTU', 'Page 1'].map((chip) => (
                <span key={chip} className="rounded-full px-[0.5cqw] py-[0.1cqw] text-white/60 ring-1 ring-white/15">
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-[0.4cqw] text-[0.72cqw] text-white/70">
              {phase === 'results' ? (
                <>
                  Showing <b className="text-white">412</b> matched results for rank <b className="text-white">25,000</b> (50 per page)
                </>
              ) : (
                'Searching cutoffs…'
              )}
            </p>
          </div>

          <div className="mt-[0.7cqw] flex gap-[0.4cqw] text-[0.65cqw]">
            {TABS.map(([tab, count], i) => (
              <span key={tab} className={`flex items-center gap-[0.35cqw] rounded-full px-[0.7cqw] py-[0.3cqw] ${i === 0 ? 'text-white' : 'text-white/55 ring-1 ring-white/10'}`} style={i === 0 ? { background: RED } : undefined}>
                {tab}
                <span className="rounded-full bg-white/10 px-[0.35cqw] text-[0.55cqw] tabular-nums">{phase === 'results' ? count : '–'}</span>
              </span>
            ))}
          </div>

          <div className="mt-[0.7cqw] space-y-[0.6cqw]">
            <AnimatePresence mode="popLayout">
              {phase === 'results'
                ? RESULTS.map((r, i) => <ResultCard key={r.institute} result={r} index={i} />)
                : phase === 'loading' && [0, 1].map((i) => <motion.div key={`s${i}`} exit={{ opacity: 0 }} className="h-[7cqw] animate-pulse rounded-[1cqw] bg-white/[0.06]" />)}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mt-[0.8cqw]">
      <p className="mb-[0.3cqw] text-[0.55cqw] font-semibold tracking-widest text-zinc-400 uppercase">{label}</p>
      {children}
    </div>
  )
}

function Select({ value }) {
  return (
    <div className="flex items-center justify-between rounded-[0.6cqw] bg-white/5 px-[0.7cqw] py-[0.45cqw] text-[0.72cqw] ring-1 ring-white/10">
      {value}
      <ChevronDown className="size-[0.75cqw] text-white/40" />
    </div>
  )
}

function ResultCard({ result: r, index }) {
  const verdict = chance(r.close)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[1cqw] border border-white/10 bg-zinc-900/60 px-[1cqw] py-[0.7cqw]"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full px-[0.5cqw] py-[0.1cqw] text-[0.55cqw] text-white/60 ring-1 ring-white/15">{r.body}</span>
        <span className={`rounded-full px-[0.6cqw] py-[0.1cqw] text-[0.65cqw] ring-1 ${CHANCE_STYLE[verdict]}`} style={STAMP}>
          {verdict}
        </span>
      </div>
      <div className="mt-[0.3cqw] flex items-end justify-between gap-[1cqw]">
        <div className="min-w-0">
          <p className="truncate text-[1.45cqw] leading-none uppercase" style={DISPLAY}>
            {r.institute}
          </p>
          <p className="mt-[0.2cqw] truncate text-[0.65cqw] text-zinc-400">{r.program}</p>
          <p className="mt-[0.2cqw] text-[0.55cqw] text-white/45" style={STAMP}>
            Quota: {r.quota} | General | Gender-Neutral
          </p>
        </div>
        <div className="flex shrink-0 gap-[0.4cqw] text-center">
          {[
            ['Opening', r.open.toLocaleString('en-IN')],
            ['Closing', r.close.toLocaleString('en-IN')],
            ['Round', r.round],
          ].map(([label, value]) => (
            <span key={label} className="rounded-[0.5cqw] bg-white/5 px-[0.6cqw] py-[0.3cqw]">
              <span className="block text-[0.5cqw] text-white/40 uppercase">{label}</span>
              <span className="block text-[0.75cqw] font-semibold tabular-nums">{value}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
