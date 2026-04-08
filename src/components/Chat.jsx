import { useState, useEffect, useRef } from 'react'

const OPENING_MESSAGE = {
  role: 'assistant',
  content: 'Ask me anything about Korean. I can explain rules, practice sounds with you, or answer questions about what you are learning.',
}

const QUICK_STARTS = [
  'Explain what I just learned',
  'Practice this sound with me',
  'Why is this hard for me?',
  'Teach me a short dialogue',
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-neutral-800 text-neutral-100'
            : 'bg-neutral-900 border border-neutral-700 text-neutral-100'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

export default function Chat() {
  const [history, setHistory] = useState([OPENING_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function sendMessage(text) {
    const content = text.trim()
    if (!content || loading) return

    const userMsg = { role: 'user', content }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setInput('')
    setLoading(true)
    setError(null)

    const apiMessages = newHistory.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setHistory(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleQuickStart(text) {
    sendMessage(text)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-64px)]">
      <div className="px-4 py-4 border-b border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-100">AI Tutor</h2>
        <p className="text-xs text-neutral-500 mt-0.5">Korean language — direct answers only</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {history.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
              <TypingIndicator />
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-xs text-center py-2">{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {QUICK_STARTS.map(q => (
          <button
            key={q}
            onClick={() => handleQuickStart(q)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 transition-colors disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-4 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about Korean..."
          disabled={loading}
          className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-neutral-100 text-neutral-950 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-40 shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  )
}
