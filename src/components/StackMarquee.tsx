import { InfiniteSlider } from './ui/infinite-slider'
import { ProgressiveBlur } from './ui/progressive-blur'

const STACK_ITEMS = ['Angular', 'Node.js', 'Express', 'MSSQL', 'Nginx', 'TypeScript', 'Git', 'REST APIs']

export function StackMarquee() {
  return (
    <div className="relative z-1 border-y border-border bg-bg-card py-8 backdrop-blur-sm">
      <div className="group relative mx-auto flex max-w-[1080px] flex-col items-center gap-4 px-6 sm:flex-row">
        <p className="font-mono text-[.7rem] tracking-[.16em] text-text-dim uppercase sm:w-32 sm:shrink-0 sm:text-right">
          Built with
        </p>
        <div className="relative w-full overflow-hidden sm:w-[calc(100%-8rem)]">
          <InfiniteSlider durationOnHover={12} duration={28} gap={48}>
            {STACK_ITEMS.map((item) => (
              <span
                key={item}
                className="rounded-[10px] border border-border px-4 py-1.5 font-mono text-[.8rem] whitespace-nowrap text-text-muted"
              >
                {item}
              </span>
            ))}
          </InfiniteSlider>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
          <ProgressiveBlur direction="left" blurIntensity={1} className="pointer-events-none absolute top-0 left-0 h-full w-16" />
          <ProgressiveBlur direction="right" blurIntensity={1} className="pointer-events-none absolute top-0 right-0 h-full w-16" />
          <div className="conveyor mt-3 h-[3px] w-full rounded-full opacity-40" aria-hidden />
        </div>
      </div>
    </div>
  )
}
