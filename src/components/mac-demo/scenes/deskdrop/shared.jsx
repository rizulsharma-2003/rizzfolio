import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Clock, Laptop, MessagesSquare, RadioTower, Settings } from 'lucide-react'
import { TrafficLights } from '../../MacWindow'
import { AppIcon } from '../../../ProjectArt'
import { projects } from '../../../../data/projects'

// DeskDrop's theme (Components/Theme.swift)
export const ACCENT = '#4C8FFF'
export const VIOLET = '#8F6EFF'
export const CYAN = '#52D1F5'
export const PINK = '#FF73C7'
export const SUCCESS = '#45CC87'
export const MESSAGE_BLUE = '#0A84FF'
export const INCOMING = '#3B3B3D'
// ProximityEffects.spectrum
export const SPECTRUM = `conic-gradient(${CYAN}, ${ACCENT}, ${VIOLET}, ${PINK}, ${CYAN})`

export const deskdrop = projects.find((p) => p.id === 'deskdrop')

export const PEERS = {
  me: { name: 'Rizul’s MacBook', initials: 'R', kind: 'laptop' },
  priya: { name: 'Priya’s Mac', initials: 'P', kind: 'desktop' },
  alex: { name: 'Alex’s Mac', initials: 'A', kind: 'laptop' },
  meera: { name: 'Meera’s MacBook', initials: 'M', kind: 'laptop' },
}

/** The window's backdrop: a dark gradient with a violet glow top-left and an accent glow bottom-right. */
export function Stage() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: [
          `radial-gradient(45% 55% at 0% 0%, ${VIOLET}1a, transparent 70%)`,
          `radial-gradient(45% 55% at 100% 100%, ${ACCENT}12, transparent 70%)`,
          'linear-gradient(180deg, #17181e, #0c0d11)',
        ].join(', '),
      }}
    />
  )
}

