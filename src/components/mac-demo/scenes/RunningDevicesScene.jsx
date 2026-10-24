import { AnimatePresence, motion } from 'motion/react'
import {
  Blocks,
  Bug,
  Camera,
  ChevronDown,
  CirclePlay,
  Ellipsis,
  Files,
  Gauge,
  GitBranch,
  RotateCw,
  ScanSearch,
  Search,
  Smartphone,
  Square,
  Zap,
} from 'lucide-react'
import MacWindow, { TrafficLights } from '../MacWindow'
import { Cursor } from '../Desktop'
import { SCREEN_H } from '../geometry'
import { useRetype } from '../useRetype'
import { useStoryboard } from '../useStoryboard'

const FRAME = { x: 2.5, y: 3.6, w: 95, h: 52 }

// open · edit · hot reloading · reloaded · edit back · hot reloading · reloaded
const STEPS = [1.2, 1.4, 0.55, 2.0, 1.4, 0.55, 2.0]
const RELOADED = { 3: 312, 6: 287 }

// VS Code Dark Modern token colours
const C = { kw: '#569cd6', ctl: '#c586c0', type: '#4ec9b0', fn: '#dcdcaa', str: '#ce9178', prop: '#9cdcfe', plain: '#cccccc', cm: '#6a9955' }

// Where the ⚡ button sits on screen, for the pointer.
const BOLT = { x: 82.3, y: 13.3 }

