import { AnimatePresence, motion } from 'motion/react'
import { useStoryboard } from '../../useStoryboard'
import { LiquidBurst, Orb, PEERS } from './shared'
import { DesktopFiles, Drag, FILES } from './desk'

// Gestures/DragOverlayController.swift: up to five colleagues sit on a 132pt ring around
// the held file, starting at the top and going clockwise.
const CENTRE = { x: 50, y: 33 }
const RADIUS = 132 * 0.078
const ORB = 86 * 0.078
const ring = [PEERS.priya, PEERS.alex, PEERS.meera].map((peer, i, all) => {
  const angle = Math.PI / 2 - (i * 2 * Math.PI) / all.length
  return { peer, x: CENTRE.x + RADIUS * Math.cos(angle), y: CENTRE.y - RADIUS * Math.sin(angle) }
})
const target = ring[0]
const file = FILES[1]

// idle · drag and hold still · orbs appear · move to Priya · hover · release · burst · settle
const STEPS = [0.8, 1.5, 0.9, 0.6, 0.8, 0.45, 1.3, 0.6]

/** Hold a dragged file still anywhere: nearby colleagues pop up around it, ready to receive. */
export default function HoldChapter() {
  const step = useStoryboard(STEPS, { delay: 0.6 })
  const orbsUp = step >= 2 && step <= 5
  const targeted = step === 4 || step === 5
  const released = step === 5
  const sent = step === 5 || step === 6

  const path =
    step <= 0
      ? [{ x: 40, y: 42, t: 0 }, { x: 40, y: 42, t: 1 }]
      : step === 1
        ? [
            { x: 40, y: 42, t: 0 },
            { x: file.x, y: file.y + 1.6, t: 0.3 },
            { x: CENTRE.x, y: CENTRE.y, t: 0.75 },
            { x: CENTRE.x, y: CENTRE.y, t: 1 },
          ]
        : step === 2
          ? [{ x: CENTRE.x, y: CENTRE.y, t: 0 }, { x: CENTRE.x, y: CENTRE.y, t: 1 }]
          : step === 3
            ? [{ x: CENTRE.x, y: CENTRE.y, t: 0 }, { x: target.x + 0.4, y: target.y + 0.8, t: 1 }]
            : step === 4 || step === 5
              ? [{ x: target.x + 0.4, y: target.y + 0.8, t: 0 }, { x: target.x + 0.4, y: target.y + 0.8, t: 1 }]
              : [{ x: target.x + 0.4, y: target.y + 0.8, t: 0 }, { x: 58, y: 42, t: 1 }]

  return (
    <div className="absolute inset-0">
      <DesktopFiles dragging={step >= 1 && step <= 5 ? file.id : null} />

      <AnimatePresence>
        {orbsUp &&
          ring.map((orb, i) => (
            <motion.div
              key={orb.peer.name}
              className="absolute z-30 -translate-x-1/2"
              style={{ left: `${orb.x}cqw`, top: `${orb.y - ORB / 2}cqw` }}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.25, delay: i * 0.03 } }}
              transition={{ type: 'spring', stiffness: 224, damping: 18.6, delay: i * 0.035 }}
            >
              <Orb peer={orb.peer} targeted={targeted && orb === target} />
            </motion.div>
          ))}
      </AnimatePresence>

      <AnimatePresence>{sent && <LiquidBurst key="burst" origin={{ x: target.x, y: target.y }} />}</AnimatePresence>

      <Drag
        path={path}
        duration={step === 1 ? STEPS[1] : step === 3 ? STEPS[3] : step === 6 ? 0.9 : 0.01}
        carry={step === 1 ? 0.3 : step >= 2 && step <= 5 ? 0 : null}
        drop={released ? { x: target.x, y: target.y } : null}
        file={file.kind}
      />
    </div>
  )
}
