import { Cpu, Palette } from 'lucide-react'

/** Small looping illustrations for the highlights carousel. Paused unless their card is active. */
export default function HighlightVisual({ item, active }) {
  const Visual = VISUALS[item.visual] ?? RingsVisual
  return <Visual colors={item.colors} icon={item.icon} file={item.file} active={active} />
}

function RingsVisual({ colors, icon: Icon = Palette }) {
  return (
    <div className="relative grid size-[min(440px,72vw)] place-items-center">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="absolute inset-0 animate-ripple rounded-full border border-white/25" style={{ animationDelay: `${i}s` }} />
      ))}
      <div className="absolute inset-[14%] animate-spin-slow">
        {colors.map((c, i) => (
          <span
            key={c}
            className="absolute top-1/2 left-1/2 size-3.5 rounded-full"
            style={{
              background: c,
              boxShadow: `0 0 24px ${c}`,
              transform: `rotate(${i * 120}deg) translateY(calc(-1 * min(154px, 25vw))) translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>
      <div className="widget relative grid size-24 place-items-center rounded-[28%] md:size-28">
        <Icon className="size-10 text-fog md:size-12" strokeWidth={1.5} />
      </div>
    </div>
  )
}

// Token widths per line, coloured like Xcode's default dark theme.
const CODE = [
  { indent: 0, tokens: [['#ff7ab2', 14], ['#dabaff', 22], ['#fcfcfc', 8]] },
  { indent: 1, tokens: [['#ff7ab2', 10], ['#6bdfff', 26], ['#fcfcfc', 6]] },
  { indent: 1, tokens: [['#ff7ab2', 12], ['#ffa14f', 8]] },
  { indent: 2, tokens: [['#6bdfff', 18], ['#fcfcfc', 30]] },
  { indent: 2, tokens: [['#dabaff', 24], ['#ff8170', 20]] },
  { indent: 1, tokens: [['#fcfcfc', 6]] },
  { indent: 1, tokens: [['#ff7ab2', 12], ['#6bdfff', 16], ['#ffa14f', 6]] },
  { indent: 0, tokens: [['#fcfcfc', 4]] },
]

function CodeVisual({ active, file = 'App.jsx' }) {
  return (
    <div className="w-[min(560px,82%)] overflow-hidden rounded-[18px] bg-[#1f1f22]/90 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 font-mono text-[11px] text-white/35">{file}</span>
      </div>
      {/* Remounting on activation replays the typing. */}
      <div key={active ? 'on' : 'off'} className="space-y-2.5 p-5 md:space-y-3 md:p-6">
        {CODE.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right font-mono text-[10px] text-white/20">{i + 1}</span>
            <div className="flex flex-1 items-center gap-2" style={{ paddingLeft: `${line.indent * 6}%` }}>
              {line.tokens.map(([color, width], j) => (
                <span
                  key={j}
                  className="h-2.5 origin-left animate-type-in rounded-full"
                  style={{ width: `${width}%`, background: color, opacity: 0.85, animationDelay: `${0.25 + i * 0.16 + j * 0.06}s` }}
                />
              ))}
              {i === CODE.length - 1 && <span className="h-3.5 w-0.5 animate-blink bg-white/70" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// cubic-bezier(0.28, 0.11, 0.32, 1) drawn in a 200 × 200 box (y grows downwards).
const CURVE = 'M 0 200 C 56 178, 64 0, 200 0'

function CurveVisual({ colors }) {
  return (
    <div className="w-[min(440px,76%)]">
      <svg viewBox="-12 -12 224 224" className="w-full overflow-visible">
        <defs>
          <linearGradient id="curve-gradient" x1="0" y1="1" x2="1" y2="0">
            {colors.map((c, i) => (
              <stop key={c} offset={i / (colors.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        {[0, 50, 100, 150, 200].map((v) => (
          <g key={v} stroke="rgb(255 255 255 / 0.06)">
            <line x1={v} y1="0" x2={v} y2="200" />
            <line x1="0" y1={v} x2="200" y2={v} />
          </g>
        ))}
        <g stroke="rgb(255 255 255 / 0.35)" strokeDasharray="3 4">
          <line x1="0" y1="200" x2="56" y2="178" />
          <line x1="200" y1="0" x2="64" y2="0" />
        </g>
        <circle cx="56" cy="178" r="5" fill="#1d1d1f" stroke="#fff" strokeWidth="2" />
        <circle cx="64" cy="0" r="5" fill="#1d1d1f" stroke="#fff" strokeWidth="2" />
        <path
          d={CURVE}
          pathLength="1"
          fill="none"
          stroke="url(#curve-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1"
          className="animate-draw"
        />
      </svg>
      <div className="relative mt-8 h-[18px] rounded-full bg-white/[0.06]">
        <span className="absolute top-0 size-[18px] animate-glide rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.7)]" />
      </div>
      <p className="mt-4 text-center font-mono text-[12px] text-white/45">cubic-bezier(0.28, 0.11, 0.32, 1)</p>
    </div>
  )
}

function GridVisual({ colors, icon: Icon = Cpu }) {
  const cols = 9
  const rows = 5
  const centre = Math.floor((cols * rows) / 2)
  return (
    <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: cols * rows }, (_, i) =>
        i === centre ? (
          <div key={i} className="widget grid size-10 place-items-center rounded-[30%] p-0 md:size-14">
            <Icon className="size-5 text-fog md:size-7" strokeWidth={1.5} />
          </div>
        ) : (
          <div key={i} className="grid size-10 place-items-center md:size-14">
            <span
              className="size-2.5 animate-node rounded-[4px] md:size-3.5"
              style={{ '--node': colors[i % colors.length], animationDelay: `${((i * 7) % 23) * 0.14}s` }}
            />
          </div>
        ),
      )}
    </div>
  )
}

const VISUALS = { rings: RingsVisual, code: CodeVisual, curve: CurveVisual, grid: GridVisual }
