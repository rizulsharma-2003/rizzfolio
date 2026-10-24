import { useEffect, useMemo, useState } from 'react'
import { motion, useAnimate } from 'motion/react'
import { BatteryFull, Search, Trash, Wifi } from 'lucide-react'
import Logo from '../Logo'
import { AppIcon } from '../ProjectArt'
import { site } from '../../data/site'
import { DOCK, MENU_H, dock } from './geometry'
import { dockApp } from './apps'

/**
 * A miniature macOS desktop: wallpaper, menu bar, Dock and a layer for windows (children).
 * It is a size container, so everything inside is measured in cqw.
 */
export default function Desktop({ app, menuIcon: MenuIcon, children, overlay }) {
  const name = app ? dockApp(app)?.name : 'Finder'
  return (
    <div aria-hidden className="@container relative size-full overflow-hidden bg-black select-none">
      <Wallpaper />
      <Dock running={app} />
      <div className="absolute inset-0 z-20">{children}</div>
      <MenuBar appName={name} icon={MenuIcon} />
      {overlay}
    </div>
  )
}

function Wallpaper() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: [
          'radial-gradient(60% 55% at 12% 88%, rgb(255 106 0 / 0.55), transparent 70%)',
          'radial-gradient(55% 60% at 88% 18%, rgb(94 92 230 / 0.65), transparent 70%)',
          'radial-gradient(70% 60% at 62% 72%, rgb(255 45 85 / 0.32), transparent 70%)',
          'radial-gradient(40% 40% at 35% 30%, rgb(10 132 255 / 0.25), transparent 70%)',
          'linear-gradient(160deg, #0b1230 0%, #140a28 50%, #05060d 100%)',
        ].join(', '),
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />
    </div>
  )
}

function MenuBar({ appName, icon: Icon }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  const clock = useMemo(() => {
    const opts = { timeZone: site.timeZone }
    const day = new Intl.DateTimeFormat('en-GB', { ...opts, weekday: 'short', day: 'numeric', month: 'short' }).format(now)
    const time = new Intl.DateTimeFormat('en-US', { ...opts, hour: 'numeric', minute: '2-digit' }).format(now)
    return `${day.replace(',', '')}  ${time}`
  }, [now])

  return (
    <div
      className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-black/30 px-[1.2cqw] text-[1cqw] text-white/90"
      style={{ height: `${MENU_H}cqw` }}
    >
      <div className="flex items-center gap-[1.5cqw]">
        <Logo className="size-[1.1cqw]" />
        <motion.span key={appName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="font-bold">
          {appName}
        </motion.span>
        {['File', 'Edit', 'View', 'Window', 'Help'].map((m) => (
          <span key={m} className="hidden text-white/85 @[40rem]:inline">
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-[1.2cqw]">
        {Icon && (
          <motion.span key={appName} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            <Icon className="size-[1.15cqw]" strokeWidth={2} />
          </motion.span>
        )}
        <Wifi className="size-[1.1cqw]" strokeWidth={2.2} />
        <BatteryFull className="size-[1.4cqw]" strokeWidth={1.8} />
        <Search className="size-[1cqw]" strokeWidth={2.4} />
        <span className="tabular-nums">{clock}</span>
      </div>
    </div>
  )
}

function Dock({ running }) {
  return (
    <div
      className="absolute z-10 rounded-[1.5cqw] border border-white/[0.18] bg-white/[0.13] shadow-[0_1cqw_3cqw_rgba(0,0,0,0.35)]"
      style={{ left: `${dock.left}cqw`, top: `${dock.top}cqw`, width: `${dock.width}cqw`, height: `${dock.height}cqw` }}
    >
      {Object.entries(dock.slots).map(([id, slot]) =>
        slot.sep ? (
          <span
            key={id}
            className="absolute w-px bg-white/25"
            style={{ left: `${slot.x - dock.left}cqw`, top: `${DOCK.pad * 1.3}cqw`, bottom: `${DOCK.pad * 1.3}cqw` }}
          />
        ) : (
          <DockIcon key={id} id={id} slot={slot} running={running === id} />
        ),
      )}
    </div>
  )
}

function DockIcon({ id, slot, running }) {
  const [scope, animate] = useAnimate()
  const app = dockApp(id)

  // A launched app bounces, like macOS waiting for the window to appear.
  useEffect(() => {
    if (running && scope.current) {
      animate(scope.current, { y: ['0%', '-42%', '0%', '-16%', '0%'] }, { duration: 0.9, ease: 'easeOut' })
    }
  }, [running, animate, scope])

  return (
    <div
      className="absolute"
      style={{ left: `${slot.x - dock.left - DOCK.icon / 2}cqw`, top: `${DOCK.pad}cqw`, width: `${DOCK.icon}cqw`, height: `${DOCK.icon}cqw` }}
    >
      <div ref={scope} className="size-full">
        {id === 'trash' ? (
          <span className="grid size-full place-items-center rounded-[23%] bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/25 ring-inset">
            <Trash className="size-1/2 text-white/85" strokeWidth={1.6} />
          </span>
        ) : (
          <AppIcon project={app} className="size-full" />
        )}
      </div>
      <motion.span
        className="absolute left-1/2 size-[0.32cqw] -translate-x-1/2 rounded-full bg-white/90"
        style={{ bottom: '-0.48cqw' }}
        initial={false}
        animate={{ opacity: running ? 1 : 0, scale: running ? 1 : 0.4 }}
      />
    </div>
  )
}

/** The macOS arrow pointer. Position it with motion props. */
export function Cursor(props) {
  return (
    <motion.div className="pointer-events-none absolute top-0 left-0 z-50 size-[1.7cqw]" {...props}>
      <svg viewBox="0 0 20 24" className="size-full drop-shadow-[0_0.15cqw_0.25cqw_rgba(0,0,0,0.5)]">
        <path d="M2.5 1.5v18.2l4.6-4.4 3.1 7.1 3-1.3-3-6.9h6.4z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}
