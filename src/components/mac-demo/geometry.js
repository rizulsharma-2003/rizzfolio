/**
 * The virtual Mac screen is a 16:10 container: 100cqw wide, 62.5cqw tall.
 * Everything on it is laid out in cqw so it scales with the laptop.
 */
export const SCREEN_H = 62.5
export const MENU_H = 2.2

export const DOCK = { icon: 3.5, gap: 0.42, pad: 0.55, bottom: 0.7, sep: 1.1 }

// Left to right, as they sit in the Dock. 'sep' is a divider.
export const DOCK_ITEMS = ['deskdrop', 'boing', 'pointer-switch', 'slap-my-mac', 'mac-shutter', 'sep', 'code', 'browser', 'sep', 'trash']

function layoutDock() {
  const slots = {}
  let x = DOCK.pad
  DOCK_ITEMS.forEach((id, i) => {
    if (id === 'sep') {
      slots[`sep-${i}`] = { x: x + DOCK.sep / 2 - DOCK.gap / 2, sep: true }
      x += DOCK.sep
      return
    }
    slots[id] = { x: x + DOCK.icon / 2 }
    x += DOCK.icon + DOCK.gap
  })
  const width = x - DOCK.gap + DOCK.pad
  const height = DOCK.icon + DOCK.pad * 2
  const left = 50 - width / 2
  const top = SCREEN_H - DOCK.bottom - height
  for (const slot of Object.values(slots)) {
    slot.x += left
    slot.y = top + DOCK.pad + DOCK.icon / 2
  }
  return { slots, width, height, left, top }
}

export const dock = layoutDock()

/**
 * Where a window has to go to disappear into its Dock icon. Windows scale from their
 * bottom-centre, so translations are expressed in % of the window's own size.
 */
export function toDock(frame, app) {
  const slot = dock.slots[app] ?? dock.slots.trash
  const fx = frame.x + frame.w / 2
  const fy = frame.y + frame.h
  return {
    dx: ((slot.x - fx) / frame.w) * 100,
    dy: ((slot.y + DOCK.icon / 2 - fy) / frame.h) * 100,
    sx: DOCK.icon / frame.w,
    sy: DOCK.icon / frame.h,
  }
}
