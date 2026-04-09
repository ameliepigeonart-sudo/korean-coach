import { useState, useRef } from 'react'
import { speakKorean } from '../lib/tts.js'

const DIALOGUES = [
  {
    id: 1,
    title: 'Salutation',
    lines: [
      { speaker: 'A', ko: '안녕하세요!', fr: 'Bonjour !' },
      { speaker: 'B', ko: '안녕하세요!', fr: 'Bonjour !' },
      { speaker: 'A', ko: '잘 지내세요?', fr: 'Comment allez-vous ?' },
      { speaker: 'B', ko: '네, 잘 지내요. 감사합니다.', fr: 'Oui, je vais bien. Merci.' },
    ],
  },
  {
    id: 2,
    title: 'Commander',
    lines: [
      { speaker: 'A', ko: '아메리카노 하나 주세요.', fr: 'Un américano, s\'il vous plaît.' },
      { speaker: 'B', ko: '네, 알겠습니다.', fr: 'Oui, bien sûr.' },
      { speaker: 'A', ko: '얼마예요?', fr: 'C\'est combien ?' },
      { speaker: 'B', ko: '사천오백 원이에요.', fr: '4 500 wons.' },
    ],
  },
  {
    id: 3,
    title: 'Demander une direction',
    lines: [
      { speaker: 'A', ko: '화장실이 어디예요?', fr: 'Où sont les toilettes ?' },
      { speaker: 'B', ko: '저기요.', fr: 'Là-bas.' },
      { speaker: 'A', ko: '감사합니다.', fr: 'Merci.' },
      { speaker: 'B', ko: '아니에요.', fr: 'De rien.' },
    ],
  },
]

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
            <div className="text-neutral-500 text-xs mt-0.5">{line.fr}</div>
          )}
          {heard && (
            <div className="text-neutral-400 text-xs mt-1">Entendu : <span className="hangul text-neutral-200">{heard}</span></div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => speakKorean(line.ko)}
            className="px-2 py-1 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
          >
            Écouter
          </button>
          <button
            onClick={startRepeat}
            disabled={listening}
            className={`px-2 py-1 text-xs rounded transition-colors ${listening ? 'bg-red-900 text-red-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            {listening ? '...' : 'Répéter'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DialogueBlock({ dialogue }) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [practicing, setPracticing] = useState(false)

  async function practiceAll() {
    if (practicing) return
    setPracticing(true)
    for (const line of dialogue.lines) {
      await speakKorean(line.ko)
      await new Promise(resolve => setTimeout(resolve, 2500))
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
            {showTranslation ? 'Masquer la traduction' : 'Afficher la traduction'}
          </button>
          <button
            onClick={practiceAll}
            disabled={practicing}
            className={`px-3 py-1 text-xs rounded transition-colors ${practicing ? 'bg-neutral-700 text-neutral-500' : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'}`}
          >
            {practicing ? 'Lecture...' : 'Pratiquer le dialogue'}
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
