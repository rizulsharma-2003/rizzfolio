import { useEffect, useMemo, useState } from 'react'

/** Current time in the given IANA time zone, e.g. "11:11 PM". Refreshes every 15 seconds. */
export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  const format = useMemo(() => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }), [timeZone])
  return format.format(now)
}
