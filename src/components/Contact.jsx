import { ArrowUpRight } from 'lucide-react'
import DownloadButton from './DownloadButton'
import { Reveal } from './Reveal'
import { site } from '../data/site'

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-32 md:py-44">
      <Reveal className="mx-auto max-w-[760px] text-center">
        <h2 className="type-display">Get in touch.</h2>
        <p className="type-lead mx-auto mt-5 max-w-[560px] text-mute">
          Questions about one of the apps, a role, or something you’d like built? Send me an email.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href={`mailto:${site.email}`} className="btn btn-primary btn-lg">
            Email me
          </a>
          {site.resume && <DownloadButton download={site.resume} variant="outline" size="lg" label="Download résumé" />}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {site.socials.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="link-chevron text-[17px]">
              {social.label}
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
