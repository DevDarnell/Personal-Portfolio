import { useReveal } from '@/lib/useReveal'
import { cn } from '@/lib/utils'

const LINKS = [
  { label: 'Email', href: 'mailto:darnell.naidu123@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/DevDarnell' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/darnell-naidu-809b6b248/' },
]

export function Contact() {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="contact" className="relative z-1 py-24 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div
          ref={ref}
          className={cn(
            'flex flex-wrap items-center justify-between gap-6 rounded-[24px] border border-border p-12 transition-[opacity,transform] duration-600 ease-out max-sm:flex-col max-sm:items-start',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
          )}
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,104,.14), rgba(255,255,255,.04))',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22), 0 20px 60px -20px rgba(255,77,104,.35)',
          }}
        >
          <div>
            <h2 className="mb-1.5 font-display text-[1.7rem] font-semibold text-text">Let&rsquo;s talk</h2>
            <p className="text-[.95rem] text-text-muted">Open to interesting internal-tools problems.</p>
          </div>
          <div className="flex gap-4">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener' : undefined}
                className="rounded-[var(--radius-pill)] border border-border bg-bg-card px-3.5 py-2 font-mono text-[.8rem] text-text-muted backdrop-blur-sm transition-colors duration-200 ease-out hover:border-red hover:text-red"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <footer className="mt-24 border-t border-border py-8 text-center">
        <p className="font-mono text-[.75rem] text-text-dim">Darnell Naidu — Full-stack developer, South Africa.</p>
      </footer>
    </section>
  )
}
