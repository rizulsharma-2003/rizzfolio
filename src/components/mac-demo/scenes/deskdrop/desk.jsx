import { motion } from 'motion/react'
import { Cursor } from '../../Desktop'
import { MENU_H, SCREEN_H, dock } from '../../geometry'
import { DesktopFile, FileGlyph } from './shared'

// The desktop the gesture chapters play on, in screen cqw.
export const FILES = [
  { id: 'report', name: 'Q3 Report.pdf', kind: 'pdf', x: 7, y: 5.5 },
  { id: 'wires', name: 'Wireframes.png', kind: 'png', x: 7, y: 13 },
  { id: 'brand', name: 'Brand Kit.zip', kind: 'zip', x: 7, y: 20.5 },
]
export const VISIBLE = { top: MENU_H, bottom: dock.top }

const px = (x) => `${x}%`
const py = (y) => `${(y / SCREEN_H) * 100}%`

/** Desktop icons, with the one being dragged left as a dimmed original. */
export function DesktopFiles({ dragging }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {FILES.map((f) => (
        <div key={f.id} style={{ opacity: dragging === f.id ? 0.45 : 1 }}>
          <DesktopFile {...f} selected={dragging === f.id} />
        </div>
      ))}
    </motion.div>
  )
}

/**
 * The pointer and the file it carries, moved along a path of points.
 * path   [{ x, y, t }] — t in 0…1 of `duration`
 * carry  how far along the path the file is picked up (0…1), or null for no file
 * drop   { x, y } to fly the file into when released
 */
export function Drag({ path, duration, carry = null, drop, file = 'pdf' }) {
  const times = path.map((p) => p.t)
  const transition = { duration, times, ease: 'easeInOut' }
  const carrying = carry !== null
  return (
    <>
      {carrying && (
        <motion.div
          className="pointer-events-none absolute z-40 h-[3.4cqw] w-[2.8cqw] -translate-x-[70%] -translate-y-[80%]"
          initial={false}
          animate={
            drop
              ? { left: px(drop.x), top: py(drop.y), scale: 0.25, opacity: 0 }
              : { left: path.map((p) => px(p.x)), top: path.map((p) => py(p.y)), opacity: times.map((t) => (t >= carry ? 0.9 : 0)), scale: 1 }
          }
          transition={drop ? { duration: 0.42, ease: [0.4, 0, 0.6, 1] } : { ...transition, opacity: { duration, times, ease: 'linear' } }}
        >
          <svg viewBox="-1.5 -1.8 3 3.6" className="size-full drop-shadow-[0_0.6cqw_1cqw_rgba(0,0,0,0.5)]">
            <FileGlyph kind={file} />
          </svg>
        </motion.div>
      )}
      <Cursor initial={false} animate={{ left: path.map((p) => px(p.x)), top: path.map((p) => py(p.y)) }} transition={transition} />
    </>
  )
}
