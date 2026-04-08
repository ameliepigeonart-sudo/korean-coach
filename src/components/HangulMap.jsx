import { useState } from 'react'

const VOWELS = [
  { symbol: 'ㅏ', sound: 'open "ah"', example: '아' },
  { symbol: 'ㅓ', sound: 'open "uh", not rounded', example: '어' },
  { symbol: 'ㅗ', sound: 'rounded "oh"', example: '오' },
  { symbol: 'ㅜ', sound: 'rounded "oo"', example: '우' },
  { symbol: 'ㅡ', sound: 'flat, no rounding', example: '으' },
  { symbol: 'ㅣ', sound: '"ee", tongue forward', example: '이' },
  { symbol: 'ㅑ', sound: '"yah"', example: '야' },
  { symbol: 'ㅕ', sound: '"yuh"', example: '여' },
  { symbol: 'ㅛ', sound: '"yoh"', example: '요' },
  { symbol: 'ㅠ', sound: '"yoo"', example: '유' },
  { symbol: 'ㅐ', sound: '"eh" (open)', example: '애' },
  { symbol: 'ㅔ', sound: '"eh" (close)', example: '에' },
  { symbol: 'ㅘ', sound: '"wah"', example: '와' },
  { symbol: 'ㅝ', sound: '"wuh"', example: '워' },
  { symbol: 'ㅢ', sound: '"ui" (rare)', example: '의' },
]

const CONSONANTS = [
  { symbol: 'ㄱ', initial: 'g/k', final: 'k (unreleased)', example: '가 / 각' },
  { symbol: 'ㄴ', initial: 'n', final: 'n', example: '나 / 난' },
  { symbol: 'ㄷ', initial: 'd/t', final: 't (unreleased)', example: '다 / 닫' },
  { symbol: 'ㄹ', initial: 'r (flap)', final: 'l', example: '라 / 말' },
  { symbol: 'ㅁ', initial: 'm', final: 'm', example: '마 / 남' },
  { symbol: 'ㅂ', initial: 'b/p', final: 'p (unreleased)', example: '바 / 밥' },
  { symbol: 'ㅅ', initial: 's', final: 't (unreleased)', example: '사 / 옷' },
  { symbol: 'ㅇ', initial: 'silent', final: 'ng', example: '아 / 방' },
  { symbol: 'ㅈ', initial: 'j', final: 't (unreleased)', example: '자 / 맞' },
  { symbol: 'ㅊ', initial: 'ch (aspirated)', final: 't (unreleased)', example: '차' },
  { symbol: 'ㅋ', initial: 'k (aspirated)', final: 'k (unreleased)', example: '카' },
  { symbol: 'ㅌ', initial: 't (aspirated)', final: 't (unreleased)', example: '타' },
  { symbol: 'ㅍ', initial: 'p (aspirated)', final: 'p (unreleased)', example: '파' },
  { symbol: 'ㅎ', initial: 'h', final: 'silent/t', example: '하' },
  { symbol: 'ㄲ', initial: 'kk (tense)', final: 'k (unreleased)', example: '까' },
  { symbol: 'ㄸ', initial: 'tt (tense)', final: '—', example: '따' },
  { symbol: 'ㅃ', initial: 'pp (tense)', final: '—', example: '빠' },
  { symbol: 'ㅆ', initial: 'ss (tense)', final: 't (unreleased)', example: '써' },
  { symbol: 'ㅉ', initial: 'jj (tense)', final: '—', example: '짜' },
]

const INITIALS = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
const VOWEL_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
const FINALS = ['(none)','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㅆ']

