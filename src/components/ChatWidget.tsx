import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  'What stack do you work with?',
  'Tell me about iDesk.',
  'Are you open to new opportunities?',
  'What makes you different?',
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey 👋 I'm Darnell. Ask me anything about my work, skills, or availability.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open, messages])

  async function send(text: string) {
    const userMsg = text.trim()
    if (!userMsg || loading) return
    setInput('')
    const next: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply ?? "Sorry, I couldn't reach my brain right now. Try again?" }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong on my end — try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') send(input)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Chat with Darnell'}
        className={cn(
          'fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-white/20',
          'bg-gradient-to-br from-red-mid to-red-deep shadow-[0_8px_28px_rgba(255,77,104,.45)]',
          'transition-transform duration-200 hover:scale-110 active:scale-95',
        )}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M2 2L16 16M16 2L2 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-[59] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-[24px]',
          'border border-border shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_24px_60px_rgba(0,0,0,.65)]',
          'transition-all duration-300 ease-out',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-border">
              <img src="/headshot.jpg" alt="Darnell" className="h-full w-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-emerald-400" />
          </div>
          <div>
            <p className="font-display text-[.9rem] font-semibold text-text leading-none">Darnell</p>
            <p className="mt-0.5 font-mono text-[.7rem] text-text-dim">Full-stack developer · Online</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
            <span className="font-mono text-[.68rem] text-red">AI</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-[14px] px-4 py-2.5 text-[.85rem] leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-red-mid to-red-deep text-white'
                    : 'border border-border bg-white/5 text-text',
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-[14px] border border-border bg-white/5 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-text-muted"
                    style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter prompts — only shown before the user has typed */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-[10px] border border-border bg-white/5 px-3 py-1.5 font-mono text-[.72rem] text-text-muted hover:border-red hover:text-red transition-colors duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent font-mono text-[.82rem] text-text placeholder:text-text-dim outline-none"
            disabled={loading}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150',
              input.trim() && !loading
                ? 'bg-gradient-to-br from-red-mid to-red-deep shadow-[0_4px_12px_rgba(255,77,104,.4)]'
                : 'bg-white/10 opacity-50',
            )}
            aria-label="Send"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M1 12L12 1M12 1H4M12 1V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
