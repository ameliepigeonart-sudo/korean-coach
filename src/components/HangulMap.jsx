import { useState, useEffect } from 'react'
import { speakKorean } from '../lib/tts.js'

const VOWELS = [
  { symbol: 'ㅏ', sound: 'ouvert "ah"', example: '아' },
  { symbol: 'ㅓ', sound: 'ouvert "eu", non arrondi', example: '어' },
  { symbol: 'ㅗ', sound: 'arrondi "oh"', example: '오' },
  { symbol: 'ㅜ', sound: 'arrondi "ou"', example: '우' },
  { symbol: 'ㅡ', sound: 'plat, sans arrondi', example: '으' },
  { symbol: 'ㅣ', sound: '"i", langue en avant', example: '이' },
  { symbol: 'ㅑ', sound: '"yah"', example: '야' },
  { symbol: 'ㅕ', sound: '"yeu"', example: '여' },
  { symbol: 'ㅛ', sound: '"yoh"', example: '요' },
  { symbol: 'ㅠ', sound: '"you"', example: '유' },
  { symbol: 'ㅐ', sound: '"é" (ouvert)', example: '애' },
  { symbol: 'ㅔ', sound: '"é" (fermé)', example: '에' },
  { symbol: 'ㅘ', sound: '"wah"', example: '와' },
  { symbol: 'ㅝ', sound: '"weu"', example: '워' },
  { symbol: 'ㅢ', sound: '"ui" (rare)', example: '의' },
]

const CONSONANTS = [
  { symbol: 'ㄱ', initial: 'g/k', final: 'k (non relâché)', example: '가 / 각' },
  { symbol: 'ㄴ', initial: 'n', final: 'n', example: '나 / 난' },
  { symbol: 'ㄷ', initial: 'd/t', final: 't (non relâché)', example: '다 / 닫' },
  { symbol: 'ㄹ', initial: 'r (battement)', final: 'l', example: '라 / 말' },
  { symbol: 'ㅁ', initial: 'm', final: 'm', example: '마 / 남' },
  { symbol: 'ㅂ', initial: 'b/p', final: 'p (non relâché)', example: '바 / 밥' },
  { symbol: 'ㅅ', initial: 's', final: 't (non relâché)', example: '사 / 옷' },
  { symbol: 'ㅇ', initial: 'silencieux', final: 'ng', example: '아 / 방' },
  { symbol: 'ㅈ', initial: 'j', final: 't (non relâché)', example: '자 / 맞' },
  { symbol: 'ㅊ', initial: 'ch (aspiré)', final: 't (non relâché)', example: '차' },
  { symbol: 'ㅋ', initial: 'k (aspiré)', final: 'k (non relâché)', example: '카' },
  { symbol: 'ㅌ', initial: 't (aspiré)', final: 't (non relâché)', example: '타' },
  { symbol: 'ㅍ', initial: 'p (aspiré)', final: 'p (non relâché)', example: '파' },
  { symbol: 'ㅎ', initial: 'h', final: 'silencieux/t', example: '하' },
  { symbol: 'ㄲ', initial: 'kk (tendu)', final: 'k (non relâché)', example: '까' },
  { symbol: 'ㄸ', initial: 'tt (tendu)', final: '—', example: '따' },
  { symbol: 'ㅃ', initial: 'pp (tendu)', final: '—', example: '빠' },
  { symbol: 'ㅆ', initial: 'ss (tendu)', final: 't (non relâché)', example: '써' },
  { symbol: 'ㅉ', initial: 'jj (tendu)', final: '—', example: '짜' },
]

const INITIALS = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
const VOWEL_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
const FINALS = ['(aucun)','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㅆ']

