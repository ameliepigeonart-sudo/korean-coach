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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-neutral-100 mb-2">Korean Sound & Script Coach</h1>
        <p className="text-neutral-400 mb-8 text-sm">
          {mode === 'signin' ? 'Sign in to continue.' : 'Create an account.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-100 text-neutral-950 font-medium py-2 rounded text-sm hover:bg-neutral-200 transition-colors"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-neutral-500">
          {mode === 'signin' ? (
            <>No account? <button onClick={() => setMode('signup')} className="text-neutral-300 underline">Create one.</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode('signin')} className="text-neutral-300 underline">Sign in.</button></>
          )}
        </p>
      </div>
    </div>
  )
}
