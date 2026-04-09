export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, slow } = req.body
  const apiKey = process.env.GOOGLE_TTS_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Google TTS API key not configured' })
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'ko-KR',
            name: 'ko-KR-Neural2-C',
            ssmlGender: 'MALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: slow ? 0.7 : 1.0,
            pitch: 0,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      return res.status(500).json({ error: data.error.message })
    }

    res.json({ audioContent: data.audioContent })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
