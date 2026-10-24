import { useEffect, useState } from 'react'

/**
 * Plays a demo as a sequence of numbered steps. `durations[i]` is how long step i holds
 * (seconds). Starts at step 0 after `delay`, then loops back to `loopTo`.
 */
export function useStoryboard(durations, { delay = 0.8, loopTo = 0 } = {}) {
  const [step, setStep] = useState(-1)
  const key = durations.join(',')

  useEffect(() => {
    const holds = key.split(',').map(Number)
    let timer
    const go = (i) => {
      setStep(i)
      timer = setTimeout(() => go(i + 1 < holds.length ? i + 1 : loopTo), holds[i] * 1000)
    }
    timer = setTimeout(() => go(0), delay * 1000)
    return () => clearTimeout(timer)
  }, [key, delay, loopTo])

  return step
}