export default function RunningDevicesScene() {
  const step = useStoryboard(STEPS, { loopTo: 1 })
  const indigo = step >= 1 && step <= 3
  const accent = useRetype(indigo ? 'indigo' : 'deepPurple')
  const reloading = step === 2 || step === 5
  const reloaded = RELOADED[step]
  // The phone shows whatever was last hot reloaded.
  const shown = step >= 3 && step <= 5 ? 'indigo' : 'deepPurple'

  return (
    <div className="absolute inset-0">
      <MacWindow frame={FRAME} app="code" chrome="bare" className="bg-[#1f1f1f]">
        <div className="relative flex h-[2.4cqw] shrink-0 items-center border-b border-[#2b2b2b] bg-[#181818] px-[1cqw]">
          <TrafficLights />
          <p className="absolute inset-x-0 text-center text-[0.85cqw] text-white/55">insider_home.dart — insideedge</p>
        </div>
        <div className="absolute inset-x-0 top-[2.4cqw] bottom-[1.6cqw] flex">
          <ActivityBar />
          <Editor accent={accent} />
          <DevicePanel reloading={reloading} reloaded={reloaded} indigo={shown === 'indigo'} reloadKey={step} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-[1.6cqw] items-center gap-[1cqw] border-t border-[#2b2b2b] bg-[#181818] px-[0.8cqw] text-[0.65cqw] text-white/55">
          <span className="flex items-center gap-[0.3cqw]">
            <GitBranch className="size-[0.75cqw]" /> main
          </span>
          <span className="ml-auto">Dart</span>
          <span>Flutter · Rizul’s iPhone (ios)</span>
        </div>
      </MacWindow>

      <Cursor
        initial={false}
        animate={{
          left: `${step === 2 || step === 5 ? BOLT.x : 62}%`,
          top: `${((step === 2 || step === 5 ? BOLT.y : 34) / SCREEN_H) * 100}%`,
          scale: reloading ? [1, 0.85, 1] : 1,
        }}
        transition={{ duration: 0.45, ease: 'easeInOut', scale: { duration: 0.25, delay: 0.3 } }}
      />
    </div>
  )
}

function ActivityBar() {
  const items = [Files, Search, GitBranch, Bug, Blocks, Smartphone]
  return (
    <div className="flex w-[3cqw] shrink-0 flex-col items-center gap-[1.2cqw] border-r border-[#2b2b2b] bg-[#181818] pt-[1cqw]">
      {items.map((Icon, i) => (
        <span key={i} className={`relative grid w-full place-items-center ${i === items.length - 1 ? 'text-white' : 'text-white/40'}`}>
          {i === items.length - 1 && <span className="absolute left-0 h-full w-[0.12cqw] bg-[#0078d4]" />}
          <Icon className="size-[1.3cqw]" strokeWidth={1.6} />
        </span>
      ))}
    </div>
  )
}

function Editor({ accent }) {
  const lines = [
    [[C.kw, 'class '], [C.type, 'InsidersPage '], [C.kw, 'extends '], [C.type, 'StatelessWidget'], [C.plain, ' {']],
    [[C.plain, '  '], [C.kw, 'const '], [C.type, 'InsidersPage'], [C.plain, '({'], [C.kw, 'super'], [C.plain, '.key});']],
    [],
    [[C.plain, '  '], [C.fn, '@override']],
    [[C.plain, '  '], [C.type, 'Widget '], [C.fn, 'build'], [C.plain, '('], [C.type, 'BuildContext '], [C.prop, 'context'], [C.plain, ') {']],
    [[C.plain, '    '], [C.ctl, 'return '], [C.type, 'Scaffold'], [C.plain, '(']],
    [[C.plain, '      '], [C.prop, 'backgroundColor'], [C.plain, ': '], [C.type, 'AppColors'], [C.plain, '.lavender,']],
    [[C.plain, '      '], [C.prop, 'body'], [C.plain, ': '], [C.type, 'InsiderFeed'], [C.plain, '(']],
    [[C.plain, '        '], [C.prop, 'title'], [C.plain, ': '], [C.str, "'Talk To College Insiders'"], [C.plain, ',']],
    [[C.plain, '        '], [C.prop, 'accent'], [C.plain, ': '], [C.type, 'Colors'], [C.plain, '.'], [C.prop, accent, true], [C.plain, ',']],
    [[C.plain, '        '], [C.prop, 'mascot'], [C.plain, ': '], [C.type, 'Mascot'], [C.plain, '.graduate,']],
    [[C.plain, '      ),']],
    [[C.plain, '    );']],
    [[C.plain, '  }']],
    [[C.plain, '}']],
  ]
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-[2.1cqw] shrink-0 items-end bg-[#181818]">
        <span className="flex h-full items-center gap-[0.4cqw] border-t-[0.1cqw] border-[#0078d4] bg-[#1f1f1f] px-[1cqw] text-[0.75cqw] text-white/85">
          <span className="text-[#42a5f5]">◆</span> insider_home.dart
        </span>
        <span className="flex h-full items-center px-[1cqw] text-[0.75cqw] text-white/40">main.dart</span>
      </div>
      <p className="px-[1cqw] py-[0.4cqw] text-[0.65cqw] text-white/40">lib › features › insiders › insider_home.dart › InsidersPage › build</p>
      <div className="flex-1 overflow-hidden px-[0.6cqw] font-mono text-[0.8cqw] leading-[1.75] whitespace-pre">
        {lines.map((tokens, i) => (
          <p key={i} className={`min-h-[1.4cqw] ${i === 9 ? 'bg-white/[0.04]' : ''}`}>
            <span className="mr-[1.2cqw] inline-block w-[1.4cqw] text-right text-white/25">{i + 12}</span>
            {tokens.map(([color, text, caret], j) => (
              <span key={j} style={{ color }}>
                {text}
                {caret && <span className="ml-px inline-block h-[1cqw] w-[0.12cqw] translate-y-[0.15cqw] animate-blink bg-white/80" />}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

function DevicePanel({ reloading, reloaded, indigo, reloadKey }) {
  const status = reloading ? 'Hot reloading…' : reloaded ? `Reloaded in ${reloaded} ms` : 'Running'
  const tone = reloading ? '#ffc107' : reloaded ? '#3fb950' : '#3fb950'
  return (
    <div className="relative flex w-[31cqw] shrink-0 flex-col border-l border-[#2b2b2b] bg-[#181818]">
      <div className="flex h-[2.1cqw] shrink-0 items-center px-[1cqw] text-[0.68cqw] font-semibold tracking-wide text-white/60 uppercase">Running Devices: Device</div>

      <div className="flex items-center gap-[0.6cqw] border-b border-white/[0.07] px-[0.9cqw] pb-[0.8cqw]">
        <div className="flex h-[2.6cqw] min-w-0 flex-1 items-center gap-[0.55cqw] rounded-[0.7cqw] bg-white/[0.06] px-[0.7cqw]">
          <span className="size-[0.55cqw] rounded-full bg-[#3fb950] shadow-[0_0_0_0.25cqw_rgba(63,185,80,0.2)]" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[0.85cqw] font-semibold text-white/90">Rizul’s iPhone</p>
            <p className="truncate text-[0.68cqw] text-white/45">iOS 27.0.1 · USB</p>
          </div>
          <ChevronDown className="ml-auto size-[0.8cqw] text-white/50" />
        </div>
        <div className="flex h-[2.2cqw] items-center gap-[0.7cqw] rounded-[0.6cqw] bg-white/[0.06] px-[0.7cqw] text-white/60">
          <Camera className="size-[0.95cqw]" />
          <span className="grid size-[0.95cqw] place-items-center rounded-full ring-[0.12cqw] ring-white/60">
            <span className="size-[0.35cqw] rounded-full bg-white/70" />
          </span>
          <Ellipsis className="size-[0.95cqw]" />
        </div>
        <span className="grid size-[2.6cqw] place-items-center rounded-full bg-[#ff4d6a]/[0.13]">
          <span className="size-[0.8cqw] rounded-[0.15cqw] bg-[#ff4d6a]" />
        </span>
      </div>

      <div className="flex min-h-[3cqw] items-center gap-[0.6cqw] px-[0.9cqw]" style={{ background: 'linear-gradient(90deg, rgba(66,165,245,0.09), transparent)' }}>
        <FlutterLogo />
        <div className="min-w-0 leading-tight">
          <p className="text-[0.82cqw] font-semibold text-white/90">insideedge</p>
          <p className="flex items-center gap-[0.3cqw] text-[0.68cqw]" style={{ color: reloaded && !reloading ? '#3fb950' : 'rgb(255 255 255 / 0.55)' }}>
            <motion.span
              className="size-[0.42cqw] rounded-full"
              style={{ background: tone }}
              animate={{ opacity: reloading ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 0.5, repeat: reloading ? Infinity : 0 }}
            />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={status} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }}>
                {status}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-[0.2cqw] text-white/65">
          <motion.span
            className="grid size-[1.9cqw] place-items-center rounded-[0.5cqw]"
            animate={{ backgroundColor: reloading ? 'rgba(255,179,0,0.2)' : 'rgba(255,179,0,0)', scale: reloading ? [1, 0.92, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="size-[1cqw] text-[#ffb300]" fill="#ffb300" strokeWidth={1.5} />
          </motion.span>
          {[RotateCw, CirclePlay, Square].map((Icon, i) => (
            <span key={i} className="grid size-[1.9cqw] place-items-center">
              <Icon className="size-[0.95cqw]" strokeWidth={1.8} />
            </span>
          ))}
          <span className="mx-[0.2cqw] h-[1.2cqw] w-px bg-white/15" />
          {[ScanSearch, Gauge, Ellipsis].map((Icon, i) => (
            <span key={i} className="grid size-[1.9cqw] place-items-center">
              <Icon className="size-[0.95cqw]" strokeWidth={1.8} />
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden py-[1.2cqw]">
        <div className="absolute size-[24cqw] rounded-full opacity-[0.32] blur-[3cqw]" style={{ background: 'radial-gradient(circle, #6e5bff, #18b6d8 60%, transparent 75%)' }} />
        <div className="relative h-full rounded-[2.2cqw] bg-gradient-to-b from-[#30333b] to-[#0b0c0f] p-[0.5cqw] shadow-[0_1.5cqw_3cqw_rgba(0,0,0,0.6)]">
          <div className="relative h-full overflow-hidden rounded-[1.8cqw]">
            <motion.img
              src="/shots/insideedge.png"
              alt=""
              draggable={false}
              className="h-full w-auto"
              initial={false}
              animate={{ filter: indigo ? 'hue-rotate(-38deg) saturate(1.15)' : 'hue-rotate(0deg) saturate(1)' }}
              transition={{ duration: 0.25 }}
            />
            <AnimatePresence>
              {RELOADED[reloadKey] && (
                <motion.span key={reloadKey} className="absolute inset-0 bg-white" initial={{ opacity: 0.35 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function FlutterLogo() {
  return (
    <svg viewBox="0 0 24 30" className="h-[1.5cqw] w-auto shrink-0">
      <path d="M14.5 0 24 0 6.5 17.5 1.8 12.8z" fill="#42a5f5" />
      <path d="M14.5 13.8H24l-8.3 8.3 4.7 4.8-4.8 3H14.5l-5-5 5-5.2z" fill="#42a5f5" />
      <path d="M9.6 24.8l4.9-4.9 4.9 4.9-4.9 4.9z" fill="#0d47a1" />
    </svg>
  )
}
