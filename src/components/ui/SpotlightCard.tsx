import { forwardRef, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  dim?: boolean
}

/**
 * Card in the 21st.dev "spotlight card" family: a radial highlight that
 * tracks the cursor (`.spotlight` in index.css) plus a subtle 3D tilt.
 * Tilt/spotlight are pointer-driven only -- skipped for touch and reduced motion.
 */
export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ dim, className, children, style, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLDivElement | null>(null)
    const finePointer = useFinePointer()
    const reduced = useReducedMotion()

    function setRefs(node: HTMLDivElement | null) {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
      if (!finePointer || reduced || !innerRef.current) return
      const r = innerRef.current.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (px - 0.5) * 8
      const ry = -(py - 0.5) * 8
      innerRef.current.style.transform = `perspective(800px) rotateX(${ry}deg) rotateY(${rx}deg)`
      innerRef.current.style.setProperty('--mx', `${px * 100}%`)
      innerRef.current.style.setProperty('--my', `${py * 100}%`)
    }
    function handleMouseLeave() {
      if (innerRef.current) innerRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'
    }

    return (
      <div
        ref={setRefs}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'spotlight glass relative overflow-hidden rounded-2xl p-8',
          'transition-[border-color,opacity,filter] duration-300 ease-out hover:border-border-hover',
          dim && 'opacity-30 saturate-50',
          className,
        )}
        style={{ transform: 'perspective(800px) rotateX(0) rotateY(0)', ...style }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
SpotlightCard.displayName = 'SpotlightCard'
