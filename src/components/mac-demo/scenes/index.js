import { Eye, Hand } from 'lucide-react'
import DeskDropScene from './deskdrop'
import BoingScene from './BoingScene'
import PointerSwitchScene from './PointerSwitchScene'
import SlapScene from './SlapScene'
import RunningDevicesScene from './RunningDevicesScene'
import BrowserScene from './BrowserScene'

/**
 * Scenes shown on the demo MacBook, keyed by MacDemo segment id.
 * app       the Dock item that launches it (and gets the running dot)
 * menuIcon  shown in the menu bar while the scene is on screen
 */
export const SCENES = {
  deskdrop: { app: 'deskdrop', Component: DeskDropScene },
  boing: { app: 'boing', Component: BoingScene },
  'pointer-switch': { app: 'pointer-switch', menuIcon: Eye, Component: PointerSwitchScene },
  'slap-my-mac': { app: 'slap-my-mac', menuIcon: Hand, Component: SlapScene },
  'running-devices': { app: 'code', Component: RunningDevicesScene },
  web: { app: 'browser', Component: BrowserScene },
}

/** Which scene the "Watch demo" player shows for each project. Mac Shutter plays its shutter. */
export const DEMOS = {
  'mac-shutter': { shutter: true },
  deskdrop: { scene: 'deskdrop' },
  boing: { scene: 'boing' },
  'pointer-switch': { scene: 'pointer-switch' },
  'slap-my-mac': { scene: 'slap-my-mac' },
  'running-devices': { scene: 'running-devices' },
  'research-flow': { scene: 'web', tab: 0 },
  'sharma-ice-cream': { scene: 'web', tab: 1 },
  'jee-predictor': { scene: 'web', tab: 2 },
}
