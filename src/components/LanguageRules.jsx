import { useState } from 'react'

function speak(text) {
  window.speechSynthesis.cancel()
  const trySpeak = () => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ko-KR'
    const voices = window.speechSynthesis.getVoices()
    const koVoice = voices.find(v => v.lang === 'ko-KR' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'ko-KR')
    if (koVoice) u.voice = koVoice
    u.rate = 0.85
    window.speechSynthesis.speak(u)
  }
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak
  } else {
    trySpeak()
  }
}

function ListenBtn({ text, label }) {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={() => { setActive(true); speak(text); setTimeout(() => setActive(false), 600) }}
      className={`hangul inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-700 text-neutral-200 hover:border-neutral-500 transition-all text-sm ${active ? 'opacity-60 scale-95' : ''}`}
    >
      {label || text} <span className="text-neutral-500 text-xs">▶</span>
    </button>
  )
}

const CONSONANT_POSITIONS = [
  { c: 'ㄱ', initial: 'g or k', final: 'k (unreleased, stop)' },
  { c: 'ㄴ', initial: 'n', final: 'n (nasal)' },
  { c: 'ㄷ', initial: 'd or t', final: 't (unreleased, stop)' },
  { c: 'ㄹ', initial: 'r (flap)', final: 'l (lateral)' },
  { c: 'ㅁ', initial: 'm', final: 'm (nasal)' },
  { c: 'ㅂ', initial: 'b or p', final: 'p (unreleased, stop)' },
  { c: 'ㅅ', initial: 's', final: 't (unreleased)' },
  { c: 'ㅇ', initial: 'silent', final: 'ng (nasal)' },
  { c: 'ㅈ', initial: 'j', final: 't (unreleased)' },
  { c: 'ㅎ', initial: 'h', final: 'weakens/silent' },
]

const TENSE = [
  { plain: 'ㄱ', tense: 'ㄲ', plainEx: '가', tenseEx: '까' },
  { plain: 'ㄷ', tense: 'ㄸ', plainEx: '다', tenseEx: '따' },
  { plain: 'ㅂ', tense: 'ㅃ', plainEx: '바', tenseEx: '빠' },
  { plain: 'ㅅ', tense: 'ㅆ', plainEx: '사', tenseEx: '싸' },
  { plain: 'ㅈ', tense: 'ㅉ', plainEx: '자', tenseEx: '짜' },
]

const ASPIRATED = [
  { plain: 'ㄱ', asp: 'ㅋ', plainEx: '가', aspEx: '카' },
  { plain: 'ㄷ', asp: 'ㅌ', plainEx: '다', aspEx: '타' },
  { plain: 'ㅂ', asp: 'ㅍ', plainEx: '바', aspEx: '파' },
  { plain: 'ㅈ', asp: 'ㅊ', plainEx: '자', aspEx: '차' },
]

const PARTICLES = [
  { particle: '은/는', fn: 'Topic marker', ex: '저는 (as for me...)' },
  { particle: '이/가', fn: 'Subject marker', ex: '제가 (I, as subject)' },
  { particle: '을/를', fn: 'Object marker', ex: '밥을 (rice, as object)' },
  { particle: '에', fn: 'Location/time', ex: '학교에 (at school)' },
  { particle: '에서', fn: 'Action location', ex: '학교에서 (at school, doing something)' },
  { particle: '와/과', fn: 'And (formal)', ex: '사과와 배 (apple and pear)' },
]

function Section({ title, children }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}

