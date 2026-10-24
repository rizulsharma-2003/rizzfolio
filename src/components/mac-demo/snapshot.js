/**
 * Renders an element into a bitmap so it can be redrawn cheaply many times per frame.
 * The element is cloned into an SVG <foreignObject> together with the page's CSS (and its
 * images inlined), then rasterised once onto a canvas.
 */

const imageCache = new Map()
let cssCache = { count: -1, text: '' }

function pageCss() {
  const sheets = document.styleSheets
  if (cssCache.count === sheets.length) return cssCache.text
  let text = ''
  for (const sheet of sheets) {
    try {
      for (const rule of sheet.cssRules) text += `${rule.cssText}\n`
    } catch {
      // Cross-origin sheets (web fonts) can't be read; system fonts cover the snapshot.
    }
  }
  cssCache = { count: sheets.length, text: text.replaceAll(']]>', ']]\\>') }
  return cssCache.text
}

function asDataUrl(src) {
  if (!imageCache.has(src)) {
    const request = fetch(src)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          }),
      )
      .catch(() => src)
    imageCache.set(src, request)
  }
  return imageCache.get(src)
}

/**
 * rect        the element's box inside `container`, in CSS px
 * container   the element that defines cqw units (the virtual screen)
 * resolution  device pixels per CSS px
 * Resolves to a canvas holding the element at that resolution.
 */
export async function snapshot(element, { rect, container, resolution }) {
  const clone = element.cloneNode(true)
  Object.assign(clone.style, {
    position: 'absolute',
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.w}px`,
    height: `${rect.h}px`,
    transform: 'none',
    visibility: 'visible',
    margin: '0',
  })
  await Promise.all(
    [...clone.querySelectorAll('img')].map(async (img) => {
      img.setAttribute('src', await asDataUrl(img.src))
      img.removeAttribute('loading')
      img.removeAttribute('srcset')
    }),
  )

  const W = container.offsetWidth
  const H = container.offsetHeight
  const base =
    'position:absolute;margin:0;container-type:inline-size;color:#f5f5f7;font-size:17px;line-height:1.47;letter-spacing:-0.012em;' +
    "font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;" +
    '-webkit-font-smoothing:antialiased'
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.w}" height="${rect.h}" viewBox="0 0 ${rect.w} ${rect.h}">` +
    `<foreignObject x="0" y="0" width="${rect.w}" height="${rect.h}">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="${base};left:${-rect.x}px;top:${-rect.y}px;width:${W}px;height:${H}px">` +
    `<style><![CDATA[${pageCss()}]]></style>` +
    new XMLSerializer().serializeToString(clone) +
    `</div></foreignObject></svg>`

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(rect.w * resolution))
    canvas.height = Math.max(1, Math.round(rect.h * resolution))
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}
