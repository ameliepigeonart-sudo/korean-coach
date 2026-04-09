import { useState } from 'react'
import { speakKorean } from '../lib/tts.js'

function ListenBtn({ text, label }) {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={async () => { setActive(true); await speakKorean(text); setTimeout(() => setActive(false), 600) }}
      className={`hangul inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-700 text-neutral-200 hover:border-neutral-500 transition-all text-sm ${active ? 'opacity-60 scale-95' : ''}`}
    >
      {label || text} <span className="text-neutral-500 text-xs">▶</span>
    </button>
  )
}

const CONSONANT_POSITIONS = [
  { c: 'ㄱ', initial: 'g ou k', final: 'k (non relâché, stop)' },
  { c: 'ㄴ', initial: 'n', final: 'n (nasal)' },
  { c: 'ㄷ', initial: 'd ou t', final: 't (non relâché, stop)' },
  { c: 'ㄹ', initial: 'r (battement)', final: 'l (latéral)' },
  { c: 'ㅁ', initial: 'm', final: 'm (nasal)' },
  { c: 'ㅂ', initial: 'b ou p', final: 'p (non relâché, stop)' },
  { c: 'ㅅ', initial: 's', final: 't (non relâché)' },
  { c: 'ㅇ', initial: 'silencieux', final: 'ng (nasal)' },
  { c: 'ㅈ', initial: 'j', final: 't (non relâché)' },
  { c: 'ㅎ', initial: 'h', final: 's\'affaiblit/silencieux' },
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
  { particle: '은/는', fn: 'Marqueur de thème', ex: '저는 (quant à moi...)' },
  { particle: '이/가', fn: 'Marqueur de sujet', ex: '제가 (moi, en tant que sujet)' },
  { particle: '을/를', fn: 'Marqueur d\'objet', ex: '밥을 (le riz, en tant qu\'objet)' },
  { particle: '에', fn: 'Lieu/temps', ex: '학교에 (à l\'école)' },
  { particle: '에서', fn: 'Lieu d\'action', ex: '학교에서 (à l\'école, en train de faire quelque chose)' },
  { particle: '와/과', fn: 'Et (formel)', ex: '사과와 배 (pomme et poire)' },
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
      <Section title="Comment fonctionne ㅇ">
        <div className="space-y-3 text-sm text-neutral-300">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Début de syllabe — silencieux</p>
            <p>ㅇ est silencieux. La voyelle sonne seule.</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              {['아','어','이','오','우'].map(s => <ListenBtn key={s} text={s} />)}
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Fin de syllabe (batchim) — son "ng"</p>
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
            <div><span className="hangul text-base">ㅇ + ㅏ = 아</span> <span className="text-neutral-500 ml-2">← ㅇ silencieux</span></div>
            <div><span className="hangul text-base">방 = ㅂ + ㅏ + ㅇ</span> <span className="text-neutral-500 ml-2">← ㅇ = ng</span></div>
          </div>
        </div>
      </Section>

      <Section title="Consonnes qui changent de son selon la position">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Consonne</th>
                <th className="py-2 pr-4">Début de syllabe</th>
                <th className="py-2">Fin de syllabe (batchim)</th>
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

      <Section title="Règles de liaison (연음)">
        <p className="text-sm text-neutral-300">Quand une syllabe se termine par une consonne et la suivante commence par ㅇ (silencieux), la consonne se déplace.</p>
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
              <span className="hangul text-neutral-300 text-sm">sonne comme {sounds}</span>
              <span className="text-neutral-500 text-xs">({roman})</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Consonnes doubles (sons tendus)">
        <p className="text-sm text-neutral-300">ㄲ ㄸ ㅃ ㅆ ㅉ — sans aspiration, glottalisé, plus tendu que les consonnes simples.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Simple</th>
                <th className="py-2 pr-4">Tendu</th>
                <th className="py-2">Comparaison</th>
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
                  <td className="py-2 text-neutral-500 text-xs">relâché → tendu</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Consonnes aspirées">
        <p className="text-sm text-neutral-300">ㅋ ㅌ ㅍ ㅊ ㅎ — forte expulsion d'air. Test de la main : sentir le souffle.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Simple (peu d'air)</th>
                <th className="py-2 pr-4">Aspiré (fort souffle)</th>
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
      <Section title="Ordre des mots">
        <p className="text-sm text-neutral-300">Coréen = Sujet + Objet + Verbe</p>
        <p className="text-sm text-neutral-400">Français/Anglais = Sujet + Verbe + Objet</p>
        <div className="mt-3 space-y-3">
          {[
            { ko: '나는 밥을 먹어요.', fr: 'Je mange du riz.', parts: ['나는 (je)', '밥을 (riz)', '먹어요 (mange)'] },
            { ko: '그는 음악을 들어요.', fr: 'Il écoute de la musique.', parts: ['그는 (il)', '음악을 (musique)', '들어요 (écoute)'] },
            { ko: '저는 한국어를 배워요.', fr: 'J\'apprends le coréen.', parts: ['저는 (je)', '한국어를 (coréen)', '배워요 (apprends)'] },
          ].map(({ ko, fr, parts }) => (
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
              <p className="text-neutral-400 text-xs">{fr}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Pas d'articles, pas de genre">
        <div className="text-sm text-neutral-300 space-y-2">
          <p>Pas de "le/la/un/une" — les noms n'ont pas de genre.</p>
          <div className="bg-neutral-800 rounded p-3 text-sm space-y-1">
            <div><span className="hangul text-neutral-100">친구</span> <span className="text-neutral-400">= ami(e) (masculin ou féminin, même mot)</span></div>
            <div className="text-neutral-500 text-xs">Français : "un ami / une amie" → Coréen : juste 친구</div>
          </div>
        </div>
      </Section>

      <Section title="Particules (marqueurs)">
        <p className="text-sm text-neutral-300">Le coréen utilise des particules après les noms pour indiquer leur rôle dans la phrase.</p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="py-2 pr-4">Particule</th>
                <th className="py-2 pr-4">Fonction</th>
                <th className="py-2">Exemple</th>
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
        <p className="text-xs text-neutral-500 mt-2">La distinction 은/는 vs 이/가 est subtile — introduite ici, maîtrisée plus tard.</p>
      </Section>

      <Section title="Comment former les questions">
        <div className="text-sm text-neutral-300 space-y-3">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Méthode 1 — Intonation montante (informel)</p>
            <div className="flex items-center gap-2">
              <ListenBtn text="밥 먹어?" label="밥 먹어?" />
              <span className="text-neutral-500 text-xs">monter la voix à la fin</span>
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Méthode 2 — Formel : même mot, intonation montante + 요</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><ListenBtn text="먹어요." label="먹어요." /><span className="text-neutral-500 text-xs">affirmation</span></div>
              <div className="flex items-center gap-2"><ListenBtn text="먹어요?" label="먹어요?" /><span className="text-neutral-500 text-xs">question (ton montant)</span></div>
            </div>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Méthode 3 — Mots interrogatifs</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[['뭐','quoi'],['어디','où'],['언제','quand'],['누구','qui'],['왜','pourquoi'],['어떻게','comment'],['얼마','combien']].map(([k,e]) => (
                <div key={k} className="flex items-center gap-2">
                  <ListenBtn text={k} label={k} />
                  <span className="text-neutral-500">{e}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ListenBtn text="이거 뭐예요?" label="이거 뭐예요?" />
              <span className="text-neutral-500 text-xs">Qu'est-ce que c'est ?</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Niveaux de politesse">
        <div className="text-sm space-y-2">
          {[
            { level: 'Niveau 1 — Informel', note: 'amis, enfants', ex: '먹어.', meaning: 'Mange. / Je mange.' },
            { level: 'Niveau 2 — Poli informel', note: 'la plupart des situations, ajouter 요', ex: '먹어요.', meaning: 'Je mange. / Tu manges ?' },
            { level: 'Niveau 3 — Formel', note: 'officiel, personnes âgées inconnues', ex: '먹습니다.', meaning: 'Je mange. (formel)' },
          ].map(({ level, note, ex, meaning }) => (
            <div key={level} className="bg-neutral-800 rounded p-3">
              <p className="text-neutral-300 font-medium text-xs">{level} <span className="text-neutral-500 font-normal">— {note}</span></p>
              <div className="flex items-center gap-2 mt-1">
                <ListenBtn text={ex} label={ex} />
                <span className="text-neutral-500 text-xs">{meaning}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-neutral-500 mt-1">Utiliser par défaut la terminaison 요. Elle fonctionne dans 90 % des situations.</p>
        </div>
      </Section>

      <Section title="Comparaison avec le japonais">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-400 text-xs uppercase tracking-wide mb-2">Similaire</p>
            <ul className="text-neutral-300 space-y-1 text-xs">
              <li>Ordre SOV</li>
              <li>Système de particules (wa/ga/wo ≈ 은/는, 이/가, 을/를)</li>
              <li>Niveaux de politesse</li>
              <li>Pas de genre sur les noms</li>
            </ul>
          </div>
          <div>
            <p className="text-amber-400 text-xs uppercase tracking-wide mb-2">Différent</p>
            <ul className="text-neutral-400 space-y-1 text-xs">
              <li>Systèmes d'écriture différents</li>
              <li>Sons différents</li>
              <li>Le coréen a des contrastes tendus/aspirés absents en japonais</li>
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
      <h2 className="text-xl font-semibold text-neutral-100 mb-4">Règles</h2>

      <div className="flex gap-1 mb-6 border-b border-neutral-800">
        {[['writing', 'Règles d\'écriture'], ['structure', 'Structure de phrases']].map(([id, label]) => (
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
