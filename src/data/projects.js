import { Blinds, GraduationCap, Hand, IceCreamCone, ReceiptIndianRupee, Rocket, ScanEye, Sparkles } from 'lucide-react'

/**
 * Your projects. The work grid, the featured laptop, the downloads list and the
 * detail sheets are all generated from this list. Order matters: it's the order
 * of the work grid.
 *
 * kind      'mac' | 'mobile' | 'web' | 'tools' — drives the filters.
 * download  the main button.
 *   type 'file' — a file in /public/downloads, href '/downloads/<name>'. Same-site files
 *                 show a live progress ring; their size is detected automatically.
 *   type 'link' — anywhere else: App Store, Marketplace, GitHub, Google Drive…
 *   note        optional line shown under the button (e.g. how to open an unsigned app).
 * links     extra links in the detail sheet. Add `download: true` for a file.
 * icon      an image path, or any lucide-react icon. iconStyle 'mac' = the image already
 *           has the macOS squircle and shadow margin, so don't mask it.
 * shot      optional screenshot shown on the cover. shotStyle 'phone' adds a bezel.
 * status    shown instead of the category, e.g. 'In development'.
 * role      your part in a team project, shown in the detail sheet.
 * featured  the project in the big laptop section. wide = spans both grid columns.
 */

// Builds signed for development only, not notarized by Apple yet.
const MAC_NOTE =
  'Not notarized yet. The first time you open it, go to System Settings › Privacy & Security and click Open Anyway.'

