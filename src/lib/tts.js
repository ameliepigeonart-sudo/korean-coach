export async function speakKorean(text, slow = false) {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, slow }),
    })
    const data = await response.json()
    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
      await audio.play()
    }
  } catch (err) {
    // Repli sur le TTS du navigateur si Google échoue
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ko-KR'
    utter.rate = slow ? 0.6 : 1.0
    window.speechSynthesis.speak(utter)
  }
}
