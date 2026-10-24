import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { site } from '../data/site'

/** A paragraph that lights up word by word as you scroll through it. */
export default function Statement() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const words = site.statement.split(' ')

  return (
    <section id="about" className="px-6 py-[24vh]">
      <div className="mx-auto max-w-[1000px]">
        <p ref={ref} className="text-[clamp(30px,4.6vw,60px)] leading-[1.14] font-semibold tracking-[-0.025em]">
          {words.map((word, i) => (
            <Word key={i} word={word} progress={progress} range={[i / words.length, (i + 1) / words.length]} still={reduce} />
          ))}
        </p>
      </div>
    </section>
  )
}

function Word({ word, progress, range, still }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <>
      <motion.span style={still ? undefined : { opacity }}>{word}</motion.span>{' '}
    </>
  )
}
