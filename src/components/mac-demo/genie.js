import { animate } from 'motion/react'
import { snapshot } from './snapshot'

const clamp = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
const easeIn = (t) => t * t * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * The genie's shape at progress t (0 = window at rest, 1 = inside the Dock icon):
 * the sides bend into a funnel that ends at the icon, then the window pours down through it.
 * Returns the vertical extent and a function giving the left/right edge at any height.
 */
function shape(t, { x, y, w, h }, icon) {
  const { x: tx, y: ty, size: d } = icon
  const bend = easeInOut(clamp(t / 0.45))
  const bottom = lerp(y + h, ty + d / 2, easeIn(clamp(t / 0.6)))
  const top = lerp(y, ty - d / 2, easeIn(clamp((t - 0.22) / 0.78)))
  const reach = Math.max(1, ty - y)
  const edges = (yy) => {
    const s = smooth(clamp((yy - y) / reach)) * bend
    return [lerp(x, tx - d / 2, s), lerp(x + w, tx + d / 2, s)]
  }
  return { top, bottom, edges }
}

/** Where `element` sits inside `layer`, in the layer's own (unscaled) pixels. */
function measure(element, layer) {
  const scale = layer.getBoundingClientRect().width / layer.offsetWidth || 1
  const box = element.getBoundingClientRect()
  const base = layer.getBoundingClientRect()
  return {
    scale,
    rect: { x: (box.left - base.left) / scale, y: (box.top - base.top) / scale, w: box.width / scale, h: box.height / scale },
  }
}

/**
 * The macOS genie. The window is snapshotted once into a bitmap and redrawn every frame
 * as a few hundred one-pixel rows, each squeezed to the funnel's width at its height —
 * cheap enough to run at the display's full frame rate, with smooth curved sides.
 *
 * source     the window element (hide it in onStart)
 * layer      the element the window sits in; the effect is drawn over it
 * container  the element that defines cqw units (defaults to layer)
 * icon       { x, y, size } of the Dock icon, in the layer's pixels
 * from/to    progress to animate between (close 0 → 1, open 1 → 0)
 */
export function genie({ source, layer, container, icon, from, to, duration, onStart, onDone }) {
  const { scale, rect } = measure(source, layer)
  const resolution = (globalThis.devicePixelRatio || 1) * scale
  let current = from
  let cancelled = false
  let controls = null
  let cleanup = () => {}

  const run = ([render, remove]) => {
    cleanup = remove
    render(from)
    onStart?.()
    controls = animate(from, to, {
      duration,
      ease: 'linear',
      onUpdate: (t) => {
        current = t
        render(t)
      },
      onComplete: () => {
        remove()
        onDone?.()
      },
    })
  }

  snapshot(source, { rect, container: container ?? layer, resolution })
    .then((bitmap) => !cancelled && run(canvasRenderer(bitmap, layer, rect, icon, resolution)))
    // Snapshots need SVG foreignObject; fall back to animating DOM copies.
    .catch(() => !cancelled && run(stripRenderer(source, layer, rect, icon)))

  return {
    get t() {
      return current
    },
    cancel() {
      cancelled = true
      controls?.stop()
      cleanup()
    },
  }
}

function canvasRenderer(bitmap, layer, rect, icon, resolution) {
  const W = layer.offsetWidth
  const H = layer.offsetHeight
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(W * resolution)
  canvas.height = Math.round(H * resolution)
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, pointerEvents: 'none', zIndex: '1' })
  layer.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'

  const rows = Math.min(420, Math.max(80, Math.round(rect.h)))
  const sourceRow = bitmap.height / rows

  const render = (t) => {
    const { top, bottom, edges } = shape(t, rect, icon)
    ctx.setTransform(resolution, 0, 0, resolution, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const step = (bottom - top) / rows
    for (let i = 0; i < rows; i++) {
      const y0 = top + i * step
      const [left, right] = edges(y0 + step / 2)
      // A hair of overlap keeps neighbouring rows from showing seams.
      ctx.drawImage(bitmap, 0, i * sourceRow, bitmap.width, sourceRow, left, y0, right - left, step + 0.35)
    }
    canvas.style.opacity = t > 0.86 ? String(1 - (t - 0.86) / 0.14) : '1'
  }
  return [render, () => canvas.remove()]
}

function stripRenderer(source, layer, rect, icon) {
  const STRIPS = 32
  const { x, y, w, h } = rect
  const slice = h / STRIPS
  const template = source.cloneNode(true)
  Object.assign(template.style, { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px`, transform: 'none', visibility: 'visible' })
  const stage = document.createElement('div')
  stage.setAttribute('aria-hidden', 'true')
  Object.assign(stage.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '1' })
  const strips = Array.from({ length: STRIPS }, (_, i) => {
    const strip = document.createElement('div')
    Object.assign(strip.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y + i * slice}px`,
      width: `${w}px`,
      height: `${slice + 0.75}px`,
      overflow: 'hidden',
      transformOrigin: '0 0',
    })
    const copy = template.cloneNode(true)
    copy.style.top = `${-i * slice}px`
    strip.appendChild(copy)
    stage.appendChild(strip)
    return strip
  })
  layer.appendChild(stage)

  const render = (t) => {
    const { top, bottom, edges } = shape(t, rect, icon)
    const step = (bottom - top) / STRIPS
    strips.forEach((strip, i) => {
      const y0 = top + i * step
      const [left, right] = edges(y0 + step / 2)
      strip.style.transform = `translate(${left - x}px, ${y0 - (y + i * slice)}px) scale(${(right - left) / w}, ${step / slice})`
    })
    stage.style.opacity = t > 0.86 ? String(1 - (t - 0.86) / 0.14) : '1'
  }
  return [render, () => stage.remove()]
}