const INITIAL_CODE = { 'ㄱ':0,'ㄲ':1,'ㄴ':2,'ㄷ':3,'ㄸ':4,'ㄹ':5,'ㅁ':6,'ㅂ':7,'ㅃ':8,'ㅅ':9,'ㅆ':10,'ㅇ':11,'ㅈ':12,'ㅉ':13,'ㅊ':14,'ㅋ':15,'ㅌ':16,'ㅍ':17,'ㅎ':18 }
const VOWEL_CODE = { 'ㅏ':0,'ㅐ':1,'ㅑ':2,'ㅒ':3,'ㅓ':4,'ㅔ':5,'ㅕ':6,'ㅖ':7,'ㅗ':8,'ㅘ':9,'ㅙ':10,'ㅚ':11,'ㅛ':12,'ㅜ':13,'ㅝ':14,'ㅞ':15,'ㅟ':16,'ㅠ':17,'ㅡ':18,'ㅢ':19,'ㅣ':20 }
const FINAL_CODE = { '(aucun)':0,'ㄱ':1,'ㄲ':2,'ㄴ':3,'ㄷ':4,'ㄹ':5,'ㅁ':6,'ㅂ':7,'ㅅ':8,'ㅇ':9,'ㅈ':10,'ㅊ':11,'ㅋ':12,'ㅌ':13,'ㅍ':14,'ㅎ':15,'ㅆ':16 }

const VOWEL_TO_SYLLABLE = {
  'ㅏ':'아','ㅓ':'어','ㅗ':'오','ㅜ':'우','ㅡ':'으','ㅣ':'이',
  'ㅑ':'야','ㅕ':'여','ㅛ':'요','ㅠ':'유',
  'ㅐ':'애','ㅔ':'에','ㅘ':'와','ㅝ':'워','ㅢ':'의',
}

const CONSONANT_TO_SYLLABLE = {
  'ㄱ':'가','ㄴ':'나','ㄷ':'다','ㄹ':'라','ㅁ':'마','ㅂ':'바',
  'ㅅ':'사','ㅇ':'아','ㅈ':'자','ㅊ':'차','ㅋ':'카','ㅌ':'타',
  'ㅍ':'파','ㅎ':'하','ㄲ':'까','ㄸ':'따','ㅃ':'빠','ㅆ':'싸','ㅉ':'짜',
}

function buildSyllable(initial, vowel, finalC) {
  const i = INITIAL_CODE[initial] ?? 11
  const v = VOWEL_CODE[vowel] ?? 0
  const f = FINAL_CODE[finalC] ?? 0
  const code = 0xAC00 + (i * 21 + v) * 28 + f
  return String.fromCodePoint(code)
}

function SoundButton({ text, label, className = '' }) {
  const [active, setActive] = useState(false)

  async function handleClick() {
    setActive(true)
    await speakKorean(text)
    setTimeout(() => setActive(false), 600)
  }

  return (
    <button
      onClick={handleClick}
      title={`Écouter : ${text}`}
      className={`transition-all ${active ? 'scale-110 opacity-70' : 'hover:opacity-80'} ${className}`}
    >
      {label ?? text}
    </button>
  )
}

