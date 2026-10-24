import { useEffect, useRef, useState } from 'react'

/** Edits text the way a person would: backspace to the common prefix, then type the rest. */
export function useRetype(target, { speed = 55 } = {}) {
  const [text, setText] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const id = setInterval(() => {
      const now = current.current
      if (now === target) return clearInterval(id)
      const next = target.startsWith(now) ? target.slice(0, now.length + 1) : now.slice(0, -1)
      current.current = next
      setText(next)
    }, speed)
    return () => clearInterval(id)
  }, [target, speed])

  return text
}
