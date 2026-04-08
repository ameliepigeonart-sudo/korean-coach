export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  // Support both ANTHROPIC_API_KEY and VITE_ANTHROPIC_API_KEY
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a Korean language tutor for a complete beginner who speaks English and French.
Your tone is direct and minimal.
No motivational language. No encouragement phrases.
No "great job", "well done", "keep it up".
Only clear, precise linguistic information.

The learner is a musician with excellent ear for sound.
She learns visually, aurally, and kinesthetically (handwriting). She watches Korean shows with English subtitles.

When explaining sounds: describe mouth position, tongue position, airflow. Be precise.
When showing Korean text: always show Hangul first, then English meaning. Never use French romanization.
When explaining grammar: use short examples, show the pattern clearly.

Current learning: Hangul alphabet, base vowels, consonants, syllable blocks.

Keep responses concise. Use line breaks for clarity.
If showing a dialogue or list, format it cleanly.`,
        messages,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(response.status).json({ error })
    }

    const data = await response.json()
    return res.status(200).json({ text: data.content[0].text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
