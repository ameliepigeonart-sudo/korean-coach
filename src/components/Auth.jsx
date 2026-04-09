import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    let result
    if (mode === 'signin') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }
    if (result.error) setError(result.error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Korean Sound & Script Coach</h1>
        <p className="text-neutral-400 mb-8 text-sm">
          {mode === 'signin' ? 'Connexion pour continuer.' : 'Créer un compte.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Courriel</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-neutral-900 font-semibold py-2.5 rounded text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </button>
        </form>
        <p className="mt-5 text-sm text-neutral-500 text-center">
          {mode === 'signin' ? (
            <>Pas de compte ?{' '}
              <button onClick={() => setMode('signup')} className="text-neutral-300 underline">
                Créer un.
              </button>
            </>
          ) : (
            <>Déjà un compte ?{' '}
              <button onClick={() => setMode('signin')} className="text-neutral-300 underline">
                Connexion.
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
