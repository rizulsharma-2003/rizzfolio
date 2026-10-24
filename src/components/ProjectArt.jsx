/**
 * Generated artwork for projects without their own images: an app icon, a cover for
 * tiles and sheets, and a fake app window for the featured laptop.
 */
import { motion } from 'motion/react'

const alpha = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0')

/** Layered radial gradients — a soft "mesh" built from a project's colours. */
export function mesh([a, b, c = b], { low = false } = {}) {
  const y = low ? 92 : 32
  return [
    `radial-gradient(55% 60% at 16% ${y}%, ${alpha(a, 0.85)}, transparent 70%)`,
    `radial-gradient(50% 55% at 84% ${y - 8}%, ${alpha(b, 0.75)}, transparent 70%)`,
    `radial-gradient(70% 60% at 50% ${y + 20}%, ${alpha(c, 0.8)}, transparent 70%)`,
    '#0a0a0b',
  ].join(', ')
}

export function AppIcon({ project, className = '' }) {
  const { icon: Icon, iconStyle, colors } = project
  const [a, b, c = b] = colors
  const image = typeof Icon === 'string'

  // macOS icons already carry their squircle and a transparent margin: show them as they are,
  // scaled so the artwork matches the size of the masked icons.
  if (image && iconStyle === 'mac') {
    return (
      <span className={`relative grid shrink-0 place-items-center ${className}`} style={{ boxShadow: 'none' }}>
        <img src={Icon} alt="" draggable={false} className="size-full scale-[1.16] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]" />
      </span>
    )
  }

  return (
    <span
      className={`relative isolate grid shrink-0 place-items-center overflow-hidden rounded-[23%] ${className}`}
      style={{ background: `linear-gradient(150deg, ${a} 0%, ${b} 55%, ${c} 100%)` }}
    >
      {image ? (
        <img src={Icon} alt="" draggable={false} className="size-full object-cover" />
      ) : (
        <Icon aria-hidden strokeWidth={1.75} className="size-1/2 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
      )}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/15 ring-inset ${
          image ? '' : 'bg-[radial-gradient(120%_70%_at_25%_0%,rgba(255,255,255,0.42),transparent_55%)]'
        }`}
      />
    </span>
  )
}

/** A screenshot standing on the cover: a phone with a bezel, or a floating panel. */
function Shot({ project, low }) {
  const phone = project.shotStyle === 'phone'
  return (
    <div className={`absolute left-1/2 -translate-x-1/2 ${low ? 'top-[60%] h-[92%] md:top-[44%]' : 'top-[10%] h-[118%]'}`}>
      <img
        src={project.shot}
        alt={`${project.name} screenshot`}
        loading="lazy"
        draggable={false}
        className={`h-full w-auto shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85)] ${
          phone
            ? 'rounded-[13%/6%] border-[7px] border-black ring-1 ring-white/20'
            : 'rounded-[16px] ring-1 ring-white/15'
        }`}
      />
    </div>
  )
}

/** Cover art. `low` keeps the colour near the bottom so overlaid text stays legible. */
export function CoverArt({ project, low = false }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.name} preview`} loading="lazy" className="size-full object-cover" />
  }
  return (
    <div className="relative size-full overflow-hidden bg-[#0a0a0b]">
      <div aria-hidden className="absolute -inset-[15%] animate-drift" style={{ background: mesh(project.colors, { low }) }} />
      {project.shot ? (
        <Shot project={project} low={low} />
      ) : (
        <div aria-hidden className={`absolute inset-x-0 flex -translate-y-1/2 justify-center ${low ? 'top-[70%] md:top-[62%]' : 'top-1/2'}`}>
          <AppIcon project={project} className="size-[clamp(104px,13vw,172px)] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75)]" />
        </div>
      )}
    </div>
  )
}

/**
 * A believable macOS window, sized with container units so it scales with the laptop.
 * `contentStyle` (motion style) lets the caller fade the app's content in and out.
 */
export function WindowArt({ project, contentStyle }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.name} screenshot`} className="size-full object-cover" />
  }
  return (
    <div aria-hidden className="@container flex size-full flex-col bg-[#0e0e10]">
      <div className="flex h-[5cqw] shrink-0 items-center gap-[0.8cqw] border-b border-white/5 bg-[#1c1c1e] px-[1.6cqw]">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} className="size-[1.1cqw] rounded-full" style={{ background: c }} />
        ))}
        <span className="mx-auto h-[1.5cqw] w-[26cqw] rounded-full bg-white/[0.06]" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="w-[22cqw] shrink-0 space-y-[1.7cqw] border-r border-white/5 bg-[#141416] p-[2.2cqw]">
          {[70, 52, 64, 40, 58, 46].map((w, i) => (
            <span
              key={i}
              className="block h-[1.1cqw] rounded-full bg-white/[0.08]"
              style={{ width: `${w}%`, ...(i === 0 && { background: project.colors[0], opacity: 0.85 }) }}
            />
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute -inset-[15%] animate-drift" style={{ background: mesh(project.colors) }} />
          <motion.div style={contentStyle} className="relative flex h-full flex-col items-center justify-center gap-[1.6cqw] text-center">
            <AppIcon project={project} className="size-[13cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.7)]" />
            <p className="text-[4.4cqw] leading-none font-semibold tracking-[-0.03em]">{project.name}</p>
            <p className="text-[1.7cqw] text-white/70">{project.tagline}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