export const KINDS = [
  { id: 'mac', label: 'Mac' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web & AI' },
  { id: 'tools', label: 'Dev tools' },
]

export const projects = [
  {
    id: 'deskdrop',
    name: 'DeskDrop',
    tagline: 'Drop files on the Mac next to you.',
    kind: 'mac',
    category: 'Mac app',
    isNew: true,
    year: 2026,
    platform: 'macOS 14 or later',
    version: '1.6.0',
    stack: ['Swift', 'SwiftUI', 'AppKit', 'Multipeer Connectivity'],
    description:
      'DeskDrop finds nearby Macs running it and lines your colleagues up side by side. Drag a file onto one and it arcs across the room; once they accept, it travels directly between the two Macs over an encrypted connection and is verified with SHA‑256 before it’s saved. There’s a Messages‑style chat too, with reactions, read receipts and typing indicators. No accounts, no cloud, no server.',
    features: [
      'Drag a file onto a colleague and watch it arc across',
      'Encrypted peer‑to‑peer transfer, verified with SHA‑256',
      'Messages‑style chat with reactions and read receipts',
      'Hold to share from anywhere, or push files off a screen edge',
    ],
    icon: '/icons/deskdrop.png',
    iconStyle: 'mac',
    colors: ['#6f7cf0', '#9ba4e4', '#3b4aa8'],
    download: { type: 'file', href: '/downloads/DeskDrop-1.6.0.dmg', label: 'Download for Mac', note: MAC_NOTE },
    featured: true,
    wide: true,
  },
  {
    id: 'boing',
    name: 'Boing',
    tagline: 'Windows with weight and momentum.',
    kind: 'mac',
    category: 'Mac app',
    status: 'Free beta',
    year: 2026,
    platform: 'macOS 14 or later',
    version: '0.1.0',
    stack: ['Swift', 'SwiftUI', 'AppKit', 'Accessibility API'],
    description:
      'A menu bar utility that makes every window on your Mac feel physical. Hold two keys and fling a window: it glides, slows down like iOS scrolling and squashes against the edge of the screen. Throw it at a side or a corner and it tiles itself; press a shortcut and every window falls to the floor and stacks. Every move makes a sound, synthesized on the spot.',
    features: [
      'Throw, flick and magnetically snap any window',
      'Gravity, Tidy and saved layouts on a shortcut',
      'Apple‑style springs with squash and stretch',
      'Synthesized sound and a one‑minute guided tour',
    ],
    icon: '/icons/boing.png',
    iconStyle: 'mac',
    colors: ['#8b5cf6', '#7f80f4', '#2e275d'],
    download: { type: 'file', href: '/downloads/Boing-0.1.0.zip', label: 'Download beta', note: MAC_NOTE },
    wide: true,
  },
  {
    id: 'running-devices',
    name: 'Running Devices',
    tagline: 'Your phone, live inside VS Code.',
    kind: 'tools',
    category: 'VS Code extension',
    year: 2026,
    platform: 'VS Code · Android and iPhone',
    version: '0.8.0',
    stack: ['TypeScript', 'scrcpy', 'WebDriverAgent'],
    description:
      'Mirror and control Android phones and iPhones right next to your code, at up to 60 fps. Click to tap, drag to swipe and type straight into the device. Flutter hot reload, hot restart and DevTools sit right above the screen, recordings have no time limit, and Logcat keeps running while your app is killed and relaunched. Nothing to install on the phone.',
    features: [
      'Android and iPhone mirroring at up to 60 fps',
      'Flutter hot reload and DevTools built in',
      'Screenshots and MP4 recordings with no time limit',
      'Wireless pairing with a QR code',
    ],
    icon: '/icons/running-devices.png',
    colors: ['#5d86f1', '#31a6e6', '#7b6cff'],
    shot: '/shots/running-devices.png',
    download: {
      type: 'link',
      href: 'https://marketplace.visualstudio.com/items?itemName=RizulSharma.running-devices',
      label: 'Install from Marketplace',
    },
    links: [
      { label: 'Download .vsix', href: '/downloads/running-devices-0.8.0.vsix', download: true },
      { label: 'Source on GitHub', href: 'https://github.com/rizulsharma-2003/running-device' },
    ],
  },
  {
    id: 'insideedge',
    name: 'InsideEdge',
    tagline: 'Real advice from college insiders.',
    kind: 'mobile',
    category: 'iPhone & Android app',
    year: 2026,
    platform: 'iOS and Android',
    version: '0.8.8',
    stack: ['Flutter', 'Bloc', 'Firebase', 'Agora', 'CallKit'],
    role: 'Core Flutter engineer · 700+ commits',
    description:
      'InsideEdge connects students with verified insiders (seniors and alumni) over 1:1 chat and calls, for honest advice on colleges, courses and careers. I’m one of the core engineers on the Flutter app, with more than 700 commits, and built the VS Code panel the team uses to ship it.',
    features: [
      'Live on the App Store and Google Play',
      '1:1 chat and voice and video calls with CallKit',
      'Live Activities and Home Screen widgets on iPhone',
      'One Flutter codebase for iOS and Android',
    ],
    icon: '/icons/insideedge.png',
    colors: ['#713ef3', '#9b7bf5', '#3d1f8f'],
    shot: '/shots/insideedge.png',
    shotStyle: 'phone',
    download: {
      type: 'link',
      href: 'https://apps.apple.com/in/app/insideedge-truth-or-nothing/id6752689522',
      label: 'App Store',
    },
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.collegevidya.insideedge' },
      { label: 'insideedge.club', href: 'https://insideedge.club' },
    ],
  },
  {
    id: 'pointer-switch',
    name: 'Pointer Switch',
    tagline: 'Look at a window. It’s focused.',
    kind: 'mac',
    category: 'Mac app',
    year: 2026,
    platform: 'macOS 14 or later',
    version: '1.0',
    stack: ['Swift', 'Vision', 'AVFoundation', 'Accessibility API'],
    description:
      'Pointer Switch uses your Mac’s camera to work out which screen, window or split pane you’re facing, and moves keyboard focus there before your first keystroke. Turn toward a display and it gets focus; glance at another editor pane and that does. Everything runs on your Mac with Apple’s Vision framework, with no accounts, no network requests and no frames saved.',
    features: [
      'On‑device head tracking with Apple’s Vision framework',
      'Focuses screens, windows and split panes',
      'Learns from your clicks as you shift in your seat',
      'Stays out of the way while you type or use the mouse',
    ],
    icon: ScanEye,
    colors: ['#63e6e2', '#30d158', '#0a84ff'],
    download: { type: 'file', href: '/downloads/Pointer-Switch-1.0.zip', note: MAC_NOTE },
  },
  {
    id: 'slap-my-mac',
    name: 'Slap My Mac',
    tagline: 'Give your MacBook a slap. It answers.',
    kind: 'mac',
    category: 'Mac app',
    year: 2026,
    platform: 'macOS 26 or later',
    version: '1.0',
    stack: ['Swift', 'SwiftUI', 'AVFoundation', 'IOKit'],
    description:
      'A menu bar toy with a serious detection engine. Slap My Mac listens for physical impacts on your MacBook and answers with a sound. Modern Macs have no public motion sensor, so it analyses sharp impulses from the microphone instead, with five sensitivity levels, a live impact graph and a tally of today’s slaps and your strongest one.',
    features: [
      'Microphone impact analysis, five sensitivity levels',
      'Live impact graph and a log console',
      'Counts today’s slaps and your strongest one',
      'Keeps listening from the menu bar',
    ],
    icon: Hand,
    colors: ['#ff453a', '#ff9f0a', '#ff375f'],
    download: { type: 'file', href: '/downloads/Slap-My-Mac-1.0.zip', note: MAC_NOTE },
  },
  {
    id: 'mac-shutter',
    name: 'Mac Shutter',
    tagline: 'Open your Mac like opening shop.',
    kind: 'mac',
    category: 'Mac app',
    year: 2026,
    platform: 'macOS 26 or later',
    version: '1.0',
    stack: ['Swift', 'SwiftUI', 'AppKit', 'AVFoundation'],
    description:
      'Every time you open the lid and unlock, a corrugated metal shutter covers the screen and rolls up with the clatter of a garage door, like a shopkeeper opening for the day. The shutter is drawn entirely in code (slats, rivets, scratches and all) and its motion is timed to the sound.',
    features: [
      'Plays after a real lid‑close and wake',
      'A shutter drawn in code, rivets and all',
      'Floats above full‑screen apps without stealing focus',
      'Launches at login, then stays out of sight',
    ],
    icon: Blinds,
    colors: ['#ff9f0a', '#a1a1a6', '#48484a'],
    download: { type: 'file', href: '/downloads/Mac-Shutter-1.0.zip', note: MAC_NOTE },
  },
  {
    id: 'split-karo',
    name: 'Split Karo',
    tagline: 'Group expenses, settled in fewer payments.',
    kind: 'mobile',
    category: 'Android app',
    status: 'In development',
    year: 2026,
    platform: 'Android',
    version: '1.0',
    stack: ['Flutter', 'Bloc', 'Hive', 'go_router'],
    description:
      'An expense‑sharing app for trips, flatmates and friends. Split Karo works out who owes whom and settles a group in the fewest possible payments, gives every group a debt‑health score, and keeps working offline, with a sync queue that catches up when you’re back online.',
    features: [
      'Settlement optimizer that minimises payments',
      'A debt‑health score for every group',
      'Offline‑first, with a background sync queue',
      'Analytics and insights with charts',
    ],
    icon: ReceiptIndianRupee,
    colors: ['#a3e635', '#30d158', '#00c7be'],
  },
  {
    id: 'research-flow',
    name: 'ResearchFlow AI',
    tagline: 'From topic to finished article, live.',
    kind: 'web',
    category: 'Web app · AI',
    year: 2026,
    platform: 'Web',
    stack: ['Next.js 15', 'Express', 'BullMQ', 'Prisma', 'Claude'],
    description:
      'Give ResearchFlow a topic and a nine‑stage pipeline powered by Claude researches it, outlines, drafts and polishes a blog post, streaming every stage to the browser as it happens. Jobs run on a BullMQ queue backed by Redis and Postgres, and are deduplicated so the same article is never generated twice.',
    features: [
      'Nine‑stage research‑to‑article pipeline',
      'Live progress over Server‑Sent Events',
      'Queued, deduplicated jobs with BullMQ and Redis',
      'Next.js 15, shadcn/ui and Prisma',
    ],
    icon: Sparkles,
    colors: ['#ffb340', '#ff6a00', '#ff2d55'],
    download: { type: 'link', href: 'https://github.com/rizulsharma-hub/research-flow-ai/archive/HEAD.zip', label: 'Download source' },
    links: [{ label: 'View on GitHub', href: 'https://github.com/rizulsharma-hub/research-flow-ai' }],
  },
  {
    id: 'sharma-ice-cream',
    name: 'Sharma Ice Cream',
    tagline: 'A whole factory, run from one dashboard.',
    kind: 'web',
    category: 'Web app',
    year: 2026,
    platform: 'Web',
    stack: ['Next.js 16', 'React 19', 'Firebase', 'jsPDF'],
    description:
      'A management system for an ice cream factory: vendors, products, billing, stock and production in one place. Bills turn into PDF invoices or WhatsApp messages in a tap, and the dashboard tracks today’s sales, low stock, pending payments and the best‑selling flavours.',
    features: [
      'Billing with PDF invoices and WhatsApp sharing',
      'Stock, production and vendor ledgers',
      'Sales trends and low‑stock alerts',
      'Next.js 16 with Firebase Firestore',
    ],
    icon: IceCreamCone,
    colors: ['#ff6482', '#ffb340', '#bf5af2'],
    download: { type: 'link', href: 'https://github.com/rizulsharma-2003/sharma_ice_cream_web/archive/HEAD.zip', label: 'Download source' },
    links: [{ label: 'View on GitHub', href: 'https://github.com/rizulsharma-2003/sharma_ice_cream_web' }],
  },
  {
    id: 'jee-predictor',
    name: 'JEE College Predictor',
    tagline: 'Your rank in. Your colleges out.',
    kind: 'web',
    category: 'Web app',
    year: 2026,
    platform: 'Web',
    stack: ['React', 'Express', 'Tailwind', 'Python'],
    description:
      'Students enter their JEE rank and filters and get matching colleges across JoSAA, JAC Delhi, IPU and AKTU. Behind it is a Python pipeline that extracts cutoff data from the official PDFs and normalises it into one dataset, which an Express API loads into memory, so no database is needed.',
    features: [
      'Cutoffs across JoSAA, JAC Delhi, IPU and AKTU',
      'Python pipeline that reads the official PDFs',
      'Express API served straight from memory',
      'React and Tailwind front end',
    ],
    icon: GraduationCap,
    colors: ['#0a84ff', '#5e5ce6', '#64d2ff'],
  },
  {
    id: 'app-builder',
    name: 'InsideEdge App Builder',
    tagline: 'Ship the app from a sidebar.',
    kind: 'tools',
    category: 'VS Code extension',
    status: 'Internal tool',
    year: 2026,
    platform: 'VS Code',
    stack: ['JavaScript', 'VS Code API', 'Shell'],
    description:
      'A VS Code panel the InsideEdge team uses to ship the app. Pick Android and/or iOS, the environment and the version, then press Build. It runs the release script, streams the log, explains failures in plain English and offers Retry, Reveal in Finder and Revert version when it’s done.',
    features: [
      'Android and iOS builds in one click',
      'Live build log, with failures explained in plain English',
      'Retry, Reveal in Finder and Revert version',
      'Works on any branch of the app repo',
    ],
    icon: Rocket,
    colors: ['#ff6a00', '#ff2d55', '#713ef3'],
  },
]

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]
