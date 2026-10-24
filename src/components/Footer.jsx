import { Reveal } from './Reveal'
import { site } from '../data/site'
import { projects } from '../data/projects'

/** Apple's dense, quiet footer, plus an oversized wordmark. */
export default function Footer({ onOpen }) {
  const year = new Date().getFullYear()
  const columns = [
    {
      title: 'Work',
      links: projects.slice(0, 5).map((p) => ({ label: p.name, onClick: () => onOpen(p) })),
    },
    {
      title: 'Explore',
      links: site.nav.map((n) => ({ label: n.label, href: `#${n.id}` })),
    },
    {
      title: 'Elsewhere',
      links: site.socials.map((s) => ({ label: s.label, href: s.href, external: true })),
    },
    {
      title: 'Contact',
      links: [
        { label: site.email, href: `mailto:${site.email}` },
        ...(site.resume ? [{ label: 'Résumé', href: site.resume.href, download: site.resume.filename ?? true }] : []),
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-surface text-[12px] leading-[1.33] text-mute">
      <div className="mx-auto max-w-[1024px] px-4 pt-10 pb-6 md:px-[22px]">
        <p className="border-b border-white/10 pb-4">
          Downloads are provided as‑is. Mac apps are hosted on this site and aren’t notarized yet; on first launch, allow them in
          System Settings › Privacy &amp; Security. Other links open the official store or repository for each project.
        </p>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-2.5 font-semibold text-fog/90">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button type="button" onClick={link.onClick} className="text-[#d2d2d7]/80 hover:text-fog hover:underline">
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        download={link.download}
                        {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                        className="break-all text-[#d2d2d7]/80 hover:text-fog hover:underline"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 md:flex-row md:justify-between">
          <p>
            Copyright © {year} {site.fullName ?? site.name}. All rights reserved.
          </p>
          <p>Built in {site.location} with React.</p>
        </div>
      </div>

      <Reveal y={80} amount={0.2} aria-hidden className="pointer-events-none select-none">
        <p className="-mb-[0.18em] text-center text-[19vw] leading-[0.85] font-bold tracking-[-0.06em] text-white/[0.045]">
          {site.brand.toUpperCase()}.
        </p>
      </Reveal>
    </footer>
  )
}
