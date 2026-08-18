import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
]

export function Nav() {
  const navRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    function update() {
      const t = Math.max(0, Math.min(window.scrollY / 120, 1))
      navRef.current?.style.setProperty('--scroll-t', String(t))
      ticking = false
    }
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-[28px] border border-border shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_10px_30px_rgba(0,0,0,.5)] sm:w-auto sm:rounded-[var(--radius-pill)]"
      style={{
        background: 'rgba(255,255,255, calc(0.045 + var(--scroll-t, 0) * 0.08))',
        backdropFilter: 'blur(calc(14px + var(--scroll-t, 0) * 10px)) saturate(150%)',
        WebkitBackdropFilter: 'blur(calc(14px + var(--scroll-t, 0) * 10px)) saturate(150%)',
      }}
    >
      <div className="flex items-center justify-between gap-8 py-2.5 pr-2.5 pl-5.5">
        <a href="#top" className="font-mono text-[.95rem] whitespace-nowrap text-text" onClick={() => setOpen(false)}>
          darnell<span className="text-red">.dev</span>
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="font-mono text-[.8rem] text-text-muted hover:text-text">
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-[var(--radius-pill)] border border-white/20 bg-gradient-to-br from-red-mid to-red-deep px-4.5 py-2 font-mono text-[.78rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_6px_18px_rgba(255,77,104,.35)]"
          >
            Get in touch
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative -m-2.5 z-20 block p-2.5 text-text sm:hidden"
        >
          <Menu className={`m-auto size-5 transition-all duration-200 ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
          <X
            className={`absolute inset-0 m-auto size-5 transition-all duration-200 ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border px-5.5 pt-4 pb-5 sm:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-[.85rem] text-text-muted hover:text-text"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="rounded-[var(--radius-pill)] border border-white/20 bg-gradient-to-br from-red-mid to-red-deep px-4.5 py-2 text-center font-mono text-[.78rem] font-medium text-white"
          >
            Get in touch
          </a>
        </div>
      )}
    </nav>
  )
}
