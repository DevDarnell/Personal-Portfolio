import headshot from '@/assets/headshot.jpg'
import { useReveal } from '@/lib/useReveal'
import { cn } from '@/lib/utils'

export function About() {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="relative z-1 py-24 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div
          className={cn(
            'mb-12 max-w-[540px] transition-[opacity,transform] duration-600 ease-out',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
          )}
        >
          <p className="font-mono text-[.72rem] tracking-[.16em] text-red uppercase">ABOUT</p>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,2vw+.8rem,2rem)] font-semibold text-text">
            Who&rsquo;s building this
          </h2>
        </div>
        <div
          ref={ref}
          className={cn(
            'glass grid grid-cols-[240px_1fr] items-center gap-12 rounded-[24px] p-12 transition-[opacity,transform] duration-600 ease-out',
            'max-sm:grid-cols-1 max-sm:text-center',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
          )}
        >
          <div className="relative max-sm:mx-auto max-sm:max-w-50">
            <div
              className="absolute -inset-3.5 -z-10 rounded-[30px] opacity-35 blur-[28px]"
              style={{ background: 'radial-gradient(circle, var(--color-red-mid), transparent 70%)' }}
            />
            <img
              src={headshot}
              alt="Darnell Naidu"
              className="block aspect-3/4 w-full rounded-2xl border border-border object-cover object-top shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_16px_36px_-12px_rgba(0,0,0,.6)]"
            />
          </div>
          <div>
            <blockquote className="mb-4 border-l-2 border-red pl-4 font-display text-[1.1rem] font-medium text-text max-sm:border-l-0 max-sm:border-t-2 max-sm:pt-3 max-sm:pl-0">
              &ldquo;Growth &mdash; professional, personal, and spiritual &mdash; is the throughline in how I work. I
              build software with one goal: creating solutions that genuinely help people.&rdquo;
            </blockquote>
            <p className="text-[.98rem] text-text-muted">
              Motivated and enthusiastic software developer with a Diploma in Software Development and IT,
              proficient across a broad range of languages and frameworks with strong experience in project
              development and problem-solving.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
