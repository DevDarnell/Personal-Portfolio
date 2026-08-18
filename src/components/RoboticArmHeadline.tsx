import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks'

/** How far the arm's canvas extends beyond the headline block on every side. */
const PAD = 44

interface Spark {
  x: number
  y: number
  r: number
  life: number
}

/**
 * Automation set-piece: a two-joint robotic arm (solved with inverse
 * kinematics each frame) carries a glowing "component" to each word's
 * position, the word pops in as it's placed, sparks fly, and once the
 * sentence is complete the arm retracts and powers down while the headline
 * fires a red glow. Skipped entirely under prefers-reduced-motion.
 */
export function RoboticArmHeadline({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [placedCount, setPlacedCount] = useState(0)
  const [complete, setComplete] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setPlacedCount(words.length)
      setComplete(true)
      return
    }
    const containerEl = containerRef.current
    const canvasEl = canvasRef.current
    if (!containerEl || !canvasEl) return
    const ctx2d = canvasEl.getContext('2d')
    if (!ctx2d) return
    // Re-alias into narrowed consts: function declarations below are hoisted,
    // so TS won't carry the null-guard narrowing into them otherwise.
    const container: HTMLDivElement = containerEl
    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = ctx2d

    let disposed = false
    let started = false
    let raf = 0
    let w = 0
    let h = 0
    let base = { x: 0, y: 0 }
    let L1 = 0
    let L2 = 0
    let targets: { x: number; y: number }[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const sim = {
      phase: 'pause' as 'moving' | 'pause' | 'parking' | 'done',
      idx: 0,
      gx: 0,
      gy: 0,
      tx: 0,
      ty: 0,
      waitUntil: 0,
      fade: 1,
      sparks: [] as Spark[],
    }

    function measure() {
      w = container.clientWidth + PAD * 2
      h = container.clientHeight + PAD * 2
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cRect = canvas.getBoundingClientRect()
      targets = wordRefs.current.map((el) => {
        if (!el) return { x: w / 2, y: h / 2 }
        const r = el.getBoundingClientRect()
        return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height * 0.4 }
      })
      base = { x: w - 16, y: h - 18 }
      const maxDist = Math.max(120, ...targets.map((t) => Math.hypot(t.x - base.x, t.y - base.y)))
      L1 = maxDist * 0.56
      L2 = maxDist * 0.56
    }

    /** Two-segment inverse kinematics: joint angles for a given gripper target. */
    function solveIK(txr: number, tyr: number) {
      let dx = txr - base.x
      let dy = tyr - base.y
      let d = Math.hypot(dx, dy)
      const maxR = L1 + L2 - 2
      const minR = Math.abs(L1 - L2) + 2
      const clamped = Math.max(minR, Math.min(d, maxR))
      if (d > 0 && clamped !== d) {
        dx *= clamped / d
        dy *= clamped / d
        d = clamped
      }
      const a = Math.atan2(dy, dx)
      const cosA1 = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)
      const a1 = a - Math.acos(Math.max(-1, Math.min(1, cosA1)))
      return {
        ex: base.x + Math.cos(a1) * L1,
        ey: base.y + Math.sin(a1) * L1,
        gx: base.x + dx,
        gy: base.y + dy,
      }
    }

    function drawArm(alpha: number, carrying: boolean) {
      const { ex, ey, gx, gy } = solveIK(sim.gx, sim.gy)
      ctx.lineCap = 'round'
      // segments
      ctx.strokeStyle = `rgba(245,245,247,${0.55 * alpha})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(base.x, base.y)
      ctx.lineTo(ex, ey)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ex, ey)
      ctx.lineTo(gx, gy)
      ctx.stroke()
      // base + joints
      ctx.beginPath()
      ctx.arc(base.x, base.y, 6, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255,77,104,${0.8 * alpha})`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(245,245,247,${0.8 * alpha})`
      ctx.fill()
      // gripper claw, oriented along the forearm
      const ang = Math.atan2(gy - ey, gx - ex)
      ctx.strokeStyle = `rgba(245,245,247,${0.75 * alpha})`
      ctx.lineWidth = 2
      for (const spread of [-0.5, 0.5]) {
        ctx.beginPath()
        ctx.moveTo(gx, gy)
        ctx.lineTo(gx + Math.cos(ang + spread) * 9, gy + Math.sin(ang + spread) * 9)
        ctx.stroke()
      }
      // carried payload
      if (carrying) {
        ctx.beginPath()
        ctx.arc(gx + Math.cos(ang) * 6, gy + Math.sin(ang) * 6, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,77,104,${alpha})`
        ctx.shadowColor = '#ff4d68'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function frame(now: number) {
      if (disposed) return
      ctx.clearRect(0, 0, w, h)

      if (sim.phase === 'moving' || sim.phase === 'parking') {
        sim.gx += (sim.tx - sim.gx) * 0.16
        sim.gy += (sim.ty - sim.gy) * 0.16
        if (Math.hypot(sim.tx - sim.gx, sim.ty - sim.gy) < 3) {
          if (sim.phase === 'moving') {
            setPlacedCount(sim.idx + 1)
            sim.sparks.push({ x: sim.tx, y: sim.ty, r: 2, life: 1 })
            sim.idx += 1
            sim.phase = 'pause'
            sim.waitUntil = now + 90
          } else {
            sim.phase = 'done'
            setComplete(true)
          }
        }
      } else if (sim.phase === 'pause' && now >= sim.waitUntil) {
        if (sim.idx < targets.length) {
          sim.phase = 'moving'
          sim.tx = targets[sim.idx].x
          sim.ty = targets[sim.idx].y
        } else {
          sim.phase = 'parking'
          sim.tx = base.x - 30
          sim.ty = base.y - 12
        }
      }

      if (sim.phase === 'done') sim.fade = Math.max(0, sim.fade - 0.03)
      drawArm(0.6 * sim.fade, sim.phase === 'moving')

      sim.sparks.forEach((s) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,77,104,${0.7 * s.life})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        s.r += 1.1
        s.life -= 0.045
      })
      sim.sparks = sim.sparks.filter((s) => s.life > 0)

      if (sim.phase !== 'done' || sim.fade > 0 || sim.sparks.length > 0) {
        raf = requestAnimationFrame(frame)
      }
    }

    function start() {
      if (started || disposed) return
      started = true
      measure()
      sim.gx = base.x
      sim.gy = base.y
      sim.waitUntil = performance.now()
      raf = requestAnimationFrame(frame)
    }

    // Wait for the panel entrance + web fonts so word positions are final.
    const startDelay = window.setTimeout(() => {
      void document.fonts.ready.then(() => start())
    }, 700)
    function onResize() {
      if (started && sim.phase !== 'done') measure()
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      window.clearTimeout(startDelay)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, text])

  return (
    <div ref={containerRef} className="relative">
      <h1 aria-label={text} className={cn(className, complete && 'headline-glow')}>
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el
            }}
            aria-hidden
            className={cn(
              'mr-[0.28em] inline-block transition-[opacity,transform] duration-200 ease-out',
              i < placedCount ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
          >
            {word}
          </span>
        ))}
      </h1>
      {!reduced && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ left: -PAD, top: -PAD }}
        />
      )}
    </div>
  )
}
