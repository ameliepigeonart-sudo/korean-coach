import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { UNITS } from '../data/units.js'

const MODULE_NAMES = {
  1: 'Module 1: Base vowels',
  2: 'Module 2: Y-vowels',
  3: 'Module 3: Stable consonants',
  4: 'Module 4: Contrast sets',
  5: 'Module 5: Batchim',
  6: 'Module 6: High-frequency words',
  7: 'Module 7: Real content',
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

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-100">Today</h2>
        <p className="text-sm text-neutral-400 mt-1">15-minute lesson plan</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-1">Current module</div>
        <div className="text-neutral-100 font-medium">{MODULE_NAMES[currentModule]}</div>
        <div className="mt-3 text-xs text-neutral-500">
          <div>2 min — Listen and repeat</div>
          <div>5 min — Contrast drill</div>
          <div>5 min — Handwriting drill</div>
          <div>3 min — Micro-dialogue</div>
          <div>2 min — Quick test</div>
        </div>
        <button
          onClick={() => setScreen('trainer')}
          className="mt-4 w-full bg-neutral-100 text-neutral-950 font-medium py-2 rounded text-sm hover:bg-neutral-200 transition-colors"
        >
          Next Lesson
        </button>
      </div>

      {weakPatterns.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-2">Pattern summary</div>
          {weakPatterns[0] && (
            <p className="text-sm text-neutral-200">
              Main issue: {weakPatterns[0].units?.type} confusions ({weakPatterns[0].units?.display_ko})
            </p>
          )}
          {weakPatterns[1] && (
            <p className="text-sm text-neutral-400 mt-1">
              Secondary issue: {weakPatterns[1].units?.type} ({weakPatterns[1].units?.display_ko})
            </p>
          )}
          {needsAnchor && (
            <div className="mt-3 pt-3 border-t border-neutral-800">
              <p className="text-sm text-amber-400">Anchor before moving on.</p>
              <button
                onClick={() => setAnchorMode(true)}
                className="mt-2 text-sm text-neutral-300 underline"
              >
                Generate Anchoring Lesson
              </button>
              {anchorMode && (
                <p className="text-xs text-neutral-400 mt-2">
                  Anchoring lesson targets: {weakPatterns.map(u => u.units?.display_ko).join(', ')}. Use the Trainer to practice these units.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-2">All modules</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MODULE_NAMES).map(([mod, name]) => (
            <div
              key={mod}
              className="text-xs text-neutral-400 py-1"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
