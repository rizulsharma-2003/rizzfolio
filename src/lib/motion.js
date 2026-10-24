// Apple's signature curves, shared across the site.
export const EASE_APPLE = [0.28, 0.11, 0.32, 1]
export const EASE_OUT = [0.16, 1, 0.3, 1]

export const SPRING = { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 }
export const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 34 }

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smoothstep = (t) => t * t * (3 - 2 * t)
