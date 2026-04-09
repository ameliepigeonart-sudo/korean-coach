import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { UNITS } from '../data/units.js'

const MODULE_NAMES = {
  1: 'Module 1 : Voyelles de base',
  2: 'Module 2 : Voyelles en Y',
  3: 'Module 3 : Consonnes stables',
  4: 'Module 4 : Jeux de contrastes',
  5: 'Module 5 : Batchim',
  6: 'Module 6 : Mots fréquents',
  7: 'Module 7 : Contenu réel',
}

export default function Today({ setScreen, userId }) {
  const [weakUnits, setWeakUnits] = useState([])
  const [currentModule, setCurrentModule] = useState(1)
  const [anchorMode, setAnchorMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [userId])

  async function loadProgress() {
    setLoading(true)
    const { data } = await supabase
      .from('weak_units')
      .select('*, units(*)')
      .eq('user_id', userId)
      .order('error_count', { ascending: false })
      .limit(10)

    if (data) setWeakUnits(data)

    const { data: lessons } = await supabase
      .from('lessons')
      .select('module')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)

    if (lessons && lessons.length > 0) {
      const last = lessons[0].module
      if (last < 7) setCurrentModule(last)
    }
    setLoading(false)
  }

  const weakPatterns = weakUnits.slice(0, 3)
  const needsAnchor = weakPatterns.some(u => u.error_count >= 3)

  if (loading) return <div className="p-6 text-neutral-400">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-100">Aujourd'hui</h2>
        <p className="text-sm text-neutral-400 mt-1">Plan de leçon de 15 minutes</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-1">Module actuel</div>
        <div className="text-neutral-100 font-medium">{MODULE_NAMES[currentModule]}</div>
        <div className="mt-3 text-xs text-neutral-500">
          <div>2 min — Écouter et répéter</div>
          <div>5 min — Drill de contrastes</div>
          <div>5 min — Drill d'écriture</div>
          <div>3 min — Micro-dialogue</div>
          <div>2 min — Test rapide</div>
        </div>
        <button
          onClick={() => setScreen('trainer')}
          className="mt-4 w-full bg-neutral-100 text-neutral-950 font-medium py-2 rounded text-sm hover:bg-neutral-200 transition-colors"
        >
          Prochaine leçon
        </button>
      </div>

      {weakPatterns.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-2">Résumé des schémas</div>
          {weakPatterns[0] && (
            <p className="text-sm text-neutral-200">
              Problème principal : {weakPatterns[0].units?.type} ({weakPatterns[0].units?.display_ko})
            </p>
          )}
          {weakPatterns[1] && (
            <p className="text-sm text-neutral-400 mt-1">
              Problème secondaire : {weakPatterns[1].units?.type} ({weakPatterns[1].units?.display_ko})
            </p>
          )}
          {needsAnchor && (
            <div className="mt-3 pt-3 border-t border-neutral-800">
              <p className="text-sm text-amber-400">Consolide avant de continuer.</p>
              <button
                onClick={() => setAnchorMode(true)}
                className="mt-2 text-sm text-neutral-300 underline"
              >
                Générer une leçon d'ancrage
              </button>
              {anchorMode && (
                <p className="text-xs text-neutral-400 mt-2">
                  Leçon d'ancrage ciblant : {weakPatterns.map(u => u.units?.display_ko).join(', ')}. Utilise Entraînement pour pratiquer ces unités.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-2">Tous les modules</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MODULE_NAMES).map(([mod, name]) => (
            <div key={mod} className="text-xs text-neutral-400 py-1">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
