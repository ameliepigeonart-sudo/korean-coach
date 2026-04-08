import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import Auth from './components/Auth.jsx'
import Nav from './components/Nav.jsx'
import Today from './components/Today.jsx'
import UnitTrainer from './components/UnitTrainer.jsx'
import CapturePhoto from './components/CapturePhoto.jsx'
import ImportAudio from './components/ImportAudio.jsx'
import Review from './components/Review.jsx'
import HangulMap from './components/HangulMap.jsx'
import Dialogues from './components/Dialogues.jsx'
import Chat from './components/Chat.jsx'
import LanguageRules from './components/LanguageRules.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('today')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-600 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Nav screen={screen} setScreen={setScreen} />
      <main className="pb-20">
        {screen === 'today' && <Today setScreen={setScreen} userId={session.user.id} />}
        {screen === 'trainer' && <UnitTrainer userId={session.user.id} />}
        {screen === 'hangul' && <HangulMap />}
        {screen === 'dialogues' && <Dialogues />}
        {screen === 'rules' && <LanguageRules />}
        {screen === 'chat' && <Chat />}
        {screen === 'capture' && <CapturePhoto userId={session.user.id} />}
        {screen === 'import' && <ImportAudio userId={session.user.id} />}
        {screen === 'review' && <Review userId={session.user.id} />}
      </main>
    </div>
  )
}
