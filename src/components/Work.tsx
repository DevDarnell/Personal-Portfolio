import { useReveal } from '@/lib/useReveal'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { PROJECTS } from '@/data/projects'

interface WorkProps {
  activeFilter: string | null
  flashIndex: number | null
  registerCardRef: (index: number, el: HTMLDivElement | null) => void
}

export function Work({ activeFilter, flashIndex, registerCardRef }: WorkProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="work" className="relative z-1 py-24 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div
          ref={ref}
          className={cn(
            'mb-12 max-w-[540px] transition-[opacity,transform] duration-600 ease-out',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
          )}
        >
          <p className="font-mono text-[.72rem] tracking-[.16em] text-red uppercase">WORK</p>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,2vw+.8rem,2rem)] font-semibold text-text">
            Selected work
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              flash={flashIndex === i}
              dim={!!activeFilter && activeFilter !== 'all' && !project.filterTags.includes(activeFilter)}
              ref={(el) => registerCardRef(i, el)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
