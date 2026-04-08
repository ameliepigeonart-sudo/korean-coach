import { supabase } from '../lib/supabase.js'

const SCREENS = [
  { id: 'today', label: 'Today' },
  { id: 'trainer', label: 'Trainer' },
  { id: 'hangul', label: 'Hangul' },
  { id: 'dialogues', label: 'Dialogues' },
  { id: 'rules', label: 'Rules' },
  { id: 'chat', label: 'Chat' },
  { id: 'capture', label: 'Capture' },
  { id: 'import', label: 'Import' },
  { id: 'review', label: 'Review' },
]

export default function Nav({ screen, setScreen }) {
  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex gap-1 overflow-x-auto">
          {SCREENS.map(s => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                screen === s.id
                  ? 'bg-neutral-100 text-neutral-950 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-neutral-500 hover:text-neutral-300 ml-4 shrink-0"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
