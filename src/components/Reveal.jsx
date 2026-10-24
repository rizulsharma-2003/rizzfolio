import { motion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'

const hidden = (y, blur) => ({ opacity: 0, y, ...(blur && { filter: 'blur(10px)' }) })
const shown = (blur) => ({ opacity: 1, y: 0, ...(blur && { filter: 'blur(0px)' }) })

/** Fades content up as it scrolls into view — Apple's default section entrance. */
export function Reveal({ as = 'div', delay = 0, y = 40, blur = false, amount = 0.25, duration = 1.1, children, ...props }) {
  const Component = motion[as]
  return (
    <Component
      initial={hidden(y, blur)}
      whileInView={shown(blur)}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </Component>
  )
}

/** The same entrance, played on page load (used in the hero). */
export function Rise({ as = 'div', delay = 0, y = 24, children, ...props }) {
  const Component = motion[as]
  return (
    <Component initial={hidden(y, true)} animate={shown(true)} transition={{ duration: 1.3, delay, ease: EASE_OUT }} {...props}>
      {children}
    </Component>
  )
}