function WritingRules() {
  return (
    <div className="space-y-5">
      {/* ㅇ section */}
      <Section title="How ㅇ works">
        <div className="space-y-3 text-sm text-neutral-300">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Start of a syllable — silent placeholder</p>
            <p>ㅇ is silent. The vowel sounds alone.</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              {['아','어','이','오','우'].map(s => <ListenBtn key={s} text={s} />)}
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">End of a syllable (batchim) — "ng" sound</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              {[['방','bang'],['강','gang'],['영','yeong']].map(([k,r]) => (
                <div key={k} className="flex items-center gap-1">
                  <ListenBtn text={k} label={k} />
                  <span className="text-neutral-500 text-xs">({r})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-neutral-800 rounded p-3 text-xs font-mono space-y-1">
            <div><span className="hangul text-base">ㅇ + ㅏ = 아</span> <span className="text-neutral-500 ml-2">← silent ㅇ</span></div>
            <div><span className="hangul text-base">방 = ㅂ + ㅏ + ㅇ</span> <span className="text-neutral-500 ml-2">← ㅇ = ng</span></div>
          </div>
        </div>
      </Section>

      {/* Consonant positions */}
      <Section title="Consonants that change sound by position">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Consonant</th>
                <th className="py-2 pr-4">Start of syllable</th>
                <th className="py-2">End of syllable (batchim)</th>
              </tr>
            </thead>
            <tbody>
              {CONSONANT_POSITIONS.map(row => (
                <tr key={row.c} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4 hangul text-xl text-neutral-100">{row.c}</td>
                  <td className="py-2 pr-4 text-neutral-300">{row.initial}</td>
                  <td className="py-2 text-neutral-400">{row.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Liaison */}
      <Section title="Liaison rules (연음)">
        <p className="text-sm text-neutral-300">When a syllable ends in a consonant and the next starts with ㅇ (silent), the consonant moves to the next syllable.</p>
        <div className="space-y-2 text-sm">
          {[
            ['음악', '음 + 악', '으막', 'eu-mak'],
            ['한국어', '한 + 국 + 어', '한구거', 'han-gu-geo'],
            ['먹어요', '먹 + 어요', '머거요', 'meo-geo-yo'],
          ].map(([orig, split, sounds, roman]) => (
            <div key={orig} className="flex items-center gap-2 flex-wrap">
              <ListenBtn text={orig} label={orig} />
              <span className="hangul text-neutral-400 text-xs">{split}</span>
              <span className="text-neutral-600">→</span>
              <span className="hangul text-neutral-300 text-sm">sounds like {sounds}</span>
              <span className="text-neutral-500 text-xs">({roman})</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Double consonants */}
      <Section title="Double consonants (tense sounds)">
        <p className="text-sm text-neutral-300">ㄲ ㄸ ㅃ ㅆ ㅉ — no aspiration, glottalized, tighter than plain.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Plain</th>
                <th className="py-2 pr-4">Tense</th>
                <th className="py-2">Compare</th>
              </tr>
            </thead>
            <tbody>
              {TENSE.map(row => (
                <tr key={row.tense} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4">
                    <ListenBtn text={row.plainEx} label={row.plain + ' · ' + row.plainEx} />
                  </td>
                  <td className="py-2 pr-4">
                    <ListenBtn text={row.tenseEx} label={row.tense + ' · ' + row.tenseEx} />
                  </td>
                  <td className="py-2 text-neutral-500 text-xs">relaxed → tense</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Aspirated */}
      <Section title="Aspirated consonants">
        <p className="text-sm text-neutral-300">ㅋ ㅌ ㅍ ㅊ ㅎ — strong burst of air. Hand test: feel airflow.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Plain (little air)</th>
                <th className="py-2 pr-4">Aspirated (strong air)</th>
              </tr>
            </thead>
            <tbody>
              {ASPIRATED.map(row => (
                <tr key={row.asp} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4">
                    <ListenBtn text={row.plainEx} label={row.plain + ' · ' + row.plainEx} />
                  </td>
                  <td className="py-2 pr-4">
                    <ListenBtn text={row.aspEx} label={row.asp + ' · ' + row.aspEx} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}

function SentenceStructure() {
  return (
    <div className="space-y-5">
      {/* Word order */}
      <Section title="Word order">
        <p className="text-sm text-neutral-300">Korean = Subject + Object + Verb</p>
        <p className="text-sm text-neutral-400">English/French = Subject + Verb + Object</p>
        <div className="mt-3 space-y-3">
          {[
            { ko: '나는 밥을 먹어요.', en: 'I eat rice.', parts: ['나는 (I)', '밥을 (rice)', '먹어요 (eat)'] },
            { ko: '그는 음악을 들어요.', en: 'He listens to music.', parts: ['그는 (he)', '음악을 (music)', '들어요 (listen)'] },
            { ko: '저는 한국어를 배워요.', en: 'I learn Korean.', parts: ['저는 (I)', '한국어를 (Korean)', '배워요 (learn)'] },
          ].map(({ ko, en, parts }) => (
            <div key={ko} className="bg-neutral-800 rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="hangul text-neutral-100">{ko}</span>
                <ListenBtn text={ko} label="▶" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {parts.map((p, i) => (
                  <span key={i} className={[
                    'text-xs px-2 py-1 rounded',
                    i === 0 ? 'bg-blue-900/50 text-blue-300' : '',
                    i === 1 ? 'bg-amber-900/50 text-amber-300' : '',
                    i === 2 ? 'bg-green-900/50 text-green-300' : '',
                  ].join(' ')}>{p}</span>
                ))}
              </div>
              <p className="text-neutral-400 text-xs">{en}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* No articles/gender */}
      <Section title="No articles, no gender">
        <div className="text-sm text-neutral-300 space-y-2">
          <p>No "le/la/un/une" — nouns have no gender.</p>
          <div className="bg-neutral-800 rounded p-3 text-sm space-y-1">
            <div><span className="hangul text-neutral-100">친구</span> <span className="text-neutral-400">= friend (male or female, same word)</span></div>
            <div className="text-neutral-500 text-xs">French: "un ami / une amie" → Korean: just 친구</div>
          </div>
        </div>
      </Section>

      {/* Particles */}
      <Section title="Particles (markers)">
        <p className="text-sm text-neutral-300">Korean uses particles after nouns to show their role in the sentence.</p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Particle</th>
                <th className="py-2 pr-4">Function</th>
                <th className="py-2">Example</th>
              </tr>
            </thead>
            <tbody>
              {PARTICLES.map(row => (
                <tr key={row.particle} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4 hangul text-neutral-100 font-medium">{row.particle}</td>
                  <td className="py-2 pr-4 text-neutral-300">{row.fn}</td>
                  <td className="py-2 hangul text-neutral-400 text-xs">{row.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500 mt-2">은/는 vs 이/가 distinction is subtle — introduced here, mastered later.</p>
      </Section>

      {/* Questions */}
      <Section title="How to form questions">
        <div className="text-sm text-neutral-300 space-y-3">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Method 1 — Intonation only (informal)</p>
            <div className="flex items-center gap-2">
              <ListenBtn text="밥 먹어?" label="밥 먹어?" />
              <span className="text-neutral-500 text-xs">raise voice at end</span>
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Method 2 — Formal: same word, rising intonation + 요</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><ListenBtn text="먹어요." label="먹어요." /><span className="text-neutral-500 text-xs">statement</span></div>
              <div className="flex items-center gap-2"><ListenBtn text="먹어요?" label="먹어요?" /><span className="text-neutral-500 text-xs">question (rising tone)</span></div>
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Method 3 — Question words</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[['뭐','what'],['어디','where'],['언제','when'],['누구','who'],['왜','why'],['어떻게','how'],['얼마','how much']].map(([k,e]) => (
                <div key={k} className="flex items-center gap-2">
                  <ListenBtn text={k} label={k} />
                  <span className="text-neutral-500">{e}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ListenBtn text="이거 뭐예요?" label="이거 뭐예요?" />
              <span className="text-neutral-500 text-xs">What is this?</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Politeness */}
      <Section title="Politeness levels">
        <div className="text-sm space-y-2">
          {[
            { level: 'Level 1 — Informal', note: 'friends, children', ex: '먹어.', meaning: 'Eat. / I eat.' },
            { level: 'Level 2 — Polite informal', note: 'most situations, add 요', ex: '먹어요.', meaning: 'I eat. / Are you eating?' },
            { level: 'Level 3 — Formal', note: 'official, older strangers', ex: '먹습니다.', meaning: 'I eat. (formal)' },
          ].map(({ level, note, ex, meaning }) => (
            <div key={level} className="bg-neutral-800 rounded p-3">
              <p className="text-neutral-300 font-medium text-xs">{level} <span className="text-neutral-500 font-normal">— {note}</span></p>
              <div className="flex items-center gap-2 mt-1">
                <ListenBtn text={ex} label={ex} />
                <span className="text-neutral-500 text-xs">{meaning}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-neutral-500 mt-1">Default to 요 ending. It works in 90% of situations.</p>
        </div>
      </Section>

      {/* Japanese comparison */}
      <Section title="Comparison with Japanese">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-400 text-xs uppercase tracking-wide mb-2">Similar</p>
            <ul className="text-neutral-300 space-y-1 text-xs">
              <li>SOV word order</li>
              <li>Particles system (wa/ga/wo ≈ 은/는, 이/가, 을/를)</li>
              <li>Politeness levels</li>
              <li>No gender on nouns</li>
            </ul>
          </div>
          <div>
            <p className="text-amber-400 text-xs uppercase tracking-wide mb-2">Different</p>
            <ul className="text-neutral-400 space-y-1 text-xs">
              <li>Different writing systems</li>
              <li>Different sounds</li>
              <li>Korean has tense/aspirated contrasts Japanese lacks</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default function LanguageRules() {
  const [tab, setTab] = useState('writing')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-neutral-100 mb-4">Language Rules</h2>

      <div className="flex gap-1 mb-6 border-b border-neutral-800">
        {[['writing', 'Writing Rules'], ['structure', 'Sentence Structure']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              tab === id
                ? 'border-neutral-100 text-neutral-100 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'writing' && <WritingRules />}
      {tab === 'structure' && <SentenceStructure />}
    </div>
  )
}