export default function HangulMap() {
  const [initial, setInitial] = useState('ㅎ')
  const [vowel, setVowel] = useState('ㅏ')
  const [finalC, setFinalC] = useState('(aucun)')

  const syllable = buildSyllable(initial, vowel, finalC)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      <h2 className="text-xl font-semibold text-neutral-100">Hangul</h2>
      <p className="text-xs text-neutral-500">Clique sur n'importe quel symbole pour l'entendre.</p>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Comment fonctionne le coréen</h3>
        <p className="text-neutral-300 text-sm">Le coréen s'écrit en blocs syllabiques, pas lettre par lettre.</p>
        <p className="text-neutral-300 text-sm">Chaque bloc = attaque (consonne initiale) + voyelle + consonne finale optionnelle (batchim).</p>
        <p className="text-neutral-300 text-sm flex flex-wrap items-center gap-1">
          <span>Exemple :</span>
          <SoundButton text="한" className="hangul text-neutral-100 font-bold" />
          <span className="text-neutral-400">= ㅎ + ㅏ + ㄴ</span>
          <span className="text-neutral-600 mx-1">|</span>
          <SoundButton text="국" className="hangul text-neutral-100 font-bold" />
          <span className="text-neutral-400">= ㄱ + ㅜ + ㄱ</span>
          <span className="text-neutral-600 mx-1">|</span>
          <SoundButton text="어" className="hangul text-neutral-100 font-bold" />
          <span className="text-neutral-400">= ㅇ + ㅓ</span>
        </p>
        <p className="text-neutral-300 text-sm">Les blocs sont toujours de forme carrée.</p>
        <p className="text-neutral-300 text-sm">Ordre de lecture : gauche à droite, haut en bas.</p>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Voyelles</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800">
                <th className="text-left py-2 pr-4">Symbole</th>
                <th className="text-left py-2 pr-4">Son</th>
                <th className="text-left py-2">Exemple</th>
              </tr>
            </thead>
            <tbody>
              {VOWELS.map(v => (
                <tr key={v.symbol} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4">
                    <SoundButton
                      text={VOWEL_TO_SYLLABLE[v.symbol] || v.example}
                      label={v.symbol}
                      className="hangul text-2xl text-neutral-100 font-medium cursor-pointer rounded px-1 hover:bg-neutral-800"
                    />
                  </td>
                  <td className="py-2 pr-4 text-neutral-300">{v.sound}</td>
                  <td className="py-2">
                    <SoundButton
                      text={v.example}
                      className="hangul text-xl text-neutral-200 cursor-pointer rounded px-1 hover:bg-neutral-800"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Consonnes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800">
                <th className="text-left py-2 pr-3">Symbole</th>
                <th className="text-left py-2 pr-3">Initial</th>
                <th className="text-left py-2 pr-3">Final (batchim)</th>
                <th className="text-left py-2">Exemple</th>
              </tr>
            </thead>
            <tbody>
              {CONSONANTS.map(c => (
                <tr key={c.symbol} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-3">
                    <SoundButton
                      text={CONSONANT_TO_SYLLABLE[c.symbol] || c.example.split(' ')[0]}
                      label={c.symbol}
                      className="hangul text-2xl text-neutral-100 font-medium cursor-pointer rounded px-1 hover:bg-neutral-800"
                    />
                  </td>
                  <td className="py-2 pr-3 text-neutral-300">{c.initial}</td>
                  <td className="py-2 pr-3 text-neutral-400">{c.final}</td>
                  <td className="py-2">
                    {c.example.split(' / ').map((ex, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-neutral-600 mx-1">/</span>}
                        <SoundButton
                          text={ex.trim()}
                          className="hangul text-lg text-neutral-200 cursor-pointer rounded px-1 hover:bg-neutral-800"
                        />
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Constructeur de syllabes</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">Initial</label>
            <select
              value={initial}
              onChange={e => setInitial(e.target.value)}
              className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-2 py-1.5 text-sm hangul"
            >
              {INITIALS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">Voyelle</label>
            <select
              value={vowel}
              onChange={e => setVowel(e.target.value)}
              className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-2 py-1.5 text-sm hangul"
            >
              {VOWEL_LIST.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">Batchim</label>
            <select
              value={finalC}
              onChange={e => setFinalC(e.target.value)}
              className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-2 py-1.5 text-sm hangul"
            >
              {FINALS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="text-center py-4">
          <SoundButton
            text={syllable}
            className="hangul text-8xl font-bold text-neutral-100 cursor-pointer"
          />
          <div className="text-neutral-400 text-sm mt-2">
            {initial} + {vowel}{finalC !== '(aucun)' ? ' + ' + finalC : ''}
          </div>
          <div className="text-neutral-600 text-xs mt-1">Clique la syllabe pour l'entendre</div>
        </div>
        <button
          onClick={() => speakKorean(syllable)}
          className="w-full py-2 bg-neutral-700 text-neutral-100 text-sm rounded hover:bg-neutral-600 transition-colors"
        >
          Écouter
        </button>
      </section>
    </div>
  )
}
