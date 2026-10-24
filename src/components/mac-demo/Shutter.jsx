import { motion } from 'motion/react'

/**
 * Mac Shutter's rolling door, drawn the way the app draws it: 46pt corrugated slats
 * with a 2pt gap, hairline scratches, rivets on every third slat and dark bands at
 * both ends. The panel is 1.15× the screen and pinned to the top; `y` rolls it up.
 */
export default function Shutter({ y }) {
  return (
    <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[115%]" style={{ y }}>
      <div className="shutter-panel absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/55 to-transparent" />
    </motion.div>
  )
}
