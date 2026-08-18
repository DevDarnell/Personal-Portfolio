import { useReveal } from '@/lib/useReveal'
import { cn } from '@/lib/utils'

const SKILLS: { label: string; filter: string }[] = [
  { label: 'Angular', filter: 'angular' },
  { label: 'TypeScript', filter: 'all' },
  { label: 'Node.js', filter: 'node' },
  { label: 'Express', filter: 'node' },
  { label: 'MSSQL', filter: 'mssql' },
  { label: 'Nginx', filter: 'nginx' },
  { label: 'Git', filter: 'all' },
  { label: 'REST APIs', filter: 'all' },
  { label: 'Multi-tenant architecture', filter: 'multitenant' },
  { label: 'Workflow automation', filter: 'automation' },
  { label: 'Chrome Extensions', filter: 'automation' },
  { label: 'RxJS', filter: 'node' },
]

interface StackProps {
  activeLabel: string | null
  onSelect: (skill: { label: string; filter: string }) => void
}

export function Stack({ activeLabel, onSelect }: StackProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="stack" className="relative z-1 py-24 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div
          ref={ref}
          className={cn(
            'mb-12 max-w-[540px] transition-[opacity,transform] duration-600 ease-out',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
          )}
        >
          <p className="font-mono text-[.72rem] tracking-[.16em] text-red uppercase">STACK</p>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,2vw+.8rem,2rem)] font-semibold text-text">Toolkit</h2>
          <p className="mt-1.5 font-mono text-[.76rem] text-text-dim">Click a skill to see where it shows up above.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {SKILLS.map((skill) => (
            <button
              key={skill.label}
              onClick={() => onSelect(skill)}
              className={cn(
                'rounded-[var(--radius-pill)] border border-border bg-bg-card px-4 py-2.5 font-mono text-[.85rem] text-text backdrop-blur-sm',
                'transition-[border-color,background-color,color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-red hover:bg-red-dim',
                activeLabel === skill.label && 'border-red bg-red-dim text-red shadow-[0_4px_16px_rgba(255,77,104,.25)]',
              )}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
