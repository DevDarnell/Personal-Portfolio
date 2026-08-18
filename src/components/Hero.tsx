import { useEffect, useRef, useState } from 'react'
import { RouteCanvas } from './RouteCanvas'
import { RoboticArmHeadline } from './RoboticArmHeadline'
import { ShimmerButton } from './ui/ShimmerButton'
import { useReducedMotion } from '@/lib/hooks'

const HEADLINE = 'Workflows that think. Systems that scale.'

export function Hero({ onProjectClick }: { onProjectClick: (cardIndex: number) => void }) {
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()
  const heroInnerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setMounted(true), 60))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!reduced) return
    const el = heroInnerRef.current
    if (!el) return
    el.style.opacity = '1'
    el.style.transform = 'none'
    Array.from(el.children).forEach((c) => ((c as HTMLElement).style.opacity = '1'))
  }, [reduced])

  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const canvas = document.getElementById('route-canvas-wrap')
        if (canvas && !reduced) canvas.style.transform = `translateY(${Math.min(window.scrollY * 0.16, 70)}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  const show = mounted || reduced
  const base = 'opacity-0 translate-y-4 transition-[opacity,transform] duration-700 ease-out'
  const on = 'opacity-100 translate-y-0'

  return (
    <section className="relative flex min-h-[100vh] min-h-[100dvh] items-center overflow-hidden pt-28" id="top">
      <div id="route-canvas-wrap" className="absolute inset-0 will-change-transform">
        <RouteCanvas onProjectClick={onProjectClick} />
      </div>
      <div className="absolute right-6 bottom-6 z-2 hidden font-mono text-[.7rem] text-text-dim sm:block">
        click a node to jump to that project
      </div>
      <div className="relative z-2 mx-auto max-w-[1120px] px-6">
        <div
          ref={heroInnerRef}
          className="glass max-w-[600px] rounded-[28px] p-12 transition-[opacity,transform] duration-500 ease-out"
          style={reduced ? undefined : { opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1)' : 'scale(0.97)' }}
        >
          <p className={`font-mono text-[.75rem] tracking-[.14em] text-red uppercase ${base} ${show ? on : ''}`}>
            FULL-STACK DEVELOPER &middot; SOUTH AFRICA<span className="cursor-blink ml-0.5 inline-block">_</span>
          </p>
          <RoboticArmHeadline
            text={HEADLINE}
            className="my-4 font-display text-[clamp(2.1rem,3.8vw+1rem,3.2rem)] leading-[1.1] font-semibold text-text"
          />
          <p
            className={`mb-8 max-w-[500px] text-[1.02rem] text-text-muted ${base} ${show ? on : ''}`}
            style={{ transitionDelay: show ? '220ms' : '0ms' }}
          >
            Ticketing platforms, approval workflows, and multi-tenant systems &mdash; the internal plumbing that has
            to work quietly, every single time.
          </p>
          <div
            className={`flex flex-wrap gap-4 ${base} ${show ? on : ''}`}
            style={{ transitionDelay: show ? '300ms' : '0ms' }}
          >
            <ShimmerButton href="#work" variant="primary">
              See the work
            </ShimmerButton>
            <ShimmerButton href="#contact" variant="ghost">
              Get in touch
            </ShimmerButton>
          </div>
        </div>
      </div>
    </section>
  )
}