const INITIAL_CODE = { 'ㄱ':0,'ㄲ':1,'ㄴ':2,'ㄷ':3,'ㄸ':4,'ㄹ':5,'ㅁ':6,'ㅂ':7,'ㅃ':8,'ㅅ':9,'ㅆ':10,'ㅇ':11,'ㅈ':12,'ㅉ':13,'ㅊ':14,'ㅋ':15,'ㅌ':16,'ㅍ':17,'ㅎ':18 }
const VOWEL_CODE = { 'ㅏ':0,'ㅐ':1,'ㅑ':2,'ㅒ':3,'ㅓ':4,'ㅔ':5,'ㅕ':6,'ㅖ':7,'ㅗ':8,'ㅘ':9,'ㅙ':10,'ㅚ':11,'ㅛ':12,'ㅜ':13,'ㅝ':14,'ㅞ':15,'ㅟ':16,'ㅠ':17,'ㅡ':18,'ㅢ':19,'ㅣ':20 }
const FINAL_CODE = { '(none)':0,'ㄱ':1,'ㄲ':2,'ㄴ':3,'ㄷ':4,'ㄹ':5,'ㅁ':6,'ㅂ':7,'ㅅ':8,'ㅇ':9,'ㅈ':10,'ㅊ':11,'ㅋ':12,'ㅌ':13,'ㅍ':14,'ㅎ':15,'ㅆ':16 }

function buildSyllable(initial, vowel, finalC) {
  const i = INITIAL_CODE[initial] ?? 11
  const v = VOWEL_CODE[vowel] ?? 0
  const f = FINAL_CODE[finalC] ?? 0
  const code = 0xAC00 + (i * 21 + v) * 28 + f
  return String.fromCodePoint(code)
}

function speak(text) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = 0.8
  window.speechSynthesis.speak(u)
}

export default function HangulMap() {
  const [initial, setInitial] = useState('ㅎ')
  const [vowel, setVowel] = useState('ㅏ')
  const [finalC, setFinalC] = useState('(none)')

  const syllable = buildSyllable(initial, vowel, finalC)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      <h2 className="text-xl font-semibold text-neutral-100">Hangul Map</h2>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">How Korean works</h3>
        <p className="text-neutral-300 text-sm">Korean is written in syllable blocks, not letter by letter.</p>
        <p className="text-neutral-300 text-sm">Each block = onset (initial consonant) + vowel + optional final consonant (batchim).</p>
        <p className="text-neutral-300 text-sm">
          Example: <span className="hangul text-neutral-100">한</span> = ㅎ + ㅏ + ㄴ &nbsp;|&nbsp; <span className="hangul text-neutral-100">국</span> = ㄱ + ㅜ + ㄱ &nbsp;|&nbsp; <span className="hangul text-neutral-100">어</span> = ㅇ + ㅓ
        </p>
        <p className="text-neutral-300 text-sm">Blocks are always square-shaped.</p>
        <p className="text-neutral-300 text-sm">Reading order: left to right, top to bottom.</p>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Vowels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800">
                <th className="text-left py-2 pr-4">Symbol</th>
                <th className="text-left py-2 pr-4">Sound</th>
                <th className="text-left py-2">Example</th>
              </tr>
            </thead>
            <tbody>
              {VOWELS.map(v => (
                <tr key={v.symbol} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4 hangul text-2xl text-neutral-100">{v.symbol}</td>
                  <td className="py-2 pr-4 text-neutral-300">{v.sound}</td>
                  <td className="py-2 hangul text-xl text-neutral-200">{v.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Consonants</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800">
                <th className="text-left py-2 pr-3">Symbol</th>
                <th className="text-left py-2 pr-3">Initial</th>
                <th className="text-left py-2 pr-3">Final (batchim)</th>
                <th className="text-left py-2">Example</th>
              </tr>
            </thead>
            <tbody>
              {CONSONANTS.map(c => (
                <tr key={c.symbol} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-3 hangul text-2xl text-neutral-100">{c.symbol}</td>
                  <td className="py-2 pr-3 text-neutral-300">{c.initial}</td>
                  <td className="py-2 pr-3 text-neutral-400">{c.final}</td>
                  <td className="py-2 hangul text-lg text-neutral-200">{c.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Syllable Builder</h3>
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
            <label className="text-xs text-neutral-500">Vowel</label>
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
          <div className="hangul text-8xl font-bold text-neutral-100">{syllable}</div>
          <div className="text-neutral-400 text-sm mt-2">
            {initial} + {vowel}{finalC !== '(none)' ? ' + ' + finalC : ''}
          </div>
        </div>
        <button
          onClick={() => speak(syllable)}
          className="w-full py-2 bg-neutral-700 text-neutral-100 text-sm rounded hover:bg-neutral-600 transition-colors"
        >
          Listen
        </button>
      </section>
    </div>
  )
}
