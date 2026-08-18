import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const finePointer = useFinePointer()
  const active = finePointer && !reduced

  useEffect(() => {
    if (!active || !dotRef.current || !ringRef.current) return
    document.body.classList.add('custom-cursor')

    let rawX = window.innerWidth / 2
    let rawY = window.innerHeight / 2
    let ringX = rawX
    let ringY = rawY
    let raf = 0

    function onMove(e: MouseEvent) {
      rawX = e.clientX
      rawY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = `${rawX}px`
        dotRef.current.style.top = `${rawY}px`
      }
    }
    function loop() {
      ringX += (rawX - ringX) * 0.18
      ringY += (rawY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }
      raf = requestAnimationFrame(loop)
    }

    const hoverSelector = 'a, button, [role="button"]'
    function onOver(e: MouseEvent) {
      if ((e.target as HTMLElement).closest(hoverSelector)) ringRef.current?.classList.add('scale-150', 'border-red')
    }
    function onOut(e: MouseEvent) {
      const to = e.relatedTarget as HTMLElement | null
      if ((e.target as HTMLElement).closest(hoverSelector) && !to?.closest?.(hoverSelector)) {
        ringRef.current?.classList.remove('scale-150', 'border-red')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(loop)

    return () => {
      document.body.classList.remove('custom-cursor')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 transition-[width,height,border-color] duration-200 ease-out"
      />
    </>
  )
}
