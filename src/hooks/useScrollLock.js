import { useEffect } from 'react'

/** Freezes page scroll while `locked` is true (menus, modals). */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const gap = window.innerWidth - html.clientWidth
    const previous = { overflow: html.style.overflow, paddingRight: html.style.paddingRight }
    html.style.overflow = 'hidden'
    if (gap > 0) html.style.paddingRight = `${gap}px`
    return () => {
      html.style.overflow = previous.overflow
      html.style.paddingRight = previous.paddingRight
    }
  }, [locked])
}
