import { forwardRef, useRef } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'

interface ShimmerButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'ghost'
}

/**
 * Button in the 21st.dev "shimmer button" family: a diagonal light sweep on
 * hover (pure CSS, see `.shimmer` in index.css) plus a magnetic pointer-follow
 * and a click ripple, both skipped for touch and reduced-motion.
 */
export const ShimmerButton = forwardRef<HTMLAnchorElement, ShimmerButtonProps>(
  ({ variant = 'primary', className, children, onClick, ...props }, ref) => {
    const innerRef = useRef<HTMLAnchorElement | null>(null)
    const finePointer = useFinePointer()
    const reduced = useReducedMotion()

    function setRefs(node: HTMLAnchorElement | null) {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLAnchorElement | null>).current = node
    }

    function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
      if (!finePointer || reduced || !innerRef.current) return
      const r = innerRef.current.getBoundingClientRect()
      const mx = e.clientX - r.left - r.width / 2
      const my = e.clientY - r.top - r.height / 2
      innerRef.current.style.transform = `translate(${mx * 0.22}px, ${my * 0.32 - 2}px)`
    }
    function handleMouseLeave() {
      if (innerRef.current) innerRef.current.style.transform = ''
    }
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      const el = innerRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const ripple = document.createElement('span')
        ripple.className =
          'pointer-events-none absolute -mt-2 -ml-2 h-4 w-4 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.85),rgba(255,77,104,.4)_60%,transparent_72%)] opacity-55 transition-[transform,opacity] duration-500 ease-out'
        ripple.style.left = `${e.clientX - rect.left}px`
        ripple.style.top = `${e.clientY - rect.top}px`
        el.appendChild(ripple)
        requestAnimationFrame(() => {
          ripple.style.transform = 'scale(3.2)'
          ripple.style.opacity = '0'
        })
        setTimeout(() => ripple.remove(), 500)
      }
      onClick?.(e)
    }

    return (
      <a
        ref={setRefs}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={cn(
          'shimmer relative inline-block overflow-hidden rounded-[var(--radius-pill)] px-[22px] py-3',
          'font-mono text-[.82rem] transition-[border-color,background-color] duration-200 ease-out',
          variant === 'primary'
            ? 'border border-white/20 bg-gradient-to-br from-red-mid to-red-deep font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.32),0_10px_28px_-8px_rgba(255,77,104,.5)] hover:brightness-[1.06]'
            : 'border border-border bg-bg-card text-text backdrop-blur-md hover:border-red',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    )
  },
)
ShimmerButton.displayName = 'ShimmerButton'
