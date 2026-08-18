import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScreenshotGalleryProps {
  images: { src: string; alt: string }[]
}

export function ScreenshotGallery({ images }: ScreenshotGalleryProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  function scrollTo(idx: number) {
    const el = scrollRef.current
    if (!el) return
    const item = el.children[idx] as HTMLElement
    if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActive(idx)
  }

  function prev() { scrollTo(Math.max(0, active - 1)) }
  function next() { scrollTo(Math.min(images.length - 1, active + 1)) }

  return (
    <>
      <div className="mt-5 space-y-2">
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
          onScroll={(e) => {
            const el = e.currentTarget
            const idx = Math.round(el.scrollLeft / (el.scrollWidth / images.length))
            setActive(idx)
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { scrollTo(i); setLightbox(i) }}
              className={cn(
                'relative flex-none snap-center overflow-hidden rounded-xl border transition-all duration-200',
                'w-[min(72vw,380px)]',
                active === i ? 'border-red shadow-[0_0_16px_rgba(255,77,104,.3)]' : 'border-border opacity-70 hover:opacity-100 hover:border-border-hover',
              )}
              aria-label={`View screenshot: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="block w-full aspect-video object-cover object-top"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Dot + arrow controls */}
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to screenshot ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  active === i ? 'w-5 bg-red' : 'w-1.5 bg-border hover:bg-border-hover',
                )}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              disabled={active === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-red hover:text-red disabled:opacity-30"
              aria-label="Previous screenshot"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={active === images.length - 1}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-red hover:text-red disabled:opacity-30"
              aria-label="Next screenshot"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
          aria-label="Screenshot lightbox"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="block max-h-[82vh] max-w-[88vw] rounded-xl border border-border object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-bg border border-border text-text-muted hover:text-red"
              aria-label="Close"
            >
              ×
            </button>
            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-border text-text hover:border-red"
                aria-label="Previous"
              >
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {lightbox < images.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-border text-text hover:border-red"
                aria-label="Next"
              >
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <p className="mt-2 text-center font-mono text-[.72rem] text-text-dim">
              {images[lightbox].alt} · {lightbox + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
