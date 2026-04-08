import { useState, useRef } from 'react'

export default function ImportAudio({ userId }) {
  const [transcript, setTranscript] = useState('')
  const [translation, setTranslation] = useState('')
  const [chunks, setChunks] = useState([])
  const [recording, setRecording] = useState(false)
  const [practicing, setPracticing] = useState(null)
  const recognitionRef = useRef(null)

  function startRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition
    setRecording(true)
    let fullText = ''
    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fullText += event.results[i][0].transcript + ' '
        } else {
          interim = event.results[i][0].transcript
        }
      }
      setTranscript(fullText + interim)
    }
    recognition.onerror = () => {
      setRecording(false)
    }
    recognition.onend = () => {
      setRecording(false)
      if (fullText.trim()) {
        const parts = fullText.trim().split(/[.!?。]s*/).filter(Boolean)
        setChunks(parts)
      }
    }
    recognition.start()
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setRecording(false)
    if (transcript.trim()) {
      const parts = transcript.trim().split(/[.!?。]s*/).filter(Boolean)
      setChunks(parts)
    }
  }

  function speakChunk(text) {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ko-KR'
    utter.rate = 0.8
    window.speechSynthesis.speak(utter)
  }

  function practiceChunk(idx) {
    setPracticing(idx)
    speakChunk(chunks[idx])
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold text-neutral-100">Import Audio</h2>
      <p className="text-sm text-neutral-400">Record Korean speech for transcription and practice.</p>

      <div className="flex gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-neutral-100 text-neutral-950 font-medium text-sm rounded hover:bg-neutral-200 transition-colors"
          >
            Start recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-900 text-red-100 font-medium text-sm rounded hover:bg-red-800 transition-colors"
          >
            Stop recording
          </button>
        )}
      </div>

      {transcript && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-2">Transcript</div>
          <p className="text-neutral-200 hangul text-sm leading-relaxed">{transcript}</p>
        </div>
      )}

      {chunks.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-neutral-400">Practice chunks:</div>
          {chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded p-3 flex items-center justify-between gap-3"
            >
              <span className="text-neutral-200 hangul text-sm">{chunk}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => speakChunk(chunk)}
                  className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                >
                  Listen
                </button>
                <button
                  onClick={() => practiceChunk(idx)}
                  className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                >
                  Repeat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
