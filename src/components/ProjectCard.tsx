import { forwardRef } from 'react'
import { SpotlightCard } from './ui/SpotlightCard'
import { ScreenshotGallery } from './ScreenshotGallery'
import { useReveal } from '@/lib/useReveal'
import { cn } from '@/lib/utils'

export interface Project {
  id: string
  title: string
  description: string
  caseNote?: string
  tags: string[]
  filterTags: string[]
  screenshots?: { src: string; alt: string }[]
}

interface ProjectCardProps {
  project: Project
  index: number
  dim: boolean
  flash: boolean
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(({ project, index, dim, flash }, ref) => {
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={revealRef}
      className={cn(
        'transition-[opacity,transform] duration-600 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4.5 opacity-0',
      )}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <SpotlightCard
        ref={ref}
        dim={dim}
        className={cn(
          'grid grid-cols-[auto_1fr] gap-8 max-sm:grid-cols-1',
          flash && 'animate-[flash_1.1s_ease]',
        )}
      >
        <span className="border-r border-border pr-4 font-mono text-[.72rem] tracking-[.1em] text-red [writing-mode:vertical-rl] max-sm:mb-1 max-sm:border-r-0 max-sm:border-b max-sm:pr-0 max-sm:pb-2 max-sm:[writing-mode:horizontal-tb]">
          {project.id}
        </span>
        <div>
          <h3 className="mb-2 font-display text-xl font-semibold text-text">{project.title}</h3>
          <p className="mb-3 text-[.94rem] text-text-muted">{project.description}</p>
          {project.caseNote && (
            <p className="mb-3 rounded-r-[10px] border-l-2 border-red bg-red-dim px-3 py-2 font-mono text-[.78rem] text-red">
              &#8618; {project.caseNote}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-[10px] border border-border px-2.5 py-1 font-mono text-[.72rem] text-text-muted">
                {tag}
              </span>
            ))}
          </div>
          {project.screenshots && project.screenshots.length > 0 && (
            <ScreenshotGallery images={project.screenshots} />
          )}
        </div>
      </SpotlightCard>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'
