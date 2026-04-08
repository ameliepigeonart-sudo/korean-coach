import { useState, useRef } from 'react'

export default function CapturePhoto({ userId }) {
  const [image, setImage] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage(url)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1]
      setImageData(base64)
    }
    reader.readAsDataURL(file)
    setExtractedText('')
    setTranslation('')
    setError('')
  }

  async function analyzeImage() {
    if (!imageData) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageData,
                }
              },
              {
                type: 'text',
                text: 'Extract all Korean text from this image. Return only the Korean text, nothing else.'
              }
            ]
          }]
        })
      })
      const data = await response.json()
      if (data.content && data.content[0]) {
        const korean = data.content[0].text.trim()
        setExtractedText(korean)
        await translateText(korean)
      } else {
        setError('No text detected.')
      }
    } catch (err) {
      setError('Error analyzing image. Check API key configuration.')
    }
    setLoading(false)
  }

  async function translateText(text) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 512,
          messages: [{
            role: 'user',
            content: `Translate this Korean text to English. Return only the translation: ${text}`
          }]
        })
      })
      const data = await response.json()
      if (data.content && data.content[0]) {
        setTranslation(data.content[0].text.trim())
      }
    } catch (err) {
      // translation failed silently
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold text-neutral-100">Capture Photo</h2>
      <p className="text-sm text-neutral-400">Upload a photo with Korean text to extract and practice.</p>

      <div className="space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current.click()}
          className="w-full py-3 border border-dashed border-neutral-700 text-neutral-400 text-sm rounded hover:border-neutral-500 transition-colors"
        >
          Select or capture photo
        </button>

        {image && (
          <img src={image} alt="Captured" className="w-full max-h-64 object-contain rounded border border-neutral-800" />
        )}

        {imageData && (
          <button
            onClick={analyzeImage}
            disabled={loading}
            className="w-full bg-neutral-100 text-neutral-950 font-medium py-2 rounded text-sm hover:bg-neutral-200 transition-colors"
          >
            {loading ? 'Analyzing...' : 'Extract Korean text'}
          </button>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {extractedText && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
            <div>
              <div className="text-xs text-neutral-500 mb-1">Korean text</div>
              <textarea
                value={extractedText}
                onChange={e => setExtractedText(e.target.value)}
                className="w-full bg-neutral-800 text-neutral-100 hangul text-lg p-2 rounded border border-neutral-700 focus:outline-none focus:border-neutral-500"
                rows={3}
              />
            </div>
            {translation && (
              <div>
                <div className="text-xs text-neutral-500 mb-1">Translation</div>
                <p className="text-neutral-300 text-sm">{translation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
