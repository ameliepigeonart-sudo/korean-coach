import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { UNITS } from '../data/units.js'
import { speakKorean } from '../lib/tts.js'

function getFeedback(target, heard, score) {
  if (score < 40) return 'Non reconnu. Répète après l\'audio.'
  if (target === 'ㅋ' && !heard.includes('ㅋ')) return 'Ton ㅋ nécessite plus d\'aspiration.'
  if (target === 'ㄲ' && !heard.includes('ㄲ')) return 'ㄲ est tendu : resserre le son, moins d\'air.'
  if ((target.includes('ㅓ') || target === 'ㅓ') && heard.includes('ㅗ')) return 'ㅓ est plus ouvert et moins arrondi que ㅗ.'
  if ((target.includes('ㅗ') || target === 'ㅗ') && heard.includes('ㅓ')) return 'ㅗ nécessite un arrondissement des lèvres.'
  if (target === 'ㅃ' && !heard.includes('ㅃ')) return 'ㅃ est tendu : fermeture serrée des lèvres, sans relâchement d\'air.'
  if (target === 'ㅌ' && !heard.includes('ㅌ')) return 'ㅌ nécessite une forte expulsion d\'air.'
  if (score < 70) return `Score : ${score}. Répète plus précisément.`
  return null
}

export default function UnitTrainer({ userId }) {
  const [moduleFilter, setModuleFilter] = useState(1)
  const [units, setUnits] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState('listen')
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [showRomanization, setShowRomanization] = useState(false)

  useEffect(() => {
    const filtered = UNITS.filter(u => u.module === moduleFilter)
    setUnits(filtered)
    setCurrentIdx(0)
    setPhase('listen')
    setResult(null)
  }, [moduleFilter])

  const unit = units[currentIdx]

  async function startListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setResult({ score: 0, feedback: 'Reconnaissance vocale non supportée dans ce navigateur.', heard: '' })
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    recognition.maxAlternatives = 3
    setListening(true)

    recognition.onresult = async (event) => {
      setListening(false)
      const heard = event.results[0][0].transcript
      const target = unit.display_ko
      let score = 0
      if (heard === target) score = 100
      else if (heard.includes(target) || target.includes(heard)) score = 75
      else {
        const overlap = [...target].filter(c => heard.includes(c)).length
        score = Math.round((overlap / target.length) * 60)
      }
      const feedback = getFeedback(target, heard, score)
      setResult({ score, feedback, heard })

      await supabase.from('attempts_speech').insert({
        user_id: userId,
        unit_id: unit.id,
        stt_text: heard,
        score,
        feedback,
      })

      if (score < 70) {
        await supabase
          .from('weak_units')
          .upsert(
            { user_id: userId, unit_id: unit.id, last_attempt: new Date().toISOString() },
            { onConflict: 'user_id,unit_id' }
          )
          .then(() => {
            supabase.rpc('increment_error_count', { p_user_id: userId, p_unit_id: unit.id })
          })
      }
    }

    recognition.onerror = () => {
      setListening(false)
      setResult({ score: 0, feedback: 'Non reconnu. Répète après l\'audio.', heard: '' })
    }

    recognition.start()
  }

  function nextUnit() {
    setCurrentIdx(i => Math.min(i + 1, units.length - 1))
    setPhase('listen')
    setResult(null)
  }

  function prevUnit() {
    setCurrentIdx(i => Math.max(i - 1, 0))
    setPhase('listen')
    setResult(null)
  }

  if (!unit) return <div className="p-6 text-neutral-400">Aucune unité pour ce module.</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-100">Entraînement</h2>
        <label className="flex items-center gap-2 text-xs text-neutral-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showRomanization}
            onChange={e => setShowRomanization(e.target.checked)}
            className="w-3 h-3"
          />
          Romanisation
        </label>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[1,2,3,4,5,6].map(m => (
          <button
            key={m}
            onClick={() => setModuleFilter(m)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              moduleFilter === m
                ? 'bg-neutral-100 text-neutral-950'
                : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            M{m}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-neutral-100 hangul mb-2">{unit.display_ko}</div>
          <div className="text-neutral-400 text-sm">{unit.meaning_fr}</div>
          {unit.notes_fr && (
            <div className="text-neutral-500 text-xs mt-1">{unit.notes_fr}</div>
          )}
          {showRomanization && unit.romanization && (
            <div className="text-neutral-600 text-xs mt-1 italic">{unit.romanization}</div>
          )}
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={() => speakKorean(unit.display_ko, true)}
            className="px-4 py-2 bg-neutral-800 text-neutral-200 text-sm rounded hover:bg-neutral-700 transition-colors"
          >
            Lent
          </button>
          <button
            onClick={() => speakKorean(unit.display_ko, false)}
            className="px-4 py-2 bg-neutral-800 text-neutral-200 text-sm rounded hover:bg-neutral-700 transition-colors"
          >
            Normal
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={startListening}
            disabled={listening}
            className={`w-full py-2 text-sm rounded transition-colors font-medium ${
              listening
                ? 'bg-red-900 text-red-200'
                : 'bg-neutral-700 text-neutral-100 hover:bg-neutral-600'
            }`}
          >
            {listening ? 'Écoute...' : 'Répéter'}
          </button>
        </div>

        {result && (
          <div className="mt-3 p-3 bg-neutral-800 rounded text-sm">
            <div className="text-neutral-400">Entendu : <span className="text-neutral-200 hangul">{result.heard || '—'}</span></div>
            <div className="text-neutral-400 mt-1">Score : {result.score}/100</div>
            {result.feedback && (
              <div className="text-amber-400 mt-1">{result.feedback}</div>
            )}
          </div>
        )}

        {unit.practice_syllables && unit.practice_syllables.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-500 mb-2">Syllabes d'entraînement</div>
            <div className="flex gap-2 flex-wrap">
              {unit.practice_syllables.map(s => (
                <button
                  key={s}
                  onClick={() => speakKorean(s)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-100 hangul text-lg rounded hover:bg-neutral-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prevUnit}
          disabled={currentIdx === 0}
          className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
        >
          Précédent
        </button>
        <span className="text-xs text-neutral-500">{currentIdx + 1} / {units.length}</span>
        <button
          onClick={nextUnit}
          disabled={currentIdx === units.length - 1}
          className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
