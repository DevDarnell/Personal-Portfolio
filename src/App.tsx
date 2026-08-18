import { useCallback, useRef, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { ScrollProgress } from './components/ScrollProgress'
import { CustomCursor } from './components/CustomCursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Work } from './components/Work'
import { Stack } from './components/Stack'
import { Contact } from './components/Contact'
import { StackMarquee } from './components/StackMarquee'
import { ChatWidget } from './components/ChatWidget'
import { useReducedMotion } from './lib/hooks'

export default function App() {
  const [activePill, setActivePill] = useState<{ label: string; filter: string } | null>(null)
  const [flashIndex, setFlashIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()

  const registerCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    cardRefs.current[index] = el
  }, [])

  const handlePillSelect = useCallback((skill: { label: string; filter: string }) => {
    setActivePill((prev) => (prev?.label === skill.label ? null : skill))
  }, [])

  const handleProjectClick = useCallback(
    (cardIndex: number) => {
      const el = cardRefs.current[cardIndex]
      if (!el) return
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      setFlashIndex(cardIndex)
      setTimeout(() => setFlashIndex(null), 1200)
    },
    [reduced],
  )

  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <CustomCursor />
      <Nav />
      <Hero onProjectClick={handleProjectClick} />
      <StackMarquee />
      <About />
      <Work
        activeFilter={activePill?.filter ?? null}
        flashIndex={flashIndex}
        registerCardRef={registerCardRef}
      />
      <Stack activeLabel={activePill?.label ?? null} onSelect={handlePillSelect} />
      <Contact />
      <ChatWidget />
    </>
  )
}
