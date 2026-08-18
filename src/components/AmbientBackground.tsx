import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks'

export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !glowRef.current) return
    const el = glowRef.current
    function onMove(e: MouseEvent) {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-bg" aria-hidden>
        <span
          className="absolute -top-40 -left-25 h-[560px] w-[560px] rounded-full opacity-35 blur-[90px]"
          style={{
            background: 'radial-gradient(circle, var(--color-red-mid) 0%, transparent 70%)',
            animation: reduced ? undefined : 'drift 26s ease-in-out infinite',
          }}
        />
        <span
          className="absolute -right-20 -bottom-35 h-[460px] w-[460px] rounded-full opacity-25 blur-[90px]"
          style={{
            background: 'radial-gradient(circle, var(--color-red-mid) 0%, transparent 70%)',
            animation: reduced ? undefined : 'drift 32s ease-in-out infinite -8s',
          }}
        />
        <span
          className="absolute top-[38%] left-[58%] h-[360px] w-[360px] rounded-full opacity-20 blur-[90px]"
          style={{
            background: 'radial-gradient(circle, var(--color-red-mid) 0%, transparent 70%)',
            animation: reduced ? undefined : 'drift 36s ease-in-out infinite -16s',
          }}
        />
      </div>
      {!reduced && (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none fixed z-40 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
          style={{
            left: -999,
            top: -999,
            background: 'radial-gradient(circle, rgba(255,77,104,.14), transparent 70%)',
          }}
        />
      )}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-30px) scale(1.15); }
        }
      `}</style>
    </>
  )
}
