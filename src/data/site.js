import { Command, Smartphone } from 'lucide-react'

/**
 * Everything about you lives here. Edit freely — the whole site reads from this file
 * and from ./projects.js.
 */
export const site = {
  name: 'Rizul',
  fullName: 'Rizul Sharma',
  brand: 'Rizzfolio',
  role: 'Mac, mobile and web developer.',
  intro: 'I’m Rizul, a developer in India. I build native Mac apps, Flutter apps and developer tools, and most of them are free to download here.',
  location: 'India',
  timeZone: 'Asia/Kolkata',
  email: 'hello@example.com', // TODO: your public email

  // A downloadable résumé, same shape as a project download. Put the file in
  // /public/downloads and set e.g. { type: 'file', href: '/downloads/resume.pdf', label: 'Résumé' }.
  resume: null,

  socials: [
    { label: 'GitHub', href: 'https://github.com/rizulsharma-2003' },
    { label: 'VS Code Marketplace', href: 'https://marketplace.visualstudio.com/publishers/RizulSharma' },
    { label: 'InsideEdge on the App Store', href: 'https://apps.apple.com/in/app/insideedge-truth-or-nothing/id6752689522' },
  ],

  // Navigation. Each id must match a section on the page.
  nav: [
    { id: 'about', label: 'About' },
    { id: 'demo', label: 'Demo' },
    { id: 'work', label: 'Work' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'contact', label: 'Contact' },
  ],

  // Lights up word by word as you scroll.
  statement:
    'I like software you can feel. Windows that bounce off the edge of the screen. Files that fly across the room to the Mac next to you. A phone mirrored inside your code editor. Scroll down and watch them run.',

  // "Get the highlights" carousel. visual: 'rings' | 'code' | 'curve' | 'grid'
  // rings and grid take an `icon`; code takes a `file` name.
  highlights: [
    {
      title: 'Native Mac apps.',
      body: 'SwiftUI and AppKit utilities that live in the menu bar: window physics, peer‑to‑peer file transfer, camera‑driven focus.',
      visual: 'rings',
      icon: Command,
      colors: ['#8b5cf6', '#6f7cf0', '#ff2d55'],
    },
    {
      title: 'Motion that feels physical.',
      body: 'Springs, momentum and squash and stretch. The same curves make Boing’s windows bounce and DeskDrop’s files arc.',
      visual: 'curve',
      colors: ['#ff9f0a', '#ff4500', '#ffd60a'],
    },
    {
      title: 'Flutter, in production.',
      body: 'Over 700 commits to InsideEdge, a live iPhone and Android app with chat, calls, Live Activities and widgets.',
      visual: 'grid',
      icon: Smartphone,
      colors: ['#713ef3', '#9b7bf5', '#64d2ff'],
    },
    {
      title: 'Web, AI and developer tools.',
      body: 'Next.js and Express apps, Claude-powered pipelines, and VS Code extensions that put your phone next to your code.',
      visual: 'code',
      file: 'extension.ts',
      colors: ['#0a84ff', '#5e5ce6', '#64d2ff'],
    },
  ],
}