/** DeskDrop's header row: status pill, the Nearby | Messages switcher, and the user's Mac. */
export function Header({ tab = 'nearby' }) {
  const segments = [
    ['nearby', 'Nearby', RadioTower],
    ['messages', 'Messages', MessagesSquare],
  ]
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[3.2cqw] items-center px-[1.2cqw]">
      <TrafficLights />
      <div className="ml-[2.6cqw] flex items-center gap-[0.6cqw]">
        <AppIcon project={deskdrop} className="size-[1.65cqw]" />
        <span className="text-[1.05cqw] font-semibold text-white/90">DeskDrop</span>
        <span className="ml-[0.4cqw] flex items-center gap-[0.4cqw] rounded-full bg-white/[0.07] px-[0.7cqw] py-[0.25cqw] text-[0.85cqw] font-medium text-white/75 ring-1 ring-white/10">
          <span className="size-[0.5cqw] rounded-full" style={{ background: SUCCESS, boxShadow: `0 0 0.5cqw ${SUCCESS}` }} />
          Ready to share
        </span>
      </div>
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center rounded-full bg-white/[0.07] p-[0.2cqw] text-[0.85cqw] font-semibold ring-1 ring-white/10">
        {segments.map(([id, label, Icon]) => (
          <span key={id} className={`relative flex items-center gap-[0.35cqw] px-[0.8cqw] py-[0.3cqw] ${tab === id ? 'text-white' : 'text-white/60'}`}>
            {tab === id && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${VIOLET})`, boxShadow: `0 0 0.6cqw ${ACCENT}59` }}
              />
            )}
            <Icon className="relative size-[0.9cqw]" strokeWidth={2.2} />
            <span className="relative">{label}</span>
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-[0.6cqw] rounded-full bg-white/[0.07] px-[0.8cqw] py-[0.3cqw] text-[0.85cqw] text-white/75 ring-1 ring-white/10">
        <Laptop className="size-[0.95cqw]" strokeWidth={2} />
        Rizul’s MacBook
        <span className="h-[1cqw] w-px bg-white/15" />
        <Clock className="size-[0.95cqw]" strokeWidth={2} />
        <Settings className="size-[0.95cqw]" strokeWidth={2} />
      </div>
    </div>
  )
}

/** Components/MacIllustration.swift: a display on a stand, or a laptop, with the owner's initials. */
export function MacArt({ peer, glow = 'on', scale = 1 }) {
  const desktop = peer.kind === 'desktop'
  const targeted = glow === 'targeted'
  const fill = targeted
    ? `linear-gradient(135deg, ${ACCENT}, ${VIOLET})`
    : glow === 'local'
      ? `linear-gradient(135deg, ${CYAN}a6, ${ACCENT}bf)`
      : glow === 'off'
        ? '#22252D'
        : `linear-gradient(135deg, ${ACCENT}d9, ${VIOLET}cc)`
  const u = (n) => `${n * scale}cqw`
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative ring-1 ring-white/15"
        style={{ width: u(desktop ? 6.6 : 6.3), height: u(desktop ? 4.5 : 4.2), padding: u(0.26), borderRadius: u(0.75), background: '#0d0e12' }}
        animate={{ boxShadow: targeted ? `0 0 ${1.5 * scale}cqw ${ACCENT}99` : '0 0 0cqw rgba(0,0,0,0)' }}
      >
        <div className="relative grid size-full place-items-center overflow-hidden" style={{ background: fill, borderRadius: u(0.52) }}>
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.16]" />
          <AnimatePresence mode="popLayout" initial={false}>
            {targeted ? (
              <motion.span key="arrow" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <ArrowDown className="text-white" style={{ width: u(1.5), height: u(1.5) }} strokeWidth={2.6} />
              </motion.span>
            ) : (
              <motion.span key="initials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative font-semibold text-white" style={{ fontSize: u(1.3) }}>
                {peer.initials}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {desktop ? (
        <>
          <span className="bg-gradient-to-b from-[#3a3b42] to-[#25262c]" style={{ height: u(0.75), width: u(1.05) }} />
          <span className="rounded-full bg-[#3a3b42]" style={{ height: u(0.38), width: u(3.6) }} />
        </>
      ) : (
        <span className="bg-gradient-to-b from-[#4a4b52] to-[#2a2b31]" style={{ height: u(0.45), width: u(7.8), borderRadius: `0 0 ${u(0.4)} ${u(0.4)}` }} />
      )}
    </div>
  )
}

/** A document icon, drawn in SVG user units (about 2.6 × 3.3). */
export function FileGlyph({ kind = 'pdf' }) {
  const tag = { pdf: ['#ff453a', 'PDF'], png: ['#30d158', 'PNG'], zip: ['#8e8e93', 'ZIP'] }[kind]
  return (
    <g transform="translate(-1.3 -1.65)">
      <path d="M0 0.25Q0 0 0.25 0H1.85L2.6 0.75V3.05Q2.6 3.3 2.35 3.3H0.25Q0 3.3 0 3.05Z" fill="#f5f5f7" />
      <path d="M1.85 0V0.75H2.6" fill="#d1d1d6" />
      <rect x="0.4" y="1.9" width="1.8" height="0.75" rx="0.12" fill={tag[0]} />
      <text x="1.3" y="2.48" textAnchor="middle" fontSize="0.55" fontWeight="700" fill="#fff" fontFamily="-apple-system, Inter, sans-serif">
        {tag[1]}
      </text>
      <rect x="0.4" y="0.9" width="1.2" height="0.16" rx="0.08" fill="#c7c7cc" />
      <rect x="0.4" y="1.3" width="1.6" height="0.16" rx="0.08" fill="#c7c7cc" />
    </g>
  )
}

/** A file on the desktop, Finder style: icon with its name underneath. */
export function DesktopFile({ x, y, name, kind, selected = false }) {
  return (
    <div className="absolute flex w-[7cqw] -translate-x-1/2 flex-col items-center gap-[0.3cqw]" style={{ left: `${x}cqw`, top: `${y}cqw` }}>
      <svg viewBox="-1.5 -1.8 3 3.6" className={`h-[3.6cqw] w-auto rounded-[0.3cqw] ${selected ? 'bg-white/15' : ''}`}>
        <FileGlyph kind={kind} />
      </svg>
      <span className={`rounded-[0.3cqw] px-[0.3cqw] text-center text-[0.78cqw] leading-tight font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] ${selected ? 'bg-[#0a84ff]' : ''}`}>
        {name}
      </span>
    </div>
  )
}

/** A colleague floating around a held file (Views/Gestures/NearbyOrbView.swift). */
export function Orb({ peer, targeted, label, size = 6.7 }) {
  return (
    <div className="flex flex-col items-center gap-[0.5cqw]">
      <motion.div
        className="relative grid place-items-center rounded-full"
        style={{ width: `${size}cqw`, height: `${size}cqw`, background: 'radial-gradient(circle at 50% 0%, rgb(51 51 51 / 0.94), rgb(18 18 18 / 0.94) 70%)' }}
        animate={{ scale: targeted ? 1.18 : 1, boxShadow: `0 0 ${targeted ? 1.9 : 0.8}cqw ${ACCENT}${targeted ? 'd9' : '59'}` }}
        transition={{ type: 'spring', stiffness: 440, damping: 22 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: SPECTRUM,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${targeted ? 0.24 : 0.12}cqw), #000 calc(100% - ${targeted ? 0.24 : 0.12}cqw))`,
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${targeted ? 0.24 : 0.12}cqw), #000 calc(100% - ${targeted ? 0.24 : 0.12}cqw))`,
          }}
          animate={{ rotate: targeted ? 180 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <MacArt peer={peer} glow={targeted ? 'targeted' : 'on'} scale={0.6 * (size / 6.7)} />
      </motion.div>
      <span
        className="max-w-[11cqw] truncate rounded-full px-[0.7cqw] py-[0.23cqw] text-[0.9cqw] font-semibold text-white"
        style={{ background: targeted ? `linear-gradient(135deg, ${ACCENT}, ${VIOLET})` : 'rgb(0 0 0 / 0.62)' }}
      >
        {label ?? (targeted ? 'Release to send' : peer.name)}
      </span>
    </div>
  )
}

