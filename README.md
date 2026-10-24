# Rizzfolio

A personal portfolio in the style of an Apple product page: React + Vite, Tailwind CSS v4 and Motion.
Showcase your projects and let people download them, either as files you host or as links to a store or release page.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

Requires Node 20.19+ (or 22.12+).

## Make it yours

Almost everything comes from two files:

| File | What's in it |
| --- | --- |
| `src/data/site.js` | Name, intro, email, location/time zone, résumé, socials, the scrolling statement, highlights carousel, stats, contact cards |
| `src/data/projects.js` | Your projects: they appear in the work grid, the featured laptop, the downloads list and the detail sheets |

### Adding a project

```js
{
  id: 'my-app',
  name: 'My App',
  tagline: 'One line that sells it.',
  kind: 'mac',                    // 'mac' | 'mobile' | 'web' | 'tools' (drives the filters)
  category: 'Mac app',
  status: 'In development',       // optional, replaces the category above the name
  role: 'Lead engineer',          // optional, for team projects
  year: 2026,
  version: '1.0.0',
  platform: 'macOS 14 or later',
  stack: ['Swift'],
  description: 'A paragraph for the detail sheet.',
  features: ['Three', 'short', 'bullets'],
  icon: '/icons/my-app.png',      // an image, or any lucide-react icon (e.g. Sparkles)
  iconStyle: 'mac',               // the image already has the macOS squircle: don't mask it
  colors: ['#ff6a00', '#ff2d55', '#7a5cff'],
  shot: '/shots/my-app.png',      // optional screenshot on the cover
  shotStyle: 'phone',             // adds an iPhone bezel
  download: { type: 'file', href: '/downloads/MyApp-1.0.0.zip', note: 'Shown under the button.' },
  links: [
    { label: 'Source code', href: 'https://github.com/you/my-app' },
    { label: 'Download .vsix', href: '/downloads/my-ext.vsix', download: true },
  ],
  featured: false,                // true = the big laptop section
  wide: false,                    // true = spans both grid columns
}
```

### Downloads: files vs links

- **File you host**: put it in `public/downloads/` and use `{ type: 'file', href: '/downloads/name.zip' }`.
  The button streams it with a live progress ring and the size is detected automatically
  (or set `size: '12 MB'`). Optional: `filename` to rename it on save, `label` for the button text.
- **Link**: `{ type: 'link', href: 'https://…', label: 'Get it on the App Store' }`, for the App Store, TestFlight,
  GitHub Releases, Gumroad, Google Drive and so on. It opens in a new tab.

`public/downloads/` holds the real builds: DeskDrop, Boing, Pointer Switch, Slap My Mac, Mac Shutter and the
Running Devices `.vsix`. The Mac apps are ad-hoc or development signed, not notarized, so the site tells visitors how
to open them. Once you have a Developer ID, notarize them and remove the `note` from each download.

To ship a new version, replace the file and update `href`/`version` in `projects.js`.

## The MacBook demo

The pinned MacBook section (`src/components/mac-demo/`) plays a scroll-driven tour: the laptop zooms out, Mac
Shutter's door rolls up, then each app launches from the Dock, runs a short demo, and minimises into the Dock as
the next one opens. Visitors can jump between apps with the chapter strip or press **Skip demo**.

| File | What it controls |
| --- | --- |
| `MacDemo.jsx` | `SEGMENTS`: the order of the tour and how much scrolling (vh) each part gets |
| `scenes/index.js` | which scene component plays for each segment, its Dock app and menu-bar icon |
| `scenes/*.jsx` | the demos themselves (DeskDrop, Boing, Pointer Switch, Slap My Mac, Running Devices, web apps) |
| `geometry.js` | the screen grid (everything is in `cqw`, 100 wide × 62.5 tall) and the Dock's icons |
| `MacWindow.jsx`, `genie.js` | windows that open from and minimise into the Dock with the macOS genie effect |
| `DemoPlayer.jsx` | the full-screen player behind each project's **Watch demo** button (`DEMOS` in `scenes/index.js` maps projects to scenes) |

To add an app: add its Dock icon id to `DOCK_ITEMS`, write a scene that renders one or more `<MacWindow app="…">`
(use `useStoryboard` to step through its demo), register it in `scenes/index.js`, and add a segment to `SEGMENTS`.
The demos recreate each app's real UI from its source: colours, strings and animation curves.

## What's where

```
src/
  App.jsx                 page order
  index.css               design tokens, type scale, buttons, keyframes
  data/                   ← edit these
  components/
    Nav                   the sticky, frosted navigation bar
    Hero                  glowing halo and tracking-in title
    Statement             paragraph that lights up word by word on scroll
    mac-demo/             the pinned MacBook demo and the Watch demo player
    Projects              homepage-style promo tiles
    Highlights            auto-playing carousel with progress pills
    Downloads             App Store-style list with GET buttons and filters
    Contact, Footer
    ProjectModal          detail sheet
    DownloadButton        GET / pill buttons with progress
  hooks/useDownload.js    download logic (progress, size detection)
```

Animations respect the visitor's "Reduce motion" setting.

## Deploy

It's a static site. Run `npm run build` and upload `dist/` to Vercel, Netlify, Cloudflare Pages,
GitHub Pages or any static host. With Vercel or Netlify you can also just connect the repo, since they detect Vite automatically.
