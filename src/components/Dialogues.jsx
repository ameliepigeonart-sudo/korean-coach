import { useState, useRef } from 'react'

const DIALOGUES = [
  {
    id: 1,
    title: 'Greeting',
    lines: [
      { speaker: 'A', ko: '안녕하세요!', en: 'Hello' },
      { speaker: 'B', ko: '안녕하세요!', en: 'Hello' },
      { speaker: 'A', ko: '잘 지내세요?', en: 'How are you?' },
      { speaker: 'B', ko: '네, 잘 지내요. 감사합니다.', en: "Yes, I'm well. Thank you." },
    ],
  },
  {
    id: 2,
    title: 'Ordering',
    lines: [
      { speaker: 'A', ko: '아메리카노 하나 주세요.', en: 'One americano, please.' },
      { speaker: 'B', ko: '네, 알겠습니다.', en: 'Yes, understood.' },
      { speaker: 'A', ko: '얼마예요?', en: 'How much?' },
      { speaker: 'B', ko: '사천오백 원이에요.', en: '4,500 won.' },
    ],
  },
  {
    id: 3,
    title: 'Asking location',
    lines: [
      { speaker: 'A', ko: '화장실이 어디예요?', en: 'Where is the bathroom?' },
      { speaker: 'B', ko: '저기요.', en: 'Over there.' },
      { speaker: 'A', ko: '감사합니다.', en: 'Thank you.' },
      { speaker: 'B', ko: '아니에요.', en: 'No problem.' },
    ],
  },
]

function speak(text, rate = 0.9) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

function DialogueLine({ line, showTranslation }) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')

  function startRepeat() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'ko-KR'
    rec.interimResults = false
    setListening(true)
    setHeard('')
    rec.onresult = (e) => {
      setListening(false)
      setHeard(e.results[0][0].transcript)
    }
    rec.onerror = () => setListening(false)
    rec.start()
  }

  return (
    <div className="py-3 border-b border-neutral-800/60 last:border-0">
      <div className="flex items-start gap-3">
        <span className="text-xs text-neutral-500 font-mono mt-1 w-4 shrink-0">{line.speaker}</span>
        <div className="flex-1 min-w-0">
          <div className="hangul text-neutral-100 text-base">{line.ko}</div>
          {showTranslation && (
            <div className="text-neutral-500 text-xs mt-0.5">{line.en}</div>
          )}
          {heard && (
            <div className="text-neutral-400 text-xs mt-1">Heard: <span className="hangul text-neutral-200">{heard}</span></div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => speak(line.ko)}
            className="px-2 py-1 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
          >
            Listen
          </button>
          <button
            onClick={startRepeat}
            disabled={listening}
            className={`px-2 py-1 text-xs rounded transition-colors ${listening ? 'bg-red-900 text-red-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            {listening ? '...' : 'Repeat'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DialogueBlock({ dialogue }) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [practicing, setPracticing] = useState(false)
  const timerRef = useRef(null)

  async function practiceAll() {
    if (practicing) return
    setPracticing(true)
    for (const line of dialogue.lines) {
      speak(line.ko, 0.8)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    setPracticing(false)
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-300">{dialogue.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTranslation(v => !v)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {showTranslation ? 'Hide translation' : 'Show translation'}
          </button>
          <button
            onClick={practiceAll}
            disabled={practicing}
            className={`px-3 py-1 text-xs rounded transition-colors ${practicing ? 'bg-neutral-700 text-neutral-500' : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'}`}
          >
            {practicing ? 'Playing...' : 'Practice full dialogue'}
          </button>
        </div>
      </div>
      {dialogue.lines.map((line, i) => (
        <DialogueLine key={i} line={line} showTranslation={showTranslation} />
      ))}
    </div>
  )
}

export default function Dialogues() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-semibold text-neutral-100">Dialogues</h2>
      {DIALOGUES.map(d => (
        <DialogueBlock key={d.id} dialogue={d} />
      ))}
    </div>
  )
}
