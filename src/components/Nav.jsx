import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import Logo from './Logo'
import { site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { EASE_APPLE, EASE_OUT, SPRING_SNAPPY } from '../lib/motion'

const LINKS = site.nav.filter((n) => n.id !== 'contact')
const IDS = LINKS.map((l) => l.id)

const menuList = {
  hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  shown: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}
const menuItem = {
  hidden: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
}

/** The one navigation bar: clear over the hero, frosted glass once you scroll. */
export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(IDS)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <div
        aria-hidden
        className={`absolute inset-0 border-b transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled || open ? 'glass border-white/10' : 'border-transparent bg-transparent'
        }`}
      />

      <nav aria-label="Main" className="relative mx-auto flex h-[52px] max-w-[1024px] items-center justify-between px-4 md:px-[22px]">
        <a href="#overview" className="flex items-center gap-2 text-fog" onClick={() => setOpen(false)}>
          <Logo className="size-[16px]" />
          <span className="text-[19px] font-semibold tracking-[-0.01em] md:text-[21px]">{site.brand}</span>
        </a>

        <div className="flex items-center gap-3 md:gap-7">
          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  className={`text-[12px] transition-colors duration-300 ${active === id ? 'text-fog' : 'text-fog/60 hover:text-fog'}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-primary btn-xs">
            Contact
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative -mr-2 size-10 md:hidden"
          >
            <motion.span
              className="absolute top-1/2 left-1/2 h-[1.5px] w-[16px] -translate-x-1/2 rounded-full bg-fog"
              initial={false}
              animate={open ? { y: 0, rotate: 45 } : { y: -3.5, rotate: 0 }}
              transition={SPRING_SNAPPY}
            />
            <motion.span
              className="absolute top-1/2 left-1/2 h-[1.5px] w-[16px] -translate-x-1/2 rounded-full bg-fog"
              initial={false}
              animate={open ? { y: 0, rotate: -45 } : { y: 3.5, rotate: 0 }}
              transition={SPRING_SNAPPY}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass absolute inset-x-0 top-full border-b border-white/10 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: EASE_APPLE }}
          >
            <motion.ul variants={menuList} initial="hidden" animate="shown" exit="hidden" className="px-6 py-4">
              {site.nav.map(({ id, label }) => (
                <motion.li key={id} variants={menuItem}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className={`block py-2.5 text-[22px] font-semibold tracking-[-0.02em] ${active === id ? 'text-fog' : 'text-fog/70'}`}>
                    {label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