/**
 * ProximityEffectView's send burst: liquid light welling up from a point, a white-hot
 * core and filaments racing outwards. `origin` is in cqw; `edge` makes it hug that edge.
 */
export function LiquidBurst({ origin, edge }) {
  const vertical = edge === 'left' || edge === 'right'
  const flip = edge === 'left' ? -1 : 1
  return (
    <motion.div
      className="pointer-events-none absolute z-30 mix-blend-screen"
      style={{ left: `${origin.x}cqw`, top: `${origin.y}cqw` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.7, times: [0, 0.1, 0.45, 1] }}
    >
      <motion.div
        className="absolute h-[16cqw] w-[10cqw] -translate-1/2 rounded-full blur-[2cqw]"
        style={{ background: `radial-gradient(closest-side, rgba(255,255,255,0.95), ${CYAN} 45%, ${ACCENT} 75%, transparent)` }}
        initial={{ scale: 0.2 }}
        animate={{ scale: [0.2, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.36, 1], ease: 'easeOut' }}
      />
      {[CYAN, ACCENT, VIOLET, PINK].map((c, i) => (
        <motion.span
          key={c}
          className="absolute size-[5cqw] -translate-1/2 rounded-full blur-[2cqw]"
          style={{ background: c }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: vertical ? `${-flip * (40 + i * 25)}%` : `${(i - 1.5) * 70}%`,
            y: vertical ? `${(i - 1.5) * 90}%` : '-60%',
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 1.3, delay: i * 0.03, ease: 'easeOut' }}
        />
      ))}
      {vertical &&
        [-1, 1].map((dir) => (
          <motion.span
            key={dir}
            className="absolute left-0 w-[0.25cqw] -translate-x-1/2 rounded-full"
            style={{
              height: '22cqw',
              top: dir < 0 ? '-22cqw' : 0,
              transformOrigin: dir < 0 ? '50% 100%' : '50% 0%',
              background: `linear-gradient(${dir < 0 ? 0 : 180}deg, #fff, ${CYAN}, ${VIOLET}, transparent)`,
              boxShadow: `0 0 1.6cqw ${CYAN}`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1], opacity: [1, 0.2] }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        ))}
    </motion.div>
  )
}
