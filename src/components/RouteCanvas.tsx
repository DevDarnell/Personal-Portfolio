import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks'

interface ProjectNode {
  x: number
  y: number
  label: string
  cardIndex: number
}

const PROJECT_NODES: ProjectNode[] = [
  { x: 0.84, y: 0.18, label: 'IDESK', cardIndex: 0 },
  { x: 0.94, y: 0.52, label: 'STREAMLINE', cardIndex: 1 },
  { x: 0.82, y: 0.85, label: 'LIQUOR BARN', cardIndex: 2 },
]
const DECOR_NODES = [
  { x: 0.6, y: 0.1 },
  { x: 0.58, y: 0.92 },
  { x: 0.97, y: 0.3 },
]

function pointToSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  let t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

interface Packet {
  toX: number
  toY: number
  progress: number
  rate: number
  delayRemaining: number
}

export function RouteCanvas({ onProjectClick }: { onProjectClick: (cardIndex: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.parentElement
    if (!canvas || !hero) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas || !hero || !ctx) return
      w = hero.clientWidth
      h = hero.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const hub = { x: 0.66, y: 0.5 }
    const allTargets = [...DECOR_NODES, ...PROJECT_NODES]
    const mouse = { x: -999, y: -999 }
    let packets: Packet[] = []
    let spawnTimer = 0

    function hitProjectNode(mx: number, my: number) {
      for (const n of PROJECT_NODES) {
        if (Math.hypot(mx - n.x * w, my - n.y * h) < 16) return n
      }
      return null
    }

    function spawnPacket(target: { x: number; y: number }, opts: { duration?: number; delay?: number } = {}) {
      const duration = opts.duration ?? 1400 + Math.random() * 900
      packets.push({ toX: target.x, toY: target.y, progress: 0, rate: 1 / duration, delayRemaining: opts.delay ?? 0 })
    }
    function spawnBurst(target: { x: number; y: number }) {
      for (let i = 0; i < 5; i++) spawnPacket(target, { delay: i * 70, duration: 900 })
    }

    function onMouseMove(e: MouseEvent) {
      const r = hero!.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      canvas!.style.cursor = hitProjectNode(mouse.x, mouse.y) ? 'pointer' : 'default'
    }
    function onMouseLeave() {
      mouse.x = -999
      mouse.y = -999
    }
    function onClick(e: MouseEvent) {
      const r = hero!.getBoundingClientRect()
      const hit = hitProjectNode(e.clientX - r.left, e.clientY - r.top)
      if (!hit) return
      spawnBurst(hit)
      setTimeout(() => onProjectClick(hit.cardIndex), reduced ? 0 : 550)
    }
    hero.addEventListener('mousemove', onMouseMove)
    hero.addEventListener('mouseleave', onMouseLeave)
    hero.addEventListener('click', onClick)

    function drawEdge(hx: number, hy: number, n: { x: number; y: number }) {
      const nx = n.x * w
      const ny = n.y * h
      const near = pointToSegDist(mouse.x, mouse.y, hx, hy, nx, ny) < 50
      ctx!.beginPath()
      ctx!.moveTo(hx, hy)
      ctx!.lineTo(nx, ny)
      ctx!.strokeStyle = near ? 'rgba(255,77,104,0.6)' : 'rgba(245,245,247,0.14)'
      ctx!.lineWidth = near ? 1.6 : 1
      ctx!.stroke()
    }
    function drawProjectNode(n: ProjectNode) {
      const nx = n.x * w
      const ny = n.y * h
      const hot = Math.hypot(mouse.x - nx, mouse.y - ny) < 40
      ctx!.beginPath()
      ctx!.arc(nx, ny, hot ? 6 : 5, 0, Math.PI * 2)
      ctx!.fillStyle = hot ? '#ff4d68' : 'rgba(255,77,104,0.6)'
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(nx, ny, (hot ? 6 : 5) + 5, 0, Math.PI * 2)
      ctx!.strokeStyle = hot ? 'rgba(255,77,104,.45)' : 'rgba(255,77,104,.2)'
      ctx!.lineWidth = 1.3
      ctx!.stroke()
      ctx!.font = "500 10px 'IBM Plex Mono', monospace"
      ctx!.fillStyle = hot ? 'rgba(255,77,104,0.95)' : 'rgba(245,245,247,0.45)'
      ctx!.textBaseline = 'middle'
      const rightAligned = n.x > 0.88
      ctx!.textAlign = rightAligned ? 'right' : 'left'
      ctx!.fillText(n.label, rightAligned ? nx - 12 : nx + 12, ny)
    }

    let last = performance.now()
    let raf = 0
    function frame(now: number) {
      const dt = now - last
      last = now
      ctx!.clearRect(0, 0, w, h)
      const hx = hub.x * w
      const hy = hub.y * h

      DECOR_NODES.forEach((n) => drawEdge(hx, hy, n))
      PROJECT_NODES.forEach((n) => drawEdge(hx, hy, n))

      ctx!.beginPath()
      ctx!.arc(hx, hy, 5, 0, Math.PI * 2)
      ctx!.fillStyle = '#ff4d68'
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(hx, hy, 10, 0, Math.PI * 2)
      ctx!.strokeStyle = 'rgba(255,77,104,0.35)'
      ctx!.lineWidth = 1.5
      ctx!.stroke()

      DECOR_NODES.forEach((n) => {
        ctx!.beginPath()
        ctx!.arc(n.x * w, n.y * h, 3.5, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(245,245,247,0.45)'
        ctx!.fill()
      })
      PROJECT_NODES.forEach(drawProjectNode)

      if (!reduced) {
        spawnTimer -= dt
        if (spawnTimer <= 0) {
          const target = allTargets[Math.floor(Math.random() * allTargets.length)]
          spawnPacket(target)
          spawnTimer = 550 + Math.random() * 700
        }
        packets.forEach((p) => {
          if (p.delayRemaining > 0) {
            p.delayRemaining -= dt
            return
          }
          p.progress += dt * p.rate
        })
        packets = packets.filter((p) => p.progress < 1)
        packets.forEach((p) => {
          const nx = p.toX * w
          const ny = p.toY * h
          const px = hx + (nx - hx) * p.progress
          const py = hy + (ny - hy) * p.progress
          ctx!.beginPath()
          ctx!.arc(px, py, 2.6, 0, Math.PI * 2)
          ctx!.fillStyle = '#ffffff'
          ctx!.shadowColor = '#ff4d68'
          ctx!.shadowBlur = 10
          ctx!.fill()
          ctx!.shadowBlur = 0
        })
        raf = requestAnimationFrame(frame)
      }
    }
    if (reduced) frame(performance.now())
    else raf = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      hero.removeEventListener('mousemove', onMouseMove)
      hero.removeEventListener('mouseleave', onMouseLeave)
      hero.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
    }
  }, [reduced, onProjectClick])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
