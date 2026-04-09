import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { speakKorean } from '../lib/tts.js'

export default function Review({ userId }) {
  const [weakUnits, setWeakUnits] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId])

  async function loadData() {
    setLoading(true)
    const [weakRes, attemptsRes] = await Promise.all([
      supabase
        .from('weak_units')
        .select('*, units(*)')
        .eq('user_id', userId)
        .order('error_count', { ascending: false })
        .limit(20),
      supabase
        .from('attempts_speech')
        .select('*, units(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ])
    if (weakRes.data) setWeakUnits(weakRes.data)
    if (attemptsRes.data) setAttempts(attemptsRes.data)
    setLoading(false)
  }

  const topWeak = weakUnits.slice(0, 3)
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length)
    : null

  if (loading) return <div className="p-6 text-neutral-400">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-semibold text-neutral-100">Révision</h2>

      {avgScore !== null && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-sm text-neutral-400">Score moyen</div>
          <div className="text-3xl font-bold text-neutral-100 mt-1">
            {avgScore}<span className="text-base text-neutral-500">/100</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1">Basé sur {attempts.length} tentatives</div>
        </div>
      )}

      {topWeak.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-3">Unités faibles</div>
          <div className="space-y-2">
            {topWeak.map(wu => (
              <div key={wu.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl hangul text-neutral-100">{wu.units?.display_ko}</span>
                  <div>
                    <div className="text-sm text-neutral-300">{wu.units?.meaning_fr}</div>
                    <div className="text-xs text-neutral-500">{wu.error_count} erreurs</div>
                  </div>
                </div>
                <button
                  onClick={() => speakKorean(wu.units?.display_ko)}
                  className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                >
                  Écouter
                </button>
              </div>
            ))}
          </div>
          {topWeak.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-800">
              <p className="text-sm text-neutral-400">
                Problème principal : confusions de type {topWeak[0].units?.type}.
              </p>
              {topWeak[1] && (
                <p className="text-sm text-neutral-500 mt-1">
                  Problème secondaire : {topWeak[1].units?.type} ({topWeak[1].units?.display_ko}).
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {attempts.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-3">Tentatives récentes</div>
          <div className="space-y-2">
            {attempts.slice(0, 10).map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="hangul text-neutral-200 mr-2">{a.units?.display_ko}</span>
                  <span className="text-neutral-500">entendu : <span className="hangul text-neutral-400">{a.stt_text || '—'}</span></span>
                </div>
                <span className={`font-medium ${a.score >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
                  {a.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {attempts.length === 0 && weakUnits.length === 0 && (
        <p className="text-neutral-500 text-sm">Aucune donnée. Complète des leçons dans Entraînement.</p>
      )}
    </div>
  )
}
